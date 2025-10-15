// test-notification-system.js - Test script for the notification system
import fetch from 'node-fetch';

const NOTIFICATION_SERVER = 'http://localhost:5002';
const AI_SERVER = 'http://localhost:5003';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testNotificationServer() {
    log('\n🔔 Testing Notification Server...', 'cyan');
    
    try {
        // Test health check
        log('1. Testing health check...', 'blue');
        const healthResponse = await fetch(`${NOTIFICATION_SERVER}/api/health`);
        const healthData = await healthResponse.json();
        
        if (healthData.success) {
            log('✅ Health check passed', 'green');
            log(`   Service: ${healthData.service}`, 'reset');
            log(`   MongoDB: ${healthData.mongodb}`, 'reset');
        } else {
            log('❌ Health check failed', 'red');
            return false;
        }
        
        // Test sending notification
        log('\n2. Testing notification sending...', 'blue');
        const notificationData = {
            hospitalId: 'HOSP001',
            message: 'Test notification - Expert cardiologist available now for consultations',
            sentBy: 'Test System',
            department: 'Cardiology',
            priority: 'high'
        };
        
        const sendResponse = await fetch(`${NOTIFICATION_SERVER}/api/notifications/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationData)
        });
        
        const sendData = await sendResponse.json();
        
        if (sendData.success) {
            log('✅ Notification sent successfully', 'green');
            log(`   Notification ID: ${sendData.data.notificationId}`, 'reset');
            log(`   Recipients: ${sendData.data.recipientCount} patients`, 'reset');
        } else {
            log('❌ Failed to send notification', 'red');
            log(`   Error: ${sendData.error}`, 'red');
        }
        
        // Test getting notifications
        log('\n3. Testing notification retrieval...', 'blue');
        const getResponse = await fetch(`${NOTIFICATION_SERVER}/api/notifications/HOSP001?limit=5`);
        const getData = await getResponse.json();
        
        if (getData.success) {
            log('✅ Notifications retrieved successfully', 'green');
            log(`   Total notifications: ${getData.data.length}`, 'reset');
            if (getData.data.length > 0) {
                const latest = getData.data[0];
                log(`   Latest: "${latest.message}" by ${latest.sentBy}`, 'reset');
            }
        } else {
            log('❌ Failed to retrieve notifications', 'red');
        }
        
        // Test statistics
        log('\n4. Testing statistics...', 'blue');
        const statsResponse = await fetch(`${NOTIFICATION_SERVER}/api/notifications/HOSP001/stats`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            log('✅ Statistics retrieved successfully', 'green');
            log(`   Total: ${statsData.data.total}`, 'reset');
            log(`   Active: ${statsData.data.active}`, 'reset');
            log(`   Connected patients: ${statsData.data.connectedPatients}`, 'reset');
        } else {
            log('❌ Failed to retrieve statistics', 'red');
        }
        
        return true;
        
    } catch (error) {
        log(`❌ Notification server test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testAIServer() {
    log('\n🤖 Testing AI Assistant Server...', 'cyan');
    
    try {
        // Test health check
        log('1. Testing AI health check...', 'blue');
        const healthResponse = await fetch(`${AI_SERVER}/api/health`);
        const healthData = await healthResponse.json();
        
        if (healthData.success) {
            log('✅ AI health check passed', 'green');
            log(`   Service: ${healthData.service}`, 'reset');
            log(`   Status: ${healthData.status}`, 'reset');
        } else {
            log('❌ AI health check failed', 'red');
            return false;
        }
        
        // Test AI conversation
        log('\n2. Testing AI conversation...', 'blue');
        const aiQuestions = [
            'I have a fever and headache',
            'How do I book an appointment?',
            'Give me some wellness tips',
            'What should I do for chest pain?'
        ];
        
        for (const question of aiQuestions) {
            log(`   Asking: "${question}"`, 'yellow');
            
            const aiResponse = await fetch(`${AI_SERVER}/api/ai/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question })
            });
            
            const aiData = await aiResponse.json();
            
            if (aiData.success) {
                log(`   ✅ Response (${aiData.data.priority}): ${aiData.data.response.substring(0, 100)}...`, 'green');
            } else {
                log(`   ❌ AI response failed`, 'red');
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Test health tips
        log('\n3. Testing health tips...', 'blue');
        const tipsResponse = await fetch(`${AI_SERVER}/api/ai/health-tips`);
        const tipsData = await tipsResponse.json();
        
        if (tipsData.success && tipsData.data.length > 0) {
            log('✅ Health tips retrieved', 'green');
            log(`   Available tips: ${tipsData.data.length}`, 'reset');
            log(`   Sample: ${tipsData.data[0].tip}`, 'reset');
        } else {
            log('❌ Failed to get health tips', 'red');
        }
        
        // Test emergency guide
        log('\n4. Testing emergency guide...', 'blue');
        const emergencyResponse = await fetch(`${AI_SERVER}/api/ai/emergency-guide`);
        const emergencyData = await emergencyResponse.json();
        
        if (emergencyData.success) {
            log('✅ Emergency guide retrieved', 'green');
            log(`   Emergency steps: ${emergencyData.data.steps.length}`, 'reset');
            log(`   Warning signs: ${emergencyData.data.warningSigns.length}`, 'reset');
        } else {
            log('❌ Failed to get emergency guide', 'red');
        }
        
        return true;
        
    } catch (error) {
        log(`❌ AI server test failed: ${error.message}`, 'red');
        return false;
    }
}

async function runTests() {
    log('🧪 Hospital Notification System - Integration Tests', 'magenta');
    log('='.repeat(60), 'magenta');
    
    const startTime = Date.now();
    
    const notificationResult = await testNotificationServer();
    const aiResult = await testAIServer();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log('\n📊 Test Summary', 'cyan');
    log('='.repeat(30), 'cyan');
    log(`Notification System: ${notificationResult ? '✅ PASS' : '❌ FAIL'}`, notificationResult ? 'green' : 'red');
    log(`AI Assistant: ${aiResult ? '✅ PASS' : '❌ FAIL'}`, aiResult ? 'green' : 'red');
    log(`Duration: ${duration}s`, 'blue');
    
    if (notificationResult && aiResult) {
        log('\n🎉 All tests passed! System is ready for use.', 'green');
        log('\nNext steps:', 'cyan');
        log('1. Open Hospital Portal: http://localhost:5174/notifications', 'reset');
        log('2. Open Patient Portal: http://localhost:5173', 'reset');
        log('3. Send a test notification from hospital to patient', 'reset');
        log('4. Try the AI assistant at: http://localhost:5173/ai-assistant', 'reset');
    } else {
        log('\n❌ Some tests failed. Please check the server logs.', 'red');
        log('\nTroubleshooting:', 'yellow');
        log('1. Make sure MongoDB is running', 'reset');
        log('2. Check if all servers are started', 'reset');
        log('3. Verify no port conflicts', 'reset');
        process.exit(1);
    }
}

// Handle command line execution
if (process.argv[1].endsWith('test-notification-system.js')) {
    runTests().catch(error => {
        log(`Fatal error: ${error.message}`, 'red');
        process.exit(1);
    });
}

export { testNotificationServer, testAIServer, runTests };