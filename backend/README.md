# OrbIT Backend API

Backend API for OrbIT - Information & Resource Management System for IT Department ITS.

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email notifications

## Features

- JWT-based authentication with role-based access control
- Full CRUD operations for announcements and bookings
- File upload for announcement attachments
- Classroom booking system with conflict detection
- Email notifications for booking approvals/rejections
- Role-based access (mahasiswa, dosen, tendik, admin)

## Quick Start

### Prerequisites

- Node.js >= 14.0.0
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password (for email notifications)

### Installation

```bash
# Install dependencies
npm install

# Copy .env.example to .env and configure
cp .env.example .env

# Edit .env with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Set JWT_SECRET to a secure random string (min 32 characters)
# - Set EMAIL_USER and EMAIL_PASS for Gmail SMTP

# Run in development mode
npm run dev

# Or run in production mode
npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orbit-it
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)
- PUT `/api/auth/profile` - Update profile (protected)

### Announcements
- GET `/api/announcements` - Get all announcements (protected)
- GET `/api/announcements/:id` - Get single announcement (protected)
- POST `/api/announcements` - Create announcement (Dosen+, with file upload)
- PUT `/api/announcements/:id` - Update announcement (Creator/Admin)
- DELETE `/api/announcements/:id` - Delete announcement (Creator/Admin)

### Bookings
- GET `/api/bookings` - Get all bookings (protected)
- GET `/api/bookings/calendar` - Get calendar events (protected)
- GET `/api/bookings/:id` - Get single booking (protected)
- POST `/api/bookings` - Create booking (protected)
- PUT `/api/bookings/:id/approve` - Approve booking (Tendik/Admin)
- PUT `/api/bookings/:id/reject` - Reject booking (Tendik/Admin)
- DELETE `/api/bookings/:id` - Cancel booking (protected)

### Classrooms
- GET `/api/classrooms` - Get all classrooms (protected)
- GET `/api/classrooms/:id` - Get single classroom (protected)
- GET `/api/classrooms/:id/availability` - Check availability (protected)
- POST `/api/classrooms` - Create classroom (Admin/Tendik)
- PUT `/api/classrooms/:id` - Update classroom (Admin/Tendik)
- DELETE `/api/classrooms/:id` - Delete classroom (Admin)

### Regular Schedules
- GET `/api/schedules` - Get all schedules (protected)
- GET `/api/schedules/:id` - Get single schedule (protected)
- POST `/api/schedules` - Create schedule (Admin)
- PUT `/api/schedules/:id` - Update schedule (Admin)
- DELETE `/api/schedules/:id` - Delete schedule (Admin)

## Testing with Postman

1. **Register a user:**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "fullName": "Test User",
  "email": "test@student.its.ac.id",
  "password": "password123",
  "nrp": "5027231001",
  "primaryRole": "mahasiswa"
}
```

2. **Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@student.its.ac.id",
  "password": "password123"
}
```
Copy the `token` from the response.

3. **Test protected route:**
```
GET http://localhost:5000/api/auth/me
Headers:
Authorization: Bearer <your_token_here>
```

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File uploads storage
├── .env             # Environment variables
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Deployment

See `docs/DEPLOYMENT_CHECKLIST.md` for deployment instructions to Render.com.

## License

MIT

## Developer

**Danar Bagus Rasendriya** - 5027231055
Pemrograman Web A - Teknologi Informasi, ITS Surabaya
