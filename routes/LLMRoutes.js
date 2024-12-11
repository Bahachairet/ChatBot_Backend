const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/LLMController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to send a message to the LLM (requires authentication)
router.post('/chat', verifyToken, sendMessage);

// Route to get chat history for the authenticated user
router.get('/history', verifyToken, getChatHistory);

module.exports = router;