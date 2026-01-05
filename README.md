# Aetheria ✨

An innovative AI-powered scheduling app designed for busy parents. Aetheria helps you balance work, family, fitness, and administrative tasks with intelligent scheduling and smart fallback rules.

## Features

🤖 **AI-Powered Schedule Generation**
- Creates personalized "dream schedules" based on your priorities, goals, and challenges
- Balances work, family, fitness, and admin tasks intelligently
- Adapts to your preferences (morning person, work hours, etc.)

💬 **WhatsApp Integration**
- Define priorities and goals through natural conversation
- Receive schedule updates and reminders
- Quick onboarding via familiar messaging interface

🔄 **Smart Fallback Rules**
- Automatic schedule adjustments when disruptions occur
- Pre-defined fallback strategies for common scenarios
- Dynamic rescheduling for unexpected events

📅 **Calendar Integration**
- Sync with Google Calendar
- Export to iCal format
- Visual calendar view of your schedule

🎯 **Weekly Goal Planning**
- Set and track weekly goals
- Progress tracking with visual indicators
- Goal completion notifications

📊 **User-Friendly Dashboard**
- Clean, intuitive interface
- Real-time schedule updates
- Easy drag-and-drop functionality (coming soon)

## Tech Stack

**Backend:**
- Node.js & Express
- RESTful API architecture
- WhatsApp Business API integration
- AI service integration (OpenAI/Anthropic compatible)

**Frontend:**
- React 18
- React Router
- Axios for API communication
- Responsive design

## Installation

### Prerequisites
- Node.js 16+ and npm
- WhatsApp Business API credentials (optional)
- AI API key (optional, for enhanced AI features)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/shand-j/Aetheria.git
cd Aetheria
```

2. **Install dependencies**
```bash
npm install
cd client && npm install
cd ..
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `WHATSAPP_API_KEY`: Your WhatsApp Business API key
- `AI_API_KEY`: Your AI service API key (OpenAI, Anthropic, etc.)
- `GOOGLE_CALENDAR_CLIENT_ID` & `GOOGLE_CALENDAR_CLIENT_SECRET`: For calendar sync

4. **Start the application**

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Getting Started

1. **Initial Setup**: When you first open Aetheria, you'll be guided through a 3-step setup wizard:
   - Step 1: Set your priorities (work, family, fitness, admin)
   - Step 2: Define your weekly goals
   - Step 3: Share your challenges and constraints

2. **Generate Schedule**: Click "Generate My Schedule" to create your personalized daily schedule

3. **View Dashboard**: Your dashboard shows:
   - Today's schedule with time blocks
   - Weekly goals with progress tracking
   - Smart fallback rules for disruptions

4. **Apply Fallbacks**: When something unexpected happens, use the fallback feature to quickly adjust your schedule

### WhatsApp Integration (Optional)

To use WhatsApp for onboarding:

1. Set up WhatsApp Business API credentials in `.env`
2. Configure webhook URL in WhatsApp dashboard
3. Send "start" to your WhatsApp number to begin onboarding
4. Chat naturally about your priorities, goals, and challenges
5. Receive your personalized schedule via WhatsApp

### Calendar Sync

**Export to iCal:**
- Click the "📅 Export" button in the header
- Download the `.ics` file
- Import into your preferred calendar app

**Google Calendar Sync (Coming Soon):**
- Connect your Google account
- Automatic two-way sync
- Real-time updates

## API Documentation

### Schedule Endpoints

**Generate Schedule**
```http
POST /api/schedule/generate
Content-Type: application/json

{
  "userId": "user123",
  "priorities": { "work": "high", "family": "high", "fitness": "medium", "admin": "medium" },
  "goals": ["Exercise 4 times", "Complete project"],
  "challenges": ["Unpredictable kids schedule"],
  "preferences": { "morningPerson": true, "workHours": "8:00-17:00" },
  "constraints": { "schoolDropoff": "07:30", "schoolPickup": "15:00" }
}
```

**Get Schedule**
```http
GET /api/schedule/:userId
```

**Apply Fallback**
```http
POST /api/schedule/:userId/fallback
Content-Type: application/json

{
  "disruption": "Meeting ran over lunch"
}
```

### Goals Endpoints

**Get Goals**
```http
GET /api/goals/:userId
```

**Create Goal**
```http
POST /api/goals/:userId
Content-Type: application/json

{
  "goal": "Exercise 4 times this week",
  "category": "fitness",
  "target": 4,
  "current": 0
}
```

**Update Goal**
```http
PUT /api/goals/:userId/:goalId
Content-Type: application/json

{
  "current": 2
}
```

### WhatsApp Endpoints

**Start Onboarding**
```http
POST /api/whatsapp/start-onboarding
Content-Type: application/json

{
  "phoneNumber": "+1234567890"
}
```

**Send Message**
```http
POST /api/whatsapp/send
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Your schedule is ready!"
}
```

## Project Structure

```
Aetheria/
├── server/
│   ├── index.js              # Express server setup
│   ├── routes/
│   │   ├── schedule.js       # Schedule API routes
│   │   ├── goals.js          # Goals API routes
│   │   ├── whatsapp.js       # WhatsApp integration routes
│   │   └── calendar.js       # Calendar integration routes
│   ├── services/
│   │   ├── aiService.js      # AI schedule generation
│   │   ├── whatsappService.js # WhatsApp Business API
│   │   └── calendarService.js # Calendar integrations
│   └── models/               # Data models (future)
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Header.js     # App header
│       │   ├── ScheduleView.js # Schedule display
│       │   ├── GoalsPanel.js  # Goals tracking
│       │   ├── FallbackRules.js # Fallback rules display
│       │   └── SetupWizard.js # Onboarding wizard
│       ├── pages/
│       │   └── Dashboard.js  # Main dashboard
│       ├── services/
│       │   └── api.js        # API client
│       ├── App.js
│       ├── App.css
│       └── index.js
├── package.json
├── .env.example
└── README.md
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Roadmap

- [ ] User authentication and multi-user support
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Advanced AI features with learning from feedback
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Drag-and-drop schedule editing
- [ ] Family member scheduling
- [ ] Integration with task management tools
- [ ] Voice commands via Alexa/Google Home

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for busy parents everywhere