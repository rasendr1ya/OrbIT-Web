# OrbIT Frontend Testing Guide

## 🚀 Quick Start

### 1. Ensure Both Servers Are Running

**Backend:** http://localhost:5001
```bash
cd backend
npm start
```

**Frontend:** http://localhost:3001
```bash
cd frontend
npm start
```

## 🧪 Testing Flow

### Step 1: User Registration & Authentication

1. **Register New Users** (http://localhost:3001/register)
   - Test all 4 roles:
     - **Mahasiswa** (requires NRP field)
     - **Dosen**
     - **Tendik**
     - **Admin**

   Example test users:
   ```
   Mahasiswa:
   - Full Name: John Doe
   - Email: john@student.its.ac.id
   - NRP: 5027231001
   - Password: password123

   Dosen:
   - Full Name: Dr. Jane Smith
   - Email: jane@lecturer.its.ac.id
   - Password: password123

   Tendik:
   - Full Name: Admin Staff
   - Email: staff@its.ac.id
   - Password: password123
   ```

2. **Login** (http://localhost:3001/login)
   - Use registered credentials
   - Check if redirected to dashboard
   - Verify user info appears in navbar

### Step 2: Dashboard

1. **View Dashboard** (http://localhost:3001/)
   - Check stats cards display correctly
   - Verify quick action buttons
   - Check recent announcements section
   - Check upcoming bookings section

### Step 3: Announcements System

#### A. View Announcements (All Roles)

1. **List View** (http://localhost:3001/announcements)
   - Filter by category (Academic, HMIT Event, Lab Schedule, General)
   - Filter by priority (Urgent, Important, Normal)
   - Click on announcement card to view details

2. **Detail View** (http://localhost:3001/announcements/:id)
   - View full announcement details
   - Check attachments section (if any)
   - Click download links for attachments
   - View count should increment

#### B. Create Announcement (Dosen/Tendik/Admin Only)

1. **Create New** (http://localhost:3001/announcements/create)
   - **Test validations:**
     - Title (min 5 characters)
     - Description (min 20 characters)
   - Select category and priority
   - Upload attachments:
     - Test file size validation (max 5MB)
     - Test file type validation (images and PDFs only)
     - Upload multiple files
   - Submit and verify redirection to announcements list

### Step 4: Classroom Booking System

#### A. Book Classroom (All Roles)

1. **Start Booking** (http://localhost:3001/book-classroom)
   - View available classrooms list
   - Click to select a classroom
   - **Fill booking form:**
     - Select future date (past dates should be blocked)
     - Select start time
     - Select end time
     - Check duration calculation
     - Enter purpose (min 10 characters)

   - **Test validations:**
     - End time must be after start time
     - Duration must be 30 min - 4 hours
     - Cannot book past dates

   - **Test conflict detection:**
     - Try to book overlapping time slots
     - Check conflict message display

2. **Submit Booking**
   - Verify redirection to My Bookings
   - Check booking appears with "Pending" status

#### B. View My Bookings (All Roles)

1. **My Bookings Page** (http://localhost:3001/my-bookings)
   - View all your bookings
   - Filter by status (All, Pending, Approved, Rejected, Cancelled)
   - Check booking details display correctly
   - **Test cancel functionality:**
     - Cancel a pending booking
     - Verify confirmation dialog
     - Check status updates to "Cancelled"

#### C. Approval Queue (Tendik/Admin Only)

1. **Access Approval Queue** (http://localhost:3001/approval-queue)
   - View all booking requests
   - Check stats cards (Total, Pending, Approved, Rejected)
   - Filter bookings by status

2. **Approve Booking**
   - Click "Approve" on pending booking
   - Verify confirmation dialog
   - Check status updates to "Approved"
   - Verify email notification sent (check backend logs)

3. **Reject Booking**
   - Click "Reject" on pending booking
   - Enter rejection reason in modal
   - Submit rejection
   - Check status updates to "Rejected"
   - Verify rejection reason displays in booking details

### Step 5: Navigation & UX

1. **Navbar Testing**
   - Click all navigation links
   - Test user profile dropdown
   - Verify logout functionality
   - Check mobile responsive menu

2. **Role-Based Access Control**
   - **Mahasiswa:** Should NOT see "Create Announcement" or "Approval Queue"
   - **Dosen:** Should see "Create Announcement", NOT "Approval Queue"
   - **Tendik:** Should see both "Create Announcement" and "Approval Queue"
   - **Admin:** Should see all pages and features

3. **Protected Routes**
   - Try accessing pages while logged out
   - Should redirect to login page
   - After login, should redirect back to intended page

### Step 6: Responsive Design

1. **Desktop View** (1920x1080)
   - Check layout spacing
   - Verify grid columns display correctly

2. **Tablet View** (768x1024)
   - Check responsive grid adjustments
   - Verify navbar collapses to hamburger menu

3. **Mobile View** (375x667)
   - Check all elements are readable
   - Verify forms are usable
   - Test mobile navigation menu

## 🐛 Common Issues to Test

### 1. Authentication
- [ ] Token expiration handling
- [ ] Logout clears localStorage
- [ ] Protected routes redirect to login when unauthorized

### 2. Form Validations
- [ ] Empty field validation
- [ ] Minimum length validation
- [ ] File size validation
- [ ] File type validation
- [ ] Date/time validation

### 3. API Error Handling
- [ ] Network errors display user-friendly messages
- [ ] 401 errors redirect to login
- [ ] Conflict errors show detailed information

### 4. Loading States
- [ ] Loading spinners appear during API calls
- [ ] Buttons disable during submission
- [ ] No double-submit issues

### 5. Data Consistency
- [ ] Newly created items appear in lists
- [ ] Status updates reflect immediately
- [ ] Filters work correctly
- [ ] Sorting works as expected

## 📊 Test Scenarios

### Scenario 1: Student Books Classroom
1. Register as Mahasiswa
2. Login
3. Go to Book Classroom
4. Select a classroom
5. Choose tomorrow's date, 10:00-12:00
6. Enter purpose: "Study Group for Calculus"
7. Submit booking
8. Verify appears in My Bookings with "Pending" status

### Scenario 2: Tendik Approves Booking
1. Login as Tendik
2. Go to Approval Queue
3. Find the student's booking
4. Click "Approve"
5. Verify status changes to "Approved"
6. Check student receives email notification (backend logs)

### Scenario 3: Dosen Creates Announcement
1. Login as Dosen
2. Go to Create Announcement
3. Fill form:
   - Title: "Midterm Exam Schedule"
   - Description: "The midterm exam will be held next week..."
   - Category: Academic
   - Priority: Important
4. Upload PDF attachment
5. Submit
6. Verify appears in Announcements list

### Scenario 4: Booking Conflict Detection
1. As Mahasiswa, create booking for Room A, tomorrow 10:00-12:00
2. Wait for Tendik to approve
3. Try to create another booking for Room A, tomorrow 11:00-13:00
4. Verify conflict error appears
5. Check conflict details display correctly

## ✅ Final Checklist

- [ ] All 4 user roles can register
- [ ] Login/logout works correctly
- [ ] Dashboard displays role-appropriate data
- [ ] Announcements list with filters works
- [ ] Announcement details page loads
- [ ] Create announcement with file upload (Dosen/Tendik/Admin)
- [ ] Classroom booking with date/time selection
- [ ] Booking conflict detection works
- [ ] My Bookings page shows user's bookings
- [ ] Cancel booking functionality
- [ ] Approval queue (Tendik/Admin only)
- [ ] Approve/reject bookings
- [ ] Email notifications sent (check backend)
- [ ] All validations working
- [ ] Error messages display correctly
- [ ] Loading states appear appropriately
- [ ] Responsive design on all screen sizes
- [ ] Protected routes enforce authentication
- [ ] Role-based access control enforced

## 🎯 Success Criteria

Your frontend is working correctly if:
1. ✅ All pages load without errors
2. ✅ Forms validate input correctly
3. ✅ API calls succeed and data displays
4. ✅ Role-based permissions enforced
5. ✅ File uploads work
6. ✅ Conflict detection prevents double bookings
7. ✅ Responsive on mobile, tablet, desktop
8. ✅ Navigation flows smoothly
9. ✅ Error messages are user-friendly
10. ✅ Loading states provide feedback

## 🔧 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Tailwind styles not loading
- Check craco.config.js exists
- Verify package.json uses "craco start"
- Restart frontend server

### Can't connect to backend
- Verify backend is running on port 5001
- Check .env file has correct API_URL
- Check CORS settings in backend

### File upload fails
- Check file size (< 5MB)
- Check file type (images or PDFs only)
- Verify backend uploads/ directory exists
- Check backend Multer configuration

## 📝 Notes

- Frontend runs on **port 3001**
- Backend runs on **port 5001**
- MongoDB must be running for backend to work
- Email notifications require SMTP configuration in backend .env
- View backend console for email logs and API request logs
