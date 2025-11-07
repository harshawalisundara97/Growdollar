# Firebase Setup Guide

This guide will help you set up Firebase Authentication for the Plant Growing App.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name
   - Enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Click on **Sign-in method** tab
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create a Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app:
   - Enter an app nickname (e.g., "Plant Growing App")
   - Click "Register app"
5. Copy the Firebase configuration object

## Step 4: Configure Firebase in Your App

1. Open `config/firebase.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Set Up Firestore Database (Optional but Recommended)

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location closest to your users
5. Click "Enable"

### Firestore Security Rules (for production)

Update your Firestore security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Plants collection - users can manage their own plants
    match /plants/{plantId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 6: Install Dependencies

Run the following command to install Firebase:

```bash
npm install
```

## Step 7: Test the Authentication

1. Start your app: `npm start`
2. Try creating a new account
3. Try logging in with the created account
4. Check Firebase Console > Authentication to see registered users

## Security Notes

- **Never commit** your Firebase config with real API keys to public repositories
- For production, use environment variables or secure configuration
- Update Firestore security rules before deploying to production
- Enable additional security features in Firebase Console (App Check, etc.)

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Make sure you've copied the correct API key from Firebase Console
- Check that the config values are correct

### Error: "Firebase: Error (auth/email-already-in-use)"
- This is normal when trying to sign up with an existing email
- Use the login screen instead

### Error: "Network request failed"
- Check your internet connection
- Verify Firebase project is active
- Check Firebase Console for any service outages

## Additional Features

### Password Reset (Future Enhancement)
You can add password reset functionality using:
```javascript
import { sendPasswordResetEmail } from 'firebase/auth';
```

### Social Authentication (Future Enhancement)
Enable Google Sign-In, Facebook, etc. in Firebase Console > Authentication > Sign-in method

