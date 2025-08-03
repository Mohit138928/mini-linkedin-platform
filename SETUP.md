# Quick Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/mini-linkedin
PORT=5000
```

### 2. Firebase Setup (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Email/Password
4. Get config from Project Settings → General → Your apps
5. Update `src/lib/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/mini-linkedin`

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in server/.env

### 4. Start Development

**Option A: Using batch script (Windows)**
```bash
double-click start-dev.bat
```

**Option B: Manual start**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend  
npm run dev
```

### 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🛠 Troubleshooting

### Firebase Auth not working?
- Check Firebase config in `src/lib/firebase.js`
- Ensure Email/Password is enabled in Firebase Console

### Cannot connect to MongoDB?
- Check if MongoDB is running locally
- Verify connection string in server/.env

### API calls failing?
- Ensure backend server is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local

### Port conflicts?
- Change PORT in server/.env to different port
- Update NEXT_PUBLIC_API_URL accordingly

## 📱 Test the Application

1. **Register a new account**
   - Go to Sign Up page
   - Fill in name, email, password, bio
   - Account should be created and logged in

2. **Create a post**
   - On home page, write in the text area
   - Click "Post" button
   - Post should appear in feed

3. **View profile**
   - Click on your name or Profile button
   - Should show your profile with posts
   - Try editing your profile

4. **Logout and login**
   - Logout and try logging back in
   - Should maintain your data and posts

## 🚀 Deployment Ready

Once everything works locally:

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Railway/Heroku)
1. Deploy server folder to hosting platform
2. Set environment variables
3. Update NEXT_PUBLIC_API_URL to production URL

### Database (MongoDB Atlas)
1. Use MongoDB Atlas for production
2. Update MONGODB_URI to Atlas connection string
