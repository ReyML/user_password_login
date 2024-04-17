# Project Setup Documentation

## Overview
This project provides a simple authentication system using Firebase. It includes features for user registration, login, password reset, and account deletion.

## Prerequisites
- Node.js installed on your machine.
- A Firebase account.

## Technology Stack
- **Backend**: Firebase Authentication, Firebase Firestore
- **Frontend**: HTML, CSS
- **CSS Framework**: TailwindCSS, DaisyUI
- **JavaScript**: Vanilla JavaScript for handling authentication and interaction

## Firebase Setup

### 1. Create a Firebase Project
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click on "Add project" and follow the steps to create a new Firebase project.

### 2. Configure Authentication
- In the Firebase console, navigate to the "Authentication" section and enable "Email/Password" authentication.

### 3. Configure Firestore Database
- Navigate to the "Firestore Database" section in the Firebase console and create a database.
- Set up the following collections and documents structure:
  - **Users Collection**: Each document represents a user with fields:
    - `email`: User's email address.
    - `createdAt`: Timestamp of user creation.
    - `hasPaid`: Boolean indicating payment status.
    - `paymentId`: ID related to payment (empty string if not applicable).

### 4. Set Firestore Rules
For basic security, set the Firestore rules to allow read/write access to authenticated users only:

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

## Project Configuration

### Install Dependencies
Navigate to the project directory and install the required dependencies:
npm install


### Update Firebase Configuration
Locate the Firebase configuration in the files `public/app.js` and `views/dashboard.js`. Replace the placeholders with your actual Firebase project settings:

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
}

## Running the Project
To run the project locally, use:
npm start

Navigate to `http://localhost:3000` to view the project.

## Deployment
For deployment, follow the instructions specific to your hosting service. Ensure that environment variables are set up for your Firebase configuration in your production environment.

## Additional Notes
- Ensure all API keys and sensitive data are kept secure and not hard-coded in your project files.
- Regularly update your dependencies to keep your project secure.
- Test your application thoroughly to ensure all features work as expected before deployment.

## Support

For support, contact me at rey117@protonl.me