const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const llmRoutes = require('./routes/LLMRoutes');
const verifyToken = require('./middleware/authMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from your frontend's origin
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization,x-access-token', // Include the x-access-token header
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Authentication routes
app.use('/auth', authRoutes);

// LLM interaction routes (protected)
app.use('/llm', llmRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});