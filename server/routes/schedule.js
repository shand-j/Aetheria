const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// In-memory storage for demo (in production, use a database)
let schedules = {};

/**
 * Generate a new schedule based on user profile
 */
router.post('/generate', async (req, res) => {
  try {
    const userProfile = req.body;
    const userId = userProfile.userId || 'default';

    // Generate schedule using AI service
    const schedule = await aiService.generateSchedule(userProfile);

    // Store schedule
    schedules[userId] = {
      ...schedule,
      createdAt: new Date(),
      userId: userId
    };

    res.json({
      success: true,
      schedule: schedules[userId]
    });
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get user's current schedule
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const schedule = schedules[userId];

    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      schedule: schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Update a schedule item
 */
router.put('/:userId/item/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const updates = req.body;

    if (!schedules[userId]) {
      return res.status(404).json({
        success: false,
        error: 'Schedule not found'
      });
    }

    const itemIndex = schedules[userId].dailySchedule.findIndex(
      item => item.id === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Schedule item not found'
      });
    }

    schedules[userId].dailySchedule[itemIndex] = {
      ...schedules[userId].dailySchedule[itemIndex],
      ...updates
    };

    res.json({
      success: true,
      schedule: schedules[userId]
    });
  } catch (error) {
    console.error('Error updating schedule item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Apply fallback rule when disruption occurs
 */
router.post('/:userId/fallback', async (req, res) => {
  try {
    const { userId } = req.params;
    const { disruption } = req.body;

    if (!schedules[userId]) {
      return res.status(404).json({
        success: false,
        error: 'Schedule not found'
      });
    }

    const result = await aiService.applyFallbackRule(
      schedules[userId],
      disruption
    );

    res.json(result);
  } catch (error) {
    console.error('Error applying fallback:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Refine schedule based on feedback
 */
router.post('/:userId/refine', async (req, res) => {
  try {
    const { userId } = req.params;
    const { feedback } = req.body;

    if (!schedules[userId]) {
      return res.status(404).json({
        success: false,
        error: 'Schedule not found'
      });
    }

    const result = await aiService.refineSchedule(
      schedules[userId],
      feedback
    );

    if (result.success && result.updatedSchedule) {
      schedules[userId] = result.updatedSchedule;
    }

    res.json(result);
  } catch (error) {
    console.error('Error refining schedule:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
