// ai-assistant-server.js - AI Assistant Backend with Gemini Live API
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = 5003; // AI Assistant Server Port
const GEMINI_API_KEY = "AIzaSyBrZNuz5SaQHjSRkExaanPtlQ77o9QQUsI"; // Your API key

// Rate limiting for AI requests
const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
    message: { error: 'Too many AI requests, please try again later.' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/ai', aiLimiter);

// Store active AI sessions
const activeSessions = new Map();

// Health-focused AI prompts
const HEALTH_SYSTEM_PROMPT = `You are HealthBot, a helpful AI medical assistant for patients in India. Your role is to:

1. HEALTH GUIDANCE: Provide helpful health information, symptom guidance, and wellness tips
2. APPOINTMENT SUPPORT: Help patients understand when to book appointments and what to expect
3. EMERGENCY AWARENESS: Identify potential emergencies and guide to immediate medical care
4. MEDICATION INFO: Provide basic information about common medications (not prescriptions)
5. WELLNESS TIPS: Share preventive care, nutrition, and lifestyle advice

IMPORTANT SAFETY GUIDELINES:
- Always recommend consulting real doctors for diagnosis
- Never provide specific medical diagnosis or treatment
- For serious symptoms, immediately recommend emergency care
- Be culturally sensitive to Indian healthcare context
- Provide information in simple, clear language
- If asked about prescriptions, refer to qualified doctors

RESPONSE FORMAT:
- Keep responses concise but helpful (max 150 words for quick responses)
- Use emojis sparingly but appropriately 
- Offer to help with appointment booking when relevant
- Always be empathetic and supportive

Remember: You assist patients but never replace qualified medical professionals.`;

// Initialize Gemini client function
async function initializeGeminiSession() {
    try {
        // This would be the actual Gemini API initialization
        // For now, we'll simulate with a text-based response system
        return {
            id: Date.now().toString(),
            status: 'active',
            created: new Date()
        };
    } catch (error) {
        console.error('Failed to initialize Gemini session:', error);
        throw new Error('AI service temporarily unavailable');
    }
}

// Simulate Gemini AI response (replace with actual API call)
async function getGeminiResponse(message, context = []) {
    // In production, this would call the actual Gemini API
    // For now, providing intelligent health-focused responses
    
    const lowerMessage = message.toLowerCase();
    
    // Emergency keywords
    const emergencyWords = ['chest pain', 'heart attack', 'stroke', 'can\'t breathe', 'unconscious', 'severe bleeding', 'overdose'];
    if (emergencyWords.some(word => lowerMessage.includes(word))) {
        return {
            text: "🚨 This sounds like a medical emergency! Please call emergency services immediately (102 in India) or go to the nearest hospital emergency department. Do not delay seeking immediate medical attention.",
            priority: 'emergency',
            suggestedActions: ['Call 102', 'Go to nearest hospital', 'Contact emergency services']
        };
    }
    
    // Appointment booking help
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('doctor')) {
        return {
            text: "I can help you understand the appointment booking process! 📅 You can book appointments through our portal by selecting your preferred doctor, time slot, and consultation type. Would you like me to guide you through the booking process or help you find the right specialist?",
            priority: 'normal',
            suggestedActions: ['Book appointment', 'Find doctor', 'Check availability']
        };
    }
    
    // Common symptoms guidance
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        return {
            text: "For fever management: 🌡️ Monitor your temperature, stay hydrated, rest well, and consider paracetamol as directed. If fever exceeds 103°F (39.4°C), persists for more than 3 days, or you have difficulty breathing, please consult a doctor immediately.",
            priority: 'normal',
            suggestedActions: ['Monitor temperature', 'Stay hydrated', 'Consult doctor if worsening']
        };
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
        return {
            text: "For headaches: 🤕 Try rest in a quiet, dark room, stay hydrated, gentle head massage, and over-the-counter pain relief if needed. If you experience severe sudden headaches, vision changes, or neck stiffness, seek immediate medical attention.",
            priority: 'normal',
            suggestedActions: ['Rest in dark room', 'Stay hydrated', 'Monitor symptoms']
        };
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
        return {
            text: "For cough and cold: 😷 Stay hydrated, use warm saltwater gargles, honey (for adults), steam inhalation, and rest. If symptoms persist beyond 7-10 days, worsen, or you develop high fever or breathing difficulties, please consult a healthcare provider.",
            priority: 'normal',
            suggestedActions: ['Warm gargles', 'Steam inhalation', 'Consult if persistent']
        };
    }
    
    // Wellness and prevention
    if (lowerMessage.includes('wellness') || lowerMessage.includes('healthy') || lowerMessage.includes('prevention')) {
        return {
            text: "Great focus on wellness! 💪 Key health tips: Regular exercise (30 min daily), balanced diet with fruits/vegetables, adequate sleep (7-8 hours), stay hydrated, regular health checkups, manage stress, and avoid smoking/excessive alcohol. Small consistent habits make big differences!",
            priority: 'normal',
            suggestedActions: ['Regular exercise', 'Balanced diet', 'Regular checkups']
        };
    }
    
    // Medication questions
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
        return {
            text: "For medication questions: 💊 Always follow your doctor's prescription exactly, take medicines at prescribed times, complete the full course even if feeling better, store properly, and never share medications. For specific drug information or concerns, consult your pharmacist or doctor.",
            priority: 'normal',
            suggestedActions: ['Follow prescription', 'Consult pharmacist', 'Check with doctor']
        };
    }
    
    // Mental health support
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('depression')) {
        return {
            text: "Mental health is equally important! 🧠 Try deep breathing, regular exercise, talking to trusted friends/family, maintaining routine, and practicing mindfulness. If feelings persist or interfere with daily life, please consider speaking with a mental health professional.",
            priority: 'normal',
            suggestedActions: ['Practice deep breathing', 'Talk to someone', 'Consider counseling']
        };
    }
    
    // General health inquiry
    return {
        text: "I'm here to help with your health questions! 👨‍⚕️ I can provide general health information, guidance on common symptoms, wellness tips, and help with understanding when to seek medical care. What specific health topic would you like to know about?",
        priority: 'normal',
        suggestedActions: ['Ask about symptoms', 'Book appointment', 'Wellness tips']
    };
}

// Socket.IO for real-time AI chat
io.on('connection', (socket) => {
    console.log(`🤖 AI Assistant client connected: ${socket.id}`);
    
    socket.on('startAISession', async (data) => {
        try {
            const session = await initializeGeminiSession();
            activeSessions.set(socket.id, {
                ...session,
                conversationHistory: []
            });
            
            socket.emit('aiSessionStarted', { 
                sessionId: session.id,
                status: 'ready',
                message: 'Hello! I\'m your AI Health Assistant. How can I help you today?' 
            });
        } catch (error) {
            socket.emit('aiError', { error: error.message });
        }
    });
    
    socket.on('sendMessage', async (data) => {
        const { message, sessionId } = data;
        const session = activeSessions.get(socket.id);
        
        if (!session) {
            socket.emit('aiError', { error: 'No active AI session' });
            return;
        }
        
        try {
            // Add user message to history
            session.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });
            
            // Get AI response
            const response = await getGeminiResponse(message, session.conversationHistory);
            
            // Add AI response to history
            session.conversationHistory.push({
                role: 'assistant',
                content: response.text,
                timestamp: new Date(),
                priority: response.priority,
                suggestedActions: response.suggestedActions
            });
            
            // Send response to client
            socket.emit('aiResponse', {
                message: response.text,
                priority: response.priority,
                suggestedActions: response.suggestedActions,
                timestamp: new Date()
            });
            
        } catch (error) {
            console.error('AI processing error:', error);
            socket.emit('aiError', { error: 'Failed to process your message. Please try again.' });
        }
    });
    
    socket.on('endAISession', () => {
        activeSessions.delete(socket.id);
        socket.emit('aiSessionEnded');
    });
    
    socket.on('disconnect', () => {
        activeSessions.delete(socket.id);
        console.log(`🤖 AI Assistant client disconnected: ${socket.id}`);
    });
});

// REST API Routes

// Get AI chat history
app.get('/api/ai/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = Array.from(activeSessions.values()).find(s => s.id === sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
        success: true,
        data: session.conversationHistory
    });
});

// Health information endpoints
app.get('/api/ai/health-tips', (req, res) => {
    const tips = [
        { category: 'Exercise', tip: 'Aim for 30 minutes of moderate exercise daily', icon: '🏃‍♂️' },
        { category: 'Nutrition', tip: 'Include 5 servings of fruits and vegetables daily', icon: '🥗' },
        { category: 'Sleep', tip: 'Get 7-8 hours of quality sleep each night', icon: '😴' },
        { category: 'Hydration', tip: 'Drink 8-10 glasses of water daily', icon: '💧' },
        { category: 'Stress', tip: 'Practice deep breathing or meditation for 10 minutes daily', icon: '🧘‍♀️' },
        { category: 'Checkups', tip: 'Schedule regular health screenings as recommended', icon: '🩺' }
    ];
    
    res.json({ success: true, data: tips });
});

// Emergency guidance
app.get('/api/ai/emergency-guide', (req, res) => {
    const emergencyGuide = {
        steps: [
            { step: 1, action: 'Call 102 (Ambulance) or 108 (Emergency)', priority: 'immediate' },
            { step: 2, action: 'If possible, call the nearest hospital', priority: 'immediate' },
            { step: 3, action: 'Stay calm and provide clear location details', priority: 'important' },
            { step: 4, action: 'Follow emergency operator instructions', priority: 'important' }
        ],
        warningSigns: [
            'Chest pain or pressure',
            'Difficulty breathing',
            'Severe bleeding',
            'Loss of consciousness',
            'Severe allergic reaction',
            'Signs of stroke (face drooping, arm weakness, speech difficulty)'
        ]
    };
    
    res.json({ success: true, data: emergencyGuide });
});

// Simple text-based AI endpoint (fallback)
app.post('/api/ai/ask', async (req, res) => {
    try {
        const { message, context = [] } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const response = await getGeminiResponse(message, context);
        
        res.json({
            success: true,
            data: {
                response: response.text,
                priority: response.priority,
                suggestedActions: response.suggestedActions,
                timestamp: new Date()
            }
        });
        
    } catch (error) {
        console.error('AI API error:', error);
        res.status(500).json({ error: 'AI service error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'AI Health Assistant',
        version: '1.0.0',
        status: 'running',
        activeSessions: activeSessions.size,
        timestamp: new Date()
    });
});

// Start server
server.listen(PORT, () => {
    console.log('\n🤖 AI Health Assistant Started');
    console.log('=====================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧠 AI powered by health-focused knowledge base`);
    console.log(`🔌 Real-time chat via Socket.IO`);
    console.log(`🔒 Rate limiting: 30 requests per minute`);
    console.log('\n📋 Available Endpoints:');
    console.log(`   POST /api/ai/ask - Text-based AI chat`);
    console.log(`   GET  /api/ai/health-tips - Daily health tips`);
    console.log(`   GET  /api/ai/emergency-guide - Emergency procedures`);
    console.log(`   GET  /api/health - Service health check`);
    console.log('\n🔌 Socket.IO Events:');
    console.log(`   startAISession - Begin AI conversation`);
    console.log(`   sendMessage - Send message to AI`);
    console.log(`   endAISession - End conversation`);
    console.log('=====================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down AI Assistant server...');
    server.close(() => {
        console.log('✅ AI Assistant shutdown complete');
        process.exit(0);
    });
});