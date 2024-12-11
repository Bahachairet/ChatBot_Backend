const axios = require('axios');
const { ChatMessage, User } = require('../models');

const ollama_base_url = 'http://127.0.0.1:11434/api/chat';

const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ollamaResponse = await axios.post(
      ollama_base_url,
      {
        model: 'qwen2.5:0.5b-instruct-q5_K_M',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const modelResponse = ollamaResponse.data.message.content;

    const chatMessage = await ChatMessage.create({
      userId,
      userMessage: message,
      modelResponse,
    });

    res.status(200).json({
      message: modelResponse,
      chatMessageId: chatMessage.id,
    });
  } catch (error) {
    console.error('Detailed Ollama API Error:', {
      message: error.message,
      code: error.code,
      config: error.config,
    });

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Ollama service is not running. Please start Ollama.',
        details: 'Ensure Ollama is running and the Qwen model is pulled.',
      });
    }

    res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.userId;

    // Fetch chat messages for the user
    const chatMessages = await ChatMessage.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'userMessage', 'modelResponse', 'createdAt'],
    });

    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory, // Make sure this is exported
};
