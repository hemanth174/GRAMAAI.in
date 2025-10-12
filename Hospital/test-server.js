// test-server.js - Minimal test server
import express from 'express';

const app = express();
const port = 5000;

app.use(express.json());

app.get('/health', (req, res) => {
    console.log('Health check received');
    res.json({ status: 'OK' });
});

app.get('/api/appointments', (req, res) => {
    console.log('Appointments endpoint called');
    res.json({ success: true, data: [] });
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Test server running on http://localhost:${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

console.log('Script loaded, server should be starting...');
