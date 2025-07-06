# KuttyBank - Family Budget Tracker

A Threads-style, real-time family budget tracker PWA built with Next.js, Redux Toolkit, and Firebase.

## Features

- 📱 **Mobile-first Design**: iOS-style interface inspired by Threads/Instagram
- 🏠 **Family Budget Management**: Track expenses and income for the entire family
- 💬 **Social-style Activity Feed**: See family transactions in a timeline format
- 📊 **Real-time Dashboard**: Live updates on spending, savings, and budget goals
- 👥 **Family Management**: Invite members with different permission levels
- 🔄 **Real-time Updates**: Instant synchronization across all devices
- 🎨 **Dark Theme**: Sleek black and white design
- 🧵 **Thread-based Navigation**: Filter data by time periods (week/month/quarter/year)
- ⚡ **Custom Threads**: Create custom date ranges for specific tracking
- 📋 **Thread Sidebar**: Manage and switch between different time periods
- 🎯 **Smart Filtering**: View dashboard and activity data based on selected thread

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: Headless UI, Lucide React icons
- **Database**: MongoDB with Mongoose
- **Real-time**: Firebase Firestore
- **Styling**: TailwindCSS with custom black theme

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── activity/           # Activity feed page
│   ├── family/             # Family management page
│   └── messages/           # Messages page (coming soon)
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── BottomNav/      # Bottom navigation
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── TransactionPost/# Transaction display
│   │   ├── AddEntryModal/  # Add transaction modal
│   │   ├── ActivityFeed/   # Activity timeline
│   │   ├── FamilyPage/     # Family management
│   │   ├── ThreadsHeader/  # Thread navigation header
│   │   ├── ThreadSidebar/  # Thread management sidebar
│   │   └── ThreadBottomBar/# Thread selector bottom bar
│   └── AppLayout.tsx       # Main app layout
└── store/                  # Redux store
    ├── api/                # RTK Query APIs
    ├── slices/             # Redux slices (auth, ui, threads)
    └── ReduxProvider.tsx   # Redux provider
```

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
# Create .env.local file
MONGODB_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Components

### BottomNav
- Fixed bottom navigation with 5 tabs
- Central "+" button for adding transactions
- Auto-highlights active tab based on current route

### TransactionPost
- Threads-style post layout
- Shows profile picture, amount, category, and timestamp
- Supports optional notes and images
- Color-coded for income (green) and expenses (red)

### AddEntryModal
- Dark modal with form inputs
- Toggle between Income/Expense
- Category selection with emojis
- Optional note and image upload

### Dashboard
- Live statistics cards
- Savings goal progress bar
- Recent transactions feed
- Time filter (weekly/monthly/yearly)

### ActivityFeed
- Real-time transaction timeline
- Infinite scroll with load more
- Pull-to-refresh functionality
- Auto-refresh every 30 seconds

### FamilyPage
- Family member management
- Role-based permissions (Admin, Member, View-only)
- Budget cap settings
- Member invitation system

## Development

### Adding New Components

1. Create component folder:
```bash
mkdir src/components/ui/ComponentName
```

2. Create files:
- `ComponentName.tsx` - Main component
- `types.ts` - TypeScript interfaces
- `index.ts` - Export file

3. Follow the existing patterns for consistency

### API Integration

The app uses RTK Query for API calls. Add new endpoints in the respective API files:
- `transactionApi.ts` - Transaction-related endpoints
- `authApi.ts` - Authentication endpoints  
- `familyApi.ts` - Family management endpoints

## Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm start
```

3. **Deploy to Vercel** (recommended):
```bash
vercel deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Real-time chat messaging
- [ ] Push notifications
- [ ] Advanced analytics and reports
- [ ] Bank account integration
- [ ] Recurring transactions
- [ ] Budget alerts and notifications
- [ ] Export data functionality
- [ ] Offline mode support
