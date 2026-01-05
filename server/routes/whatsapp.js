const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const aiService = require('../services/aiService');

// In-memory storage for user conversations
let userConversations = {};

/**
 * Webhook verification (GET)
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const result = whatsappService.verifyWebhook(mode, token, challenge);

  if (result) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/**
 * Webhook handler for incoming messages (POST)
 */
router.post('/webhook', async (req, res) => {
  try {
    const message = whatsappService.processIncomingMessage(req.body);

    if (message) {
      const { from, message: messageText } = message;

      // Parse user input
      const parsedInput = whatsappService.parseUserInput(messageText);

      // Store conversation
      if (!userConversations[from]) {
        userConversations[from] = {
          messages: [],
          profile: {
            priorities: [],
            goals: [],
            challenges: []
          }
        };
      }

      userConversations[from].messages.push({
        text: messageText,
        timestamp: new Date(),
        parsed: parsedInput
      });

      // Update user profile
      userConversations[from].profile.priorities.push(...parsedInput.priorities);
      userConversations[from].profile.goals.push(...parsedInput.goals);
      userConversations[from].profile.challenges.push(...parsedInput.challenges);

      // If we have enough information, generate schedule
      if (userConversations[from].messages.length >= 2) {
        const schedule = await aiService.generateSchedule(
          userConversations[from].profile
        );

        await whatsappService.sendScheduleSummary(from, schedule);
      } else {
        // Ask for more information
        await whatsappService.sendMessage(
          from,
          "Thanks for sharing! Tell me more about your daily routine and what would make the perfect day for you."
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

/**
 * Start onboarding via WhatsApp
 */
router.post('/start-onboarding', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const result = await whatsappService.startOnboarding(phoneNumber);

    res.json(result);
  } catch (error) {
    console.error('Error starting onboarding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Send a message to a user
 */
router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;

    const result = await whatsappService.sendMessage(to, message);

    res.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get conversation history
 */
router.get('/conversation/:phoneNumber', (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const conversation = userConversations[phoneNumber];

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      conversation: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
