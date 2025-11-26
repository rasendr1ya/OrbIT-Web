# OrbIT Backend Testing Guide

## Prerequisites Checklist

- [x] Backend dependencies installed (`npm install`)
- [ ] MongoDB running (Atlas or Local)
- [ ] `.env` file configured with MongoDB URI
- [ ] API testing tool ready (choose one below)

---

## API Testing Tools (Choose One)

### Option 1: VS Code Thunder Client (Recommended - Easiest)
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X or Ctrl+Shift+X)
3. Search for "Thunder Client"
4. Install it
5. Click the Thunder icon in sidebar
6. **Pros**: Built into VS Code, simple UI, no external app

### Option 2: Postman
1. Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Install and open
3. Create a free account or skip
4. **Pros**: Most popular, lots of features

### Option 3: curl (Command Line)
- Already installed on Mac/Linux
- Windows: Use Git Bash or WSL
- **Pros**: No installation, fast, scriptable
- **Cons**: Less user-friendly

### Option 4: HTTPie (Pretty curl)
```bash
# Install (Mac)
brew install httpie

# Install (Linux)
sudo apt install httpie

# Install (Windows with Python)
pip install httpie
```

---

## 🚀 STEP 1: Start the Backend Server

### Terminal 1: Start Backend
```bash
# Navigate to backend folder
cd "/Users/danarrasendriya/Documents/College/Semester 5/PemWeb/Final Project/OrbIT-Web/backend"

# Start server in development mode
npm run dev
```

### Expected Output:
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB connected successfully
```

### ⚠️ If You See Errors:

**"MongoDB connection error":**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check internet connection (for Atlas)

**"Port 5000 already in use":**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Or change PORT in .env to 5001
```

---

## 🧪 STEP 2: Test Health Check

### Using curl:
```bash
curl http://localhost:5000/api/health
```

### Using HTTPie:
```bash
http http://localhost:5000/api/health
```

### Using Thunder Client/Postman:
- Method: `GET`
- URL: `http://localhost:5000/api/health`
- Click "Send"

### Expected Response:
```json
{
  "status": "OK",
  "message": "OrbIT API is running",
  "timestamp": "2024-11-26T15:30:00.000Z"
}
```

✅ If you see this, your server is running correctly!

---

## 👤 STEP 3: Test User Registration

### Using curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Danar Bagus Rasendriya",
    "email": "danar@student.its.ac.id",
    "password": "password123",
    "nrp": "5027231055",
    "primaryRole": "mahasiswa",
    "secondaryRoles": ["hmit-medfo"]
  }'
```

### Using HTTPie:
```bash
http POST http://localhost:5000/api/auth/register \
  fullName="Danar Bagus Rasendriya" \
  email="danar@student.its.ac.id" \
  password="password123" \
  nrp="5027231055" \
  primaryRole="mahasiswa" \
  secondaryRoles:='["hmit-medfo"]'
```

### Using Thunder Client/Postman:
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "fullName": "Danar Bagus Rasendriya",
  "email": "danar@student.its.ac.id",
  "password": "password123",
  "nrp": "5027231055",
  "primaryRole": "mahasiswa",
  "secondaryRoles": ["hmit-medfo"]
}
```

### Expected Response (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6565a1b2c3d4e5f6g7h8i9j0",
    "fullName": "Danar Bagus Rasendriya",
    "email": "danar@student.its.ac.id",
    "nrp": "5027231055",
    "primaryRole": "mahasiswa",
    "secondaryRoles": ["hmit-medfo"]
  }
}
```

**🎯 COPY THE TOKEN!** You'll need it for protected routes.

### Test More Users:

**Dosen:**
```json
{
  "fullName": "Dr. John Doe",
  "email": "john.doe@lecturer.its.ac.id",
  "password": "password123",
  "primaryRole": "dosen"
}
```

**Tendik:**
```json
{
  "fullName": "Staff Admin",
  "email": "staff@admin.its.ac.id",
  "password": "password123",
  "primaryRole": "tendik"
}
```

**Admin:**
```json
{
  "fullName": "Super Admin",
  "email": "admin@its.ac.id",
  "password": "password123",
  "primaryRole": "admin"
}
```

---

## 🔑 STEP 4: Test User Login

### Using curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "danar@student.its.ac.id",
    "password": "password123"
  }'
```

### Using Thunder Client/Postman:
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body (raw JSON):
```json
{
  "email": "danar@student.its.ac.id",
  "password": "password123"
}
```

### Expected Response (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6565a1b2c3d4e5f6g7h8i9j0",
    "fullName": "Danar Bagus Rasendriya",
    "email": "danar@student.its.ac.id",
    "nrp": "5027231055",
    "primaryRole": "mahasiswa",
    "secondaryRoles": ["hmit-medfo"],
    "phoneNumber": null
  }
}
```

---

## 🔐 STEP 5: Test Protected Route (Get Current User)

**IMPORTANT:** Replace `YOUR_TOKEN_HERE` with the actual token from login/register response.

### Using curl:
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Thunder Client/Postman:
- Method: `GET`
- URL: `http://localhost:5000/api/auth/me`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer YOUR_TOKEN_HERE`

### Expected Response (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "6565a1b2c3d4e5f6g7h8i9j0",
    "fullName": "Danar Bagus Rasendriya",
    "email": "danar@student.its.ac.id",
    "nrp": "5027231055",
    "primaryRole": "mahasiswa",
    "secondaryRoles": ["hmit-medfo"],
    "phoneNumber": null,
    "avatar": null,
    "createdAt": "2024-11-26T10:00:00.000Z"
  }
}
```

---

## 📢 STEP 6: Test Create Announcement (Dosen+ Only)

**Login as Dosen first to get token!**

### Using curl:
```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer DOSEN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Perubahan Jadwal UTS Pemrograman Web",
    "description": "UTS dimajukan menjadi tanggal 15 Desember 2024. Harap hadir tepat waktu.",
    "category": "academic",
    "priority": "urgent",
    "targetRoles": ["mahasiswa"],
    "startDate": "2024-11-26",
    "endDate": "2024-12-15"
  }'
```

### Using Thunder Client/Postman:
- Method: `POST`
- URL: `http://localhost:5000/api/announcements`
- Headers:
  - `Authorization: Bearer DOSEN_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "Perubahan Jadwal UTS Pemrograman Web",
  "description": "UTS dimajukan menjadi tanggal 15 Desember 2024. Harap hadir tepat waktu.",
  "category": "academic",
  "priority": "urgent",
  "targetRoles": ["mahasiswa"],
  "startDate": "2024-11-26",
  "endDate": "2024-12-15"
}
```

### Expected Response (201 Created):
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "_id": "6565a1b2c3d4e5f6g7h8i9j0",
    "title": "Perubahan Jadwal UTS Pemrograman Web",
    "description": "UTS dimajukan menjadi tanggal 15 Desember 2024. Harap hadir tepat waktu.",
    "category": "academic",
    "priority": "urgent",
    "targetRoles": ["mahasiswa"],
    "attachments": [],
    "createdBy": {
      "_id": "...",
      "fullName": "Dr. John Doe",
      "email": "john.doe@lecturer.its.ac.id"
    },
    "startDate": "2024-11-26T00:00:00.000Z",
    "endDate": "2024-12-15T00:00:00.000Z",
    "isActive": true,
    "viewCount": 0,
    "createdAt": "2024-11-26T15:00:00.000Z"
  }
}
```

---

## 📖 STEP 7: Test Get All Announcements

### Using curl:
```bash
curl http://localhost:5000/api/announcements \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Response:
```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "...",
      "title": "Perubahan Jadwal UTS Pemrograman Web",
      "description": "...",
      "category": "academic",
      "priority": "urgent",
      "createdBy": {
        "fullName": "Dr. John Doe"
      },
      "viewCount": 0
    }
  ]
}
```

---

## 🏫 STEP 8: Test Create Classroom (Admin/Tendik)

**Login as Admin or Tendik first!**

```bash
curl -X POST http://localhost:5000/api/classrooms \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TC701",
    "building": "Teknik Informatika C",
    "floor": 7,
    "capacity": 40,
    "facilities": ["Proyektor", "AC", "Whiteboard"]
  }'
```

---

## 📅 STEP 9: Test Create Booking

**COPY CLASSROOM ID from previous step!**

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "classroom": "CLASSROOM_ID_HERE",
    "bookingDate": "2024-12-15",
    "startTime": "13:00",
    "endTime": "15:00",
    "purpose": "Diskusi Kelompok Tugas Besar Basis Data",
    "numberOfPeople": 10
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "Booking request submitted, waiting for approval",
  "data": {
    "_id": "...",
    "classroom": {
      "_id": "...",
      "name": "TC701",
      "building": "Teknik Informatika C"
    },
    "user": {
      "_id": "...",
      "fullName": "Danar Bagus Rasendriya",
      "email": "danar@student.its.ac.id"
    },
    "bookingDate": "2024-12-15T00:00:00.000Z",
    "startTime": "13:00",
    "endTime": "15:00",
    "purpose": "Diskusi Kelompok Tugas Besar Basis Data",
    "numberOfPeople": 10,
    "status": "pending"
  }
}
```

---

## ✅ Verification Checklist

After completing all tests above:

- [ ] Server starts without errors
- [ ] Health check returns OK
- [ ] Can register mahasiswa with NRP
- [ ] Can register dosen without NRP
- [ ] Can login with correct credentials
- [ ] Login fails with wrong password
- [ ] JWT token is returned
- [ ] Protected route works with token
- [ ] Protected route fails without token
- [ ] Dosen can create announcements
- [ ] Mahasiswa CANNOT create announcements (403 Forbidden)
- [ ] Can view all announcements
- [ ] Admin can create classrooms
- [ ] Can create booking (pending status for mahasiswa)
- [ ] Can view own bookings

---

## 🐛 Common Issues & Solutions

### "MongoServerError: bad auth"
**Fix:** Double-check password in `.env` MONGODB_URI

### "Cannot POST /api/auth/register"
**Fix:** Make sure server is running on port 5000

### "401 Unauthorized"
**Fix:** Check if token is included in Authorization header
```
Authorization: Bearer YOUR_ACTUAL_TOKEN
```

### "403 Forbidden"
**Fix:** User role doesn't have permission for this route
- Announcements creation requires dosen/tendik/admin
- Use correct user token for the operation

### "409 Conflict - Email already exists"
**Fix:** Email is already registered, use different email or login

---

## 📊 View Data in MongoDB

### Using MongoDB Compass:
1. Connect using your connection string
2. Navigate to `orbit-it` database
3. Browse collections:
   - `users` - See all registered users
   - `announcements` - See created announcements
   - `classrooms` - See classrooms
   - `bookings` - See booking requests

### Using mongosh (CLI):
```bash
mongosh "your_connection_string"

use orbit-it

# View all users
db.users.find()

# View all announcements
db.announcements.find()

# Count documents
db.users.countDocuments()
```

---

## 🎉 Success Criteria

If all tests pass, you have:
✅ Working authentication with JWT
✅ Role-based access control
✅ CRUD operations for announcements
✅ Booking system with status workflow
✅ MongoDB integration working
✅ Error handling functioning

**You're ready to build the frontend!** 🚀
