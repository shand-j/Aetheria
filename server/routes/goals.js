const express = require('express');
const router = express.Router();

// In-memory storage for demo
let goals = {};

/**
 * Get weekly goals for a user
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userGoals = goals[userId] || [];

    res.json({
      success: true,
      goals: userGoals
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Create a new goal
 */
router.post('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const goalData = req.body;

    if (!goals[userId]) {
      goals[userId] = [];
    }

    const newGoal = {
      id: `goal_${Date.now()}`,
      ...goalData,
      createdAt: new Date(),
      userId: userId
    };

    goals[userId].push(newGoal);

    res.json({
      success: true,
      goal: newGoal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Update goal progress
 */
router.put('/:userId/:goalId', (req, res) => {
  try {
    const { userId, goalId } = req.params;
    const updates = req.body;

    if (!goals[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User goals not found'
      });
    }

    const goalIndex = goals[userId].findIndex(g => g.id === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    goals[userId][goalIndex] = {
      ...goals[userId][goalIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      goal: goals[userId][goalIndex]
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Delete a goal
 */
router.delete('/:userId/:goalId', (req, res) => {
  try {
    const { userId, goalId } = req.params;

    if (!goals[userId]) {
      return res.status(404).json({
        success: false,
        error: 'User goals not found'
      });
    }

    const goalIndex = goals[userId].findIndex(g => g.id === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    goals[userId].splice(goalIndex, 1);

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
