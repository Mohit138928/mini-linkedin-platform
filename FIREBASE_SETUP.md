# Firebase Authentication Setup Guide

## ⚠️ IMPORTANT: You need to enable Authentication in Firebase Console

### Steps to Enable Firebase Authentication:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `mini-linkedin-platform`

2. **Enable Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started" button
   - Go to "Sign-in method" tab

3. **Enable Email/Password Provider**
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

4. **Verify Configuration**
   - Your project ID should be: `mini-linkedin-platform`
   - Your API key should be: `AIzaSyALBYA4f82Qo43rzYK5-ARXD084z2c2bbM`

### Current Status:
✅ Firebase config is properly set in the code
✅ Environment variables are configured
❌ **You need to enable Authentication in Firebase Console**

### After enabling Authentication:
1. Try signing up again
2. The error should be resolved
3. You should be able to create accounts and login

### Testing:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. Submit the form
5. Should work without the 400 error

If you still get errors after enabling Authentication, check:
- Make sure Email/Password provider is enabled
- Verify your project ID matches: `mini-linkedin-platform`
- Check that you're using the correct API key
