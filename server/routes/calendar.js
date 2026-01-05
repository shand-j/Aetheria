const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');

/**
 * Sync schedule to Google Calendar
 */
router.post('/sync/google', async (req, res) => {
  try {
    const { schedule, userCredentials } = req.body;

    const result = await calendarService.syncToGoogleCalendar(
      schedule,
      userCredentials
    );

    res.json(result);
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Fetch events from Google Calendar
 */
router.get('/fetch/google', async (req, res) => {
  try {
    const { userCredentials, startDate, endDate } = req.query;

    const result = await calendarService.fetchGoogleCalendarEvents(
      JSON.parse(userCredentials),
      startDate,
      endDate
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching from Google Calendar:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Export schedule to iCal format
 */
router.post('/export/ical', (req, res) => {
  try {
    const { schedule } = req.body;

    const icalContent = calendarService.exportToICal(schedule);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename=schedule.ics');
    res.send(icalContent);
  } catch (error) {
    console.error('Error exporting to iCal:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
