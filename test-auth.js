const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'ninja-penguin-trading'
});

console.log("Admin initialized successfully");
