/**
 * WhatsApp Integration Service
 * Handles communication with WhatsApp Business API
 */

const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  /**
   * Send a message to a user via WhatsApp
   */
  async sendMessage(to, message) {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process incoming WhatsApp messages (webhook handler)
   */
  processIncomingMessage(webhookData) {
    try {
      const entry = webhookData.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;

      if (value.messages) {
        const message = value.messages[0];
        const from = message.from;
        const messageBody = message.text?.body || '';
        const messageType = message.type;

        return {
          from: from,
          message: messageBody,
          type: messageType,
          timestamp: message.timestamp
        };
      }

      return null;
    } catch (error) {
      console.error('Error processing WhatsApp message:', error);
      return null;
    }
  }

  /**
   * Parse user input to extract priorities, goals, and challenges
   */
  parseUserInput(messageText) {
    // Simple keyword-based parsing
    // In production, this would use NLP/AI for better understanding
    
    const priorities = [];
    const goals = [];
    const challenges = [];

    const lowerText = messageText.toLowerCase();

    // Detect priorities
    if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('career')) {
      priorities.push({ category: 'work', importance: 'high' });
    }
    if (lowerText.includes('family') || lowerText.includes('kids') || lowerText.includes('children')) {
      priorities.push({ category: 'family', importance: 'high' });
    }
    if (lowerText.includes('fitness') || lowerText.includes('exercise') || lowerText.includes('health')) {
      priorities.push({ category: 'fitness', importance: 'medium' });
    }
    if (lowerText.includes('admin') || lowerText.includes('errands') || lowerText.includes('bills')) {
      priorities.push({ category: 'admin', importance: 'medium' });
    }

    // Detect challenges
    if (lowerText.includes('unpredictable') || lowerText.includes('chaotic') || lowerText.includes('hectic')) {
      challenges.push('unpredictable schedule');
    }
    if (lowerText.includes('time') || lowerText.includes('busy') || lowerText.includes('overwhelmed')) {
      challenges.push('limited time');
    }
    if (lowerText.includes('energy') || lowerText.includes('tired') || lowerText.includes('exhausted')) {
      challenges.push('low energy');
    }

    return {
      priorities,
      goals,
      challenges,
      rawInput: messageText
    };
  }

  /**
   * Start a conversation flow for onboarding
   */
  async startOnboarding(phoneNumber) {
    const welcomeMessage = `
Welcome to Aetheria! 🌟

I'm here to help you create a personalized schedule that works for your busy life as a parent.

Let's start by understanding your priorities. Please tell me about:
1. Your main daily responsibilities (work, kids, etc.)
2. What's most important to you
3. Your biggest scheduling challenges

Take your time and share as much as you'd like!
`;

    return await this.sendMessage(phoneNumber, welcomeMessage);
  }

  /**
   * Send schedule summary via WhatsApp
   */
  async sendScheduleSummary(phoneNumber, schedule) {
    let message = "✨ Here's your personalized schedule:\n\n";

    schedule.dailySchedule.slice(0, 5).forEach(item => {
      message += `⏰ ${item.startTime} - ${item.endTime}: ${item.activity}\n`;
    });

    message += "\nI've also created fallback rules for when things don't go as planned. Check the app for full details!";

    return await this.sendMessage(phoneNumber, message);
  }

  /**
   * Verify webhook (required for WhatsApp setup)
   */
  verifyWebhook(mode, token, challenge) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'aetheria_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    return null;
  }
}

module.exports = new WhatsAppService();
