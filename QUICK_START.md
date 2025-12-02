# OrbIT - Quick Start Guide

Get up and running with OrbIT in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be v14+
npm --version     # Should be v6+
mongo --version   # Optional: for local MongoDB
```

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file - REQUIRED:
# - Set a strong JWT_SECRET (min 32 characters)
# - Configure MONGODB_URI (local or Atlas)
# - Set up Gmail credentials for emails
# - Set FRONTEND_URL to http://localhost:3000

# Start the server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

## Step 2: Frontend Setup (2 minutes)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# No need to edit for local development!

# Start React app
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

## Step 3: First Login (1 minute)

1. Open browser: http://localhost:3000
2. Click "Register" (or navigate to /register)
3. Fill in the form:
   - Full Name: Test Admin
   - Email: admin@its.ac.id
   - NRP: 1234567890
   - Password: Admin123!
   - Primary Role: admin
4. Click "Register"
5. You'll be redirected to Dashboard!

## Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Dashboard loads with welcome message
- [ ] Can navigate to other pages via navbar

## Common Issues & Fixes

### Backend won't start
**Error:** `MongoDB connection error`
- **Fix:** Check MONGODB_URI in `.env`
- Local: `mongodb://localhost:27017/orbit-it`
- Atlas: Get connection string from MongoDB Atlas

### Frontend API errors
**Error:** `Network Error` or `CORS error`
- **Fix:** Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Should be: `http://localhost:5000/api`

### Port already in use
**Error:** `Port 5000 is already in use`
- **Fix:** Change PORT in backend/.env
- Remember to update REACT_APP_API_URL in frontend/.env accordingly

## Next Steps

1. **Create Test Data**
   - Register multiple users with different roles
   - Create some announcements (as dosen/admin)
   - Create classrooms (as admin)
   - Make test bookings

2. **Explore Features**
   - Dashboard with stats
   - Announcements with filtering
   - Classroom booking with conflict detection
   - Approval queue (for tendik/admin)
   - My Bookings page

3. **Prepare for Deployment**
   - Read `docs/orbit-docs/DEPLOYMENT_CHECKLIST.md`
   - Set up MongoDB Atlas
   - Get Gmail app password for email
   - Prepare environment variables

## Development Tips

### Hot Reload
Both backend (nodemon) and frontend (React) have hot reload enabled.
Changes will automatically refresh!

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)

### Database GUI Tools
- MongoDB Compass (official GUI)
- Studio 3T
- MongoDB Atlas web interface

## API Testing

Use Thunder Client, Postman, or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@its.ac.id","nrp":"1234567890","password":"Test123!","primaryRole":"mahasiswa"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@its.ac.id","password":"Test123!"}'
```

## Stopping the Servers

```bash
# In each terminal, press:
Ctrl + C
```

## Need Help?

- Check main README.md for detailed documentation
- See docs/orbit-docs/ for comprehensive guides
- Review API_ENDPOINTS.md for API reference
- Check DEPLOYMENT_CHECKLIST.md for deployment guide

---

**Happy Coding! 🚀**
