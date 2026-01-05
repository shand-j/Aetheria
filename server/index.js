require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const scheduleRoutes = require('./routes/schedule');
const goalsRoutes = require('./routes/goals');
const whatsappRoutes = require('./routes/whatsapp');
const calendarRoutes = require('./routes/calendar');

// Use routes
app.use('/api/schedule', scheduleRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/calendar', calendarRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aetheria API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
