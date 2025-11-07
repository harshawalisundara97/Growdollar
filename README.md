# Plant Growing App 🌱

A React Native app where users can purchase virtual plants for $1 and watch them grow over time with real-time tracking, photo updates, location tracking, health metrics, and environmental impact monitoring.

## Features

### Core Features
- **User Authentication**: Login and Sign Up functionality with persistent sessions
- **Plant Purchase**: Users can buy different types of plants for $1 each
- **Real-time Growth**: Plants automatically grow through 11 stages over 20 hours
- **Visual Representation**: Beautiful SVG-based plant visualizations that change based on growth stage
- **Plant Management**: View all your plants and see their growth progress
- **Persistent Storage**: Plants and user data are saved locally using AsyncStorage

### Advanced Features
- **Growth Timeline**: Visual timeline showing growth progression with milestones
- **Photo Updates**: Take photos of your plants at different growth stages to document their journey
- **Location Tracking**: GPS coordinates saved when purchasing plants, with map visualization
- **Environmental Impact**: Real-time carbon offset calculations and oxygen production metrics
- **Plant Health Metrics**: Gamified care system with water, sunlight, and care metrics that affect growth

## Plant Types

- 🌻 Sunflower
- 🌹 Rose
- 🌳 Tree
- 🌵 Cactus
- 🌷 Tulip
- 🌸 Cherry Blossom

## Growth Stages

Plants go through 11 growth stages (0-10):
1. Seed
2. Sprout
3. Young Plant
4. Growing
5. Budding
6. Flowering
7. Maturing
8. Full Bloom
9. Mature
10. Fully Grown
11. Masterpiece

Each stage takes 2 hours to complete, so a plant reaches full maturity in 20 hours.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on iOS, Android, or Web:
```bash
npm run ios
npm run android
npm run web
```

## Payment Integration

Currently, payment is simulated for demo purposes. To integrate real payments:

1. **For iOS**: Use `expo-in-app-purchases` or integrate with Apple's In-App Purchase
2. **For Android**: Use `expo-in-app-purchases` or Google Play Billing
3. **For Web/Cross-platform**: Integrate with Stripe using `@stripe/stripe-react-native`

Update the `PurchaseScreen.js` file to replace the simulated payment with your chosen payment provider.

## Project Structure

```
├── App.js                 # Main app component with navigation and auth flow
├── context/
│   ├── AuthContext.js    # Authentication state management
│   └── PlantContext.js   # Plant state management with growth, health, and impact tracking
├── screens/
│   ├── LoginScreen.js    # User login screen
│   ├── SignUpScreen.js   # User registration screen
│   ├── HomeScreen.js     # Main screen showing all plants
│   ├── PurchaseScreen.js # Plant purchase screen with location capture
│   └── PlantDetailScreen.js # Individual plant detail view with all features
└── components/
    ├── PlantCard.js      # Plant card component for list
    ├── PlantVisualization.js # SVG plant visualization
    ├── GrowthTimeline.js # Visual growth timeline component
    ├── PhotoGallery.js   # Photo upload and gallery component
    ├── LocationMap.js    # Map component showing plant location
    ├── PlantHealthMetrics.js # Health metrics with gamified care
    └── EnvironmentalImpact.js # Environmental impact calculations and display
```

## Advanced Features Details

### Growth Timeline
- Visual representation of all 11 growth stages
- Shows when each milestone was reached
- Highlights current growth stage
- Scrollable timeline with progress indicators

### Photo Updates
- Take photos using camera or select from gallery
- Photos are tagged with growth stage and timestamp
- Gallery view with photo details
- Full-screen photo viewing

### Location Tracking
- Automatic GPS capture on plant purchase
- Reverse geocoding for address display
- Interactive map showing plant location
- Open location in external maps app

### Environmental Impact
- **Carbon Offset**: Calculated based on plant type and growth stage
- **Oxygen Production**: Real-time oxygen generation metrics
- **Tree Equivalent**: Shows equivalent contribution compared to real trees
- **Projected Annual Impact**: Estimates yearly environmental contribution

### Plant Health Metrics
- **Water Level**: Decreases over time, can be replenished
- **Sunlight Level**: Affects growth rate
- **Care Level**: Overall plant health indicator
- **Gamified Care**: Users can water, provide sunlight, and care for plants
- **Health Affects Growth**: Healthier plants grow faster

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- React Native SVG
- Expo Location (for GPS tracking)
- Expo Image Picker (for photo uploads)
- React Native Maps (for location display)

## Permissions Required

- **Location**: To track where plants are planted
- **Camera**: To take photos of plants
- **Photo Library**: To select photos from gallery

## Health Metrics System

Plants have three health metrics that decrease over time:
- **Water**: Decreases by 2% per hour
- **Sunlight**: Decreases by 1.5% per hour
- **Care**: Decreases by 1% per hour

Users can replenish these metrics by interacting with the plant. Healthier plants grow faster and produce more environmental benefits.

## Environmental Impact Calculations

- **Carbon Offset**: Varies by plant type (Trees: 2.5kg/stage, Cherry Blossom: 1.0kg/stage, etc.)
- **Oxygen Production**: Approximately 73% of carbon offset (based on photosynthesis)
- **Tree Equivalent**: Based on average tree absorbing 22kg CO₂ per year

## Authentication

The app uses **Firebase Authentication** for secure user management:
- **Login**: Users can sign in with email and password
- **Sign Up**: New users can create an account with name, email, and password
- **Session Persistence**: User sessions are automatically managed by Firebase
- **Logout**: Users can logout from the home screen
- **Protected Routes**: Plant features are only accessible after login
- **Secure Storage**: Passwords are securely hashed and stored by Firebase
- **User Data**: User profiles are stored in Firestore database

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy your Firebase config to `config/firebase.js`
5. See `FIREBASE_SETUP.md` for detailed setup instructions

### User Data Storage
- User accounts are managed by Firebase Authentication
- User profiles (name, etc.) are stored in Firestore
- Secure password hashing is handled automatically by Firebase

## Notes

- **Authentication Required**: Users must sign up/login before accessing plant features
- Plants grow automatically in the background based on time elapsed since purchase
- Growth stages update every minute when the app is open
- Health metrics decrease over time and can be replenished through care actions
- Environmental impact is calculated in real-time based on growth stage
- All plant data is stored locally on the device using AsyncStorage
- Location is captured automatically on purchase (with user permission)
- Photos are stored locally and tagged with growth stage and timestamp

