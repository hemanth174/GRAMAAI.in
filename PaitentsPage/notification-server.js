// notification-server.js - Real-time Notification System with MongoDB
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = 5002; // Separate port for notification service
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'hospital_notifications';

// MongoDB connection
let db;
let notificationsCollection;

// Rate limiting
const notificationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: 'Too many notifications sent, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/notifications', notificationLimiter);

// Connected clients by hospital
const connectedPatients = new Map(); // hospitalId -> Set of socketIds

// Initialize MongoDB
async function initMongoDB() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        notificationsCollection = db.collection('notifications');
        
        // Create indexes for better performance
        await notificationsCollection.createIndex({ hospitalId: 1, timestamp: -1 });
        await notificationsCollection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL
        
        console.log('📊 MongoDB connected successfully');
        console.log(`🔗 Database: ${DB_NAME}`);
        console.log('📋 Collections: notifications');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`🔌 Patient connected: ${socket.id}`);
    
    // Patient joins hospital room
    socket.on('joinHospital', (hospitalId) => {
        if (!hospitalId) return;
        
        socket.join(hospitalId);
        
        // Track connected patients
        if (!connectedPatients.has(hospitalId)) {
            connectedPatients.set(hospitalId, new Set());
        }
        connectedPatients.get(hospitalId).add(socket.id);
        
        console.log(`👥 Patient ${socket.id} joined hospital: ${hospitalId}`);
        console.log(`📊 Total patients in ${hospitalId}: ${connectedPatients.get(hospitalId).size}`);
        
        // Send recent notifications to newly connected patient
        sendRecentNotifications(socket, hospitalId);
    });
    
    // Patient disconnects
    socket.on('disconnect', () => {
        // Remove from all hospital rooms
        for (const [hospitalId, patients] of connectedPatients.entries()) {
            if (patients.has(socket.id)) {
                patients.delete(socket.id);
                if (patients.size === 0) {
                    connectedPatients.delete(hospitalId);
                }
                console.log(`👋 Patient ${socket.id} left hospital: ${hospitalId}`);
                break;
            }
        }
    });
});

// Send recent notifications to a patient
async function sendRecentNotifications(socket, hospitalId) {
    try {
        const recentNotifications = await notificationsCollection
            .find({ 
                hospitalId,
                status: 'active',
                timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
            })
            .sort({ timestamp: -1 })
            .limit(5)
            .toArray();
        
        if (recentNotifications.length > 0) {
            socket.emit('recentNotifications', recentNotifications);
        }
    } catch (error) {
        console.error('❌ Error fetching recent notifications:', error);
    }
}

// API Routes

// Get all notifications for a hospital
app.get('/api/notifications/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { page = 1, limit = 20, status = 'active' } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notifications = await notificationsCollection
            .find({ 
                hospitalId,
                ...(status !== 'all' && { status })
            })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
        
        const total = await notificationsCollection.countDocuments({ 
            hospitalId,
            ...(status !== 'all' && { status })
        });
        
        res.json({
            success: true,
            data: notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
});

// Send notification to all patients in a hospital
app.post('/api/notifications/send', async (req, res) => {
    try {
        const { hospitalId, message, sentBy, department, priority = 'normal' } = req.body;
        
        if (!hospitalId || !message || !sentBy) {
            return res.status(400).json({ 
                success: false, 
                error: 'hospitalId, message, and sentBy are required' 
            });
        }
        
        const notification = {
            _id: new Date().getTime().toString(), // Simple ID for this demo
            hospitalId,
            message: message.trim(),
            sentBy: sentBy.trim(),
            department: department || 'General',
            priority,
            timestamp: new Date(),
            status: 'active',
            readBy: []
        };
        
        // Save to MongoDB
        await notificationsCollection.insertOne(notification);
        
        // Send to all connected patients in this hospital
        const connectedCount = connectedPatients.get(hospitalId)?.size || 0;
        io.to(hospitalId).emit('newNotification', notification);
        
        console.log(`📢 Notification sent to hospital ${hospitalId}: "${message}"`);
        console.log(`👥 Reached ${connectedCount} connected patients`);
        
        res.json({
            success: true,
            message: 'Notification sent successfully',
            data: {
                notificationId: notification._id,
                recipientCount: connectedCount,
                hospitalId
            }
        });
    } catch (error) {
        console.error('❌ Error sending notification:', error);
        res.status(500).json({ success: false, error: 'Failed to send notification' });
    }
});

// Mark notification as read
app.post('/api/notifications/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { patientId } = req.body;
        
        if (!patientId) {
            return res.status(400).json({ success: false, error: 'patientId is required' });
        }
        
        await notificationsCollection.updateOne(
            { _id: notificationId },
            { $addToSet: { readBy: patientId } }
        );
        
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark as read' });
    }
});

// Delete/Archive notification
app.patch('/api/notifications/:notificationId/archive', async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        await notificationsCollection.updateOne(
            { _id: notificationId },
            { 
                $set: { 
                    status: 'archived',
                    archivedAt: new Date()
                }
            }
        );
        
        res.json({ success: true, message: 'Notification archived' });
    } catch (error) {
        console.error('❌ Error archiving notification:', error);
        res.status(500).json({ success: false, error: 'Failed to archive notification' });
    }
});

// Get notification statistics
app.get('/api/notifications/:hospitalId/stats', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        const stats = await notificationsCollection.aggregate([
            { $match: { hospitalId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                    archived: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } },
                    todayCount: {
                        $sum: {
                            $cond: [
                                { 
                                    $gte: [
                                        "$timestamp", 
                                        new Date(new Date().setHours(0, 0, 0, 0))
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]).toArray();
        
        const result = stats[0] || { total: 0, active: 0, archived: 0, todayCount: 0 };
        const connectedPatients = connectedPatients.get(hospitalId)?.size || 0;
        
        res.json({
            success: true,
            data: {
                ...result,
                connectedPatients
            }
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'Hospital Notification System',
        version: '1.0.0',
        timestamp: new Date(),
        mongodb: db ? 'connected' : 'disconnected',
        connectedHospitals: connectedPatients.size,
        totalConnectedPatients: Array.from(connectedPatients.values()).reduce((sum, set) => sum + set.size, 0)
    });
});

// Start server
async function startServer() {
    await initMongoDB();
    
    server.listen(PORT, () => {
        console.log('\n🏥 Hospital Notification System Started');
        console.log('=====================================');
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 Socket.IO enabled for real-time notifications`);
        console.log(`📊 MongoDB connected: ${MONGO_URI}/${DB_NAME}`);
        console.log(`🔒 Rate limiting: 10 notifications per minute`);
        console.log('\n📋 Available Endpoints:');
        console.log(`   POST /api/notifications/send - Send notification`);
        console.log(`   GET  /api/notifications/:hospitalId - Get notifications`);
        console.log(`   GET  /api/notifications/:hospitalId/stats - Get statistics`);
        console.log(`   GET  /api/health - Health check`);
        console.log('\n🔌 Socket.IO Events:');
        console.log(`   joinHospital - Patient joins hospital room`);
        console.log(`   newNotification - Real-time notification broadcast`);
        console.log('=====================================\n');
    });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down notification server...');
    server.close(() => {
        console.log('✅ Server shutdown complete');
        process.exit(0);
    });
});