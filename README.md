# OrbIT - Integrated Information & Resource Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Development-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v3.4.1-38bdf8)

**OrbIT** (Orbit Information Technology) adalah platform web komprehensif yang dirancang untuk menyelesaikan dua masalah kritis di Departemen Teknologi Informasi ITS Surabaya:

1. **Fragmentasi Informasi** - Sentralisasi pengumuman yang tersebar di berbagai platform
2. **Manajemen Ruang Kelas** - Sistem pemesanan transparan untuk ketersediaan ruang kelas di luar jam kuliah reguler

---

## 📸 Screenshots

### Halaman Login
<!-- Insert login page screenshot here -->
![Login Page](docs/screenshots/login.png)

### Dashboard
<!-- Insert dashboard screenshot here -->
![Dashboard](docs/screenshots/dashboard.png)

### Halaman Announcements
<!-- Insert announcements page screenshot here -->
![Announcements Page](docs/screenshots/announcements.png)

### Sistem Booking Ruang Kelas
<!-- Insert booking page screenshot here -->
![Classroom Booking](docs/screenshots/booking.png)

### Dropdown Filter (Custom UI)
<!-- Insert dropdown screenshot here -->
![Custom Dropdown](docs/screenshots/dropdown.png)

---

## Real World Problem

### Masalah Saat Ini

**Informasi yang Terfragmentasi**
- Pengumuman tersebar di berbagai platform: WhatsApp, Instagram, email, dan papan pengumuman fisik
- Mahasiswa sering melewatkan informasi penting yang bersifat time-sensitive
- Tidak ada sistem komunikasi departemen yang terpusat
- Kesulitan dalam menyaring informasi yang relevan berdasarkan role

**Kekacauan Booking Ruang Kelas**
- Tidak ada sistem transparan untuk mengecek ketersediaan ruang kelas
- Sering terjadi konflik jadwal dan double booking
- Mahasiswa kesulitan menemukan ruangan untuk diskusi kelompok, praktikum, dan pertemuan
- Staff tendik kesulitan melacak penggunaan ruangan

---

## 💡 Solusi: Platform OrbIT

### Fitur Utama

#### 1. **Sistem Information Board**
- Hub pusat untuk semua pengumuman departemen
- Filter berbasis role (Mahasiswa, Dosen, Tendik, Admin)
- Level prioritas (Normal, Important, Urgent)
- Kategori (Academic, HMIT Events, Lab Schedule, General)
- Dukungan attachment file
- Fungsi search dan filter

#### 2. **Sistem Booking Ruang Kelas** 🌟
- Real-time tracker ketersediaan ruang kelas
- Interactive calendar view dengan color-coded schedules
- Smart conflict detection algorithm
- Approval workflow (Pending → Approved/Rejected)
- Email notifications untuk status booking
- Booking history dan management

---

## 🛠 Tech Stack

### Frontend
- **React.js 19.2.0** - UI library
- **React Router v7** - Client-side routing dengan dukungan data APIs
- **Tailwind CSS v3.4.1** - Utility-first CSS framework dengan minimal design system
- **Axios** - HTTP client untuk API communication
- **CRACO** - Create React App Configuration Override

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21** - Web application framework
- **MongoDB** - NoSQL database untuk flexible schema
- **Mongoose 7.8** - ODM (Object Data Modeling) untuk MongoDB

### Security & Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing dengan salt rounds
- **CORS** - Cross-origin resource sharing configuration

### Additional Tools
- **Multer** - Middleware untuk file upload handling
- **Nodemailer** - Email notification service
- **Nodemon** - Development hot-reload server

---

## 📁 Struktur Project

```
OrbIT-Web/
├── backend/
│   ├── config/              # Database configuration
│   │   └── db.js            # MongoDB connection setup
│   ├── controllers/         # Route controllers (business logic)
│   │   ├── authController.js         # Authentication logic
│   │   ├── announcementController.js # Announcement CRUD
│   │   ├── bookingController.js      # Booking management
│   │   ├── classroomController.js    # Classroom CRUD
│   │   └── scheduleController.js     # Schedule management
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication & authorization
│   │   ├── upload.js        # File upload (Multer) configuration
│   │   └── errorHandler.js  # Global error handling
│   ├── models/              # Mongoose schemas & models
│   │   ├── User.js          # User model dengan role-based access
│   │   ├── Announcement.js  # Announcement dengan attachments
│   │   ├── Classroom.js     # Classroom dengan facilities
│   │   ├── RegularSchedule.js # Jadwal kuliah reguler
│   │   └── Booking.js       # Booking dengan approval workflow
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── classroomRoutes.js
│   ├── utils/               # Utility functions
│   │   ├── conflictChecker.js # Smart booking conflict detection
│   │   └── emailService.js    # Email notification sender
│   ├── uploads/             # Uploaded files storage directory
│   ├── .env.example         # Environment variables template
│   ├── server.js            # Application entry point
│   └── package.json         # Dependencies & scripts
│
├── frontend/
│   ├── public/              # Static assets
│   │   ├── index.html       # HTML template
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── common/      # Common UI components
│   │   │       ├── Navbar.jsx          # Navigation bar dengan profile dropdown
│   │   │       ├── Button.jsx          # Reusable button (primary, secondary, etc)
│   │   │       ├── Input.jsx           # Form input dengan validation
│   │   │       ├── Select.jsx          # Custom dropdown dengan smooth animation
│   │   │       ├── Badge.jsx           # Status badges (pending, approved, etc)
│   │   │       ├── LoadingSpinner.jsx  # Loading indicator
│   │   │       └── ProtectedRoute.jsx  # Route authentication guard
│   │   ├── pages/           # Page components (routes)
│   │   │   ├── auth/        # Authentication pages
│   │   │   │   ├── Login.jsx           # Login page dengan split design
│   │   │   │   └── Register.jsx        # Registration page
│   │   │   ├── Dashboard.jsx           # Main dashboard dengan stats
│   │   │   ├── Announcements.jsx       # Announcement list dengan filter
│   │   │   ├── AnnouncementDetail.jsx  # Single announcement view
│   │   │   ├── CreateAnnouncement.jsx  # Create announcement form
│   │   │   ├── BookClassroom.jsx       # Classroom booking interface
│   │   │   ├── MyBookings.jsx          # User's booking history
│   │   │   └── ApprovalQueue.jsx       # Booking approval (Tendik/Admin)
│   │   ├── services/        # API services (Axios instances)
│   │   │   ├── api.js                  # Base Axios configuration
│   │   │   ├── authService.js          # Auth API calls
│   │   │   ├── announcementService.js  # Announcement API calls
│   │   │   ├── bookingService.js       # Booking API calls
│   │   │   └── classroomService.js     # Classroom API calls
│   │   ├── contexts/        # React Context for state management
│   │   │   └── AuthContext.jsx         # Global auth state
│   │   ├── utils/           # Utility functions
│   │   │   ├── constants.js            # App constants (roles, status, etc)
│   │   │   └── dateUtils.js            # Date formatting helpers
│   │   ├── App.js           # Root component dengan routing
│   │   ├── index.js         # React DOM render entry point
│   │   └── index.css        # Global styles & Tailwind directives
│   ├── .env.example         # Environment variables template
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration (minimal black/white)
│   ├── postcss.config.js    # PostCSS config untuk Tailwind v3
│   ├── craco.config.js      # CRACO configuration override
│   └── vercel.json          # Vercel deployment configuration
│
└── docs/                    # Comprehensive documentation
    └── orbit-docs/
        ├── PROJECT_BRIEF.md         # Project overview & requirements
        ├── ARCHITECTURE.md          # System architecture
        ├── API_ENDPOINTS.md         # API documentation
        ├── FRONTEND_GUIDE.md        # Frontend development guide
        ├── BACKEND_GUIDE.md         # Backend development guide
        └── DEPLOYMENT_CHECKLIST.md  # Production deployment guide
```

---

## 🚀 Instalasi & Setup

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v14 atau lebih tinggi)
- **MongoDB** (instalasi lokal atau MongoDB Atlas account)
- **npm** atau **yarn** package manager
- **Git**

### Backend Setup

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd OrbIT-Web/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit file `.env` dan isi dengan nilai Anda:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbit-it
   JWT_SECRET=your_super_secret_key_minimum_32_characters_long
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Jalankan backend server**
   ```bash
   npm run dev    # Development mode dengan nodemon
   # atau
   npm start      # Production mode
   ```

   Server akan berjalan di `http://localhost:5001`

### Frontend Setup

1. **Navigate ke direktori frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit file `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_ENV=development
   ```

4. **Jalankan React development server**
   ```bash
   npm start
   ```

   Aplikasi akan terbuka di `http://localhost:3000`

---

## 📖 Dokumentasi API

### Authentication Endpoints

```
POST /api/auth/register          # Register user baru
POST /api/auth/login             # Login user
GET  /api/auth/me                # Get informasi user saat ini
PUT  /api/auth/profile           # Update profil user
```

### Announcement Endpoints

```
GET    /api/announcements        # Get semua announcements (dengan filter)
GET    /api/announcements/:id    # Get single announcement
POST   /api/announcements        # Create announcement (Dosen+)
PUT    /api/announcements/:id    # Update announcement
DELETE /api/announcements/:id    # Delete announcement
```

### Booking Endpoints

```
GET    /api/bookings             # Get semua bookings (admin/tendik)
GET    /api/bookings/my          # Get bookings milik user
POST   /api/bookings             # Create booking baru
PUT    /api/bookings/:id/approve # Approve booking (tendik/admin)
PUT    /api/bookings/:id/reject  # Reject booking (tendik/admin)
DELETE /api/bookings/:id         # Cancel booking (user)
```

### Classroom Endpoints

```
GET    /api/classrooms           # Get semua classrooms
GET    /api/classrooms/:id       # Get single classroom
POST   /api/classrooms           # Create classroom (admin)
PUT    /api/classrooms/:id       # Update classroom (admin)
DELETE /api/classrooms/:id       # Delete classroom (admin)
```

Untuk dokumentasi API lengkap dengan contoh request/response, lihat [docs/orbit-docs/API_ENDPOINTS.md](docs/orbit-docs/API_ENDPOINTS.md)

---

## 👥 User Roles & Permissions

### 1. Mahasiswa (Student)
- Lihat semua announcements
- Buat booking ruang kelas
- Lihat history booking sendiri
- Cancel booking yang masih pending

### 2. Dosen (Lecturer)
- Semua permission Mahasiswa
- Buat announcements
- Lihat jadwal ruang kelas

### 3. Tendik (Administrative Staff)
- Semua permission Dosen
- Approve/reject booking ruang kelas
- Lihat semua booking requests
- Kelola approval queue

### 4. Admin (System Administrator)
- Semua permissions
- Kelola classrooms (CRUD)
- Kelola regular schedules
- Akses analytics dashboard

---

## 🎨 Fitur Unggulan

### Smart Conflict Detection
Sistem booking menggunakan intelligent conflict checker yang:
- Membandingkan waktu booking yang diminta dengan booking yang sudah ada
- Mengecek terhadap jadwal kelas reguler
- Mencegah double booking secara otomatis
- Memberikan informasi konflik yang detail

### Role-Based Access Control (RBAC)
- JWT-based authentication dengan secure token
- Middleware protection pada semua protected routes
- Dynamic UI berdasarkan user role
- Secure API endpoints dengan authorization check

### Responsive Design
- Mobile-first approach untuk optimal mobile experience
- Tailwind CSS untuk consistent styling
- Adaptive layouts untuk semua ukuran layar
- Touch-friendly UI elements

### Custom Dropdown Component
- Smooth animation (fade-in & rotate)
- Keyboard navigation support
- Click outside to close
- Selected state dengan checkmark icon
- Black/white minimal design

### Email Notifications
- Automatic email saat booking diapprove
- Email saat booking direject dengan alasan
- Notification preferences (future feature)

---

### Quick Test

**Backend Health Check:**
```bash
curl http://localhost:5001/health
```

**Frontend Development:**
```bash
cd frontend
npm start
# Buka http://localhost:3000
```

---

## 📊 Database Schema

### User Schema
- `fullName`, `email`, `nrp`, `password` (hashed dengan bcrypt)
- `primaryRole`: mahasiswa, dosen, tendik, admin
- `secondaryRoles`: array untuk multiple roles
- Validation: NRP harus 10 digit, password minimal 8 karakter

### Announcement Schema
- `title`, `description`, `content` (rich text support)
- `priority`: normal, important, urgent
- `category`: academic, hmit_event, lab_schedule, general
- `targetRoles`: array of role strings untuk filtering
- `attachments`: array of file URLs
- `createdBy`: User reference untuk author info

### Classroom Schema
- `name`, `building`, `floor`, `capacity`
- `facilities`: array of strings (Projector, AC, Whiteboard, dll)
- `isActive`: boolean untuk soft delete

### Booking Schema
- `user`, `classroom`: references ke User & Classroom
- `date`, `startTime`, `endTime` untuk scheduling
- `purpose`: string, alasan booking
- `status`: pending, approved, rejected, cancelled
- `rejectionReason`: optional, alasan reject
- `approvedBy`, `rejectedBy`: User references

### RegularSchedule Schema
- `classroom`: reference ke Classroom
- `dayOfWeek`: 0-6 (Sunday-Saturday)
- `startTime`, `endTime`: waktu kelas reguler
- `subject`, `instructor`, `class`: informasi mata kuliah

---

## Closing

Project ini adalah tugas mata kuliah **Pemrograman Web A** di **Teknologi Informasi, ITS Surabaya**.

**Developer:**
- **Nama**: Danar Bagus Rasendriya
- **NRP**: 5027231055
- **Email**: danarbrasendriya@gmail.com
- **GitHub**: [github.com/rasendr1ya](https://github.com/rasendr1ya)

---

## 🔄 Latest Updates

### (3 December 2025)
- ✅ Fixed Tailwind CSS v4 compatibility (downgrade to v3.4.1)
- ✅ Implemented custom Select/Dropdown component with smooth animations
- ✅ Fixed password validation (8 characters minimum)
- ✅ Redesigned Login & Register pages with split-screen layout
- ✅ Fixed frontend-backend port configuration (5001)
- ✅ Fixed MongoDB connection string

---

**Made with ❤️ for the IT Department, ITS Surabaya**

**Version**: 1.1.0
**Last Updated**: Desember 2025
