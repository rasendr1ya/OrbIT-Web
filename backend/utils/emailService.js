const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const templates = {
  bookingApproved: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .details { background: white; padding: 15px; border-left: 4px solid #10B981; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 Booking Disetujui!</h2>
        </div>
        <div class="content">
          <p>Halo <strong>${booking.user.fullName}</strong>,</p>
          <p>Booking kamu telah disetujui oleh <strong>${booking.approvedBy?.fullName || 'admin'}</strong>.</p>

          <div class="details">
            <h3>Detail Booking:</h3>
            <ul>
              <li><strong>Ruangan:</strong> ${booking.classroom.name}</li>
              <li><strong>Tanggal:</strong> ${new Date(booking.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li><strong>Waktu:</strong> ${booking.startTime} - ${booking.endTime}</li>
              <li><strong>Keperluan:</strong> ${booking.purpose}</li>
              <li><strong>Jumlah Orang:</strong> ${booking.numberOfPeople}</li>
            </ul>
            ${booking.notes ? `<p><strong>Catatan:</strong> ${booking.notes}</p>` : ''}
          </div>

          <p>Jangan lupa datang tepat waktu dan gunakan ruangan dengan baik. Terima kasih!</p>
        </div>
        <div class="footer">
          <p>OrbIT - Information Technology Department, ITS Surabaya</p>
          <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  bookingRejected: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .details { background: white; padding: 15px; border-left: 4px solid #EF4444; margin: 20px 0; }
        .reason { background: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Booking Ditolak</h2>
        </div>
        <div class="content">
          <p>Halo <strong>${booking.user.fullName}</strong>,</p>
          <p>Mohon maaf, booking kamu ditolak.</p>

          <div class="details">
            <h3>Detail Booking:</h3>
            <ul>
              <li><strong>Ruangan:</strong> ${booking.classroom.name}</li>
              <li><strong>Tanggal:</strong> ${new Date(booking.bookingDate).toLocaleDateString('id-ID')}</li>
              <li><strong>Waktu:</strong> ${booking.startTime} - ${booking.endTime}</li>
            </ul>
          </div>

          <div class="reason">
            <h4>Alasan Penolakan:</h4>
            <p>${booking.rejectionReason || 'Tidak ada alasan spesifik yang diberikan.'}</p>
          </div>

          <p>Silakan coba booking di waktu lain atau hubungi Tendik untuk informasi lebih lanjut.</p>
        </div>
        <div class="footer">
          <p>OrbIT - Information Technology Department, ITS Surabaya</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Send booking notification email
exports.sendBookingEmail = async (booking, type) => {
  try {
    let subject, html;

    if (type === 'approved') {
      subject = `[OrbIT] Booking Disetujui - ${booking.classroom.name}`;
      html = templates.bookingApproved(booking);
    } else if (type === 'rejected') {
      subject = `[OrbIT] Booking Ditolak - ${booking.classroom.name}`;
      html = templates.bookingRejected(booking);
    }

    const mailOptions = {
      from: `"OrbIT System" <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${booking.user.email}`);

  } catch (error) {
    console.error('❌ Email send error:', error);
    // Don't throw error - email failure shouldn't break the main process
  }
};

// Send urgent announcement email
exports.sendAnnouncementEmail = async (announcement, recipients) => {
  try {
    const subject = `[OrbIT] ${announcement.priority.toUpperCase()}: ${announcement.title}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${announcement.title}</h2>
        <p>${announcement.description}</p>
        <p><strong>Kategori:</strong> ${announcement.category}</p>
        <p><strong>Posted by:</strong> ${announcement.createdBy.fullName}</p>
        <hr>
        <p><small>Lihat detail lengkap di aplikasi OrbIT</small></p>
      </body>
      </html>
    `;

    // Send to multiple recipients
    for (let recipient of recipients) {
      await transporter.sendMail({
        from: `"OrbIT System" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject,
        html,
      });
    }

    console.log(`📧 Announcement email sent to ${recipients.length} recipients`);

  } catch (error) {
    console.error('❌ Announcement email error:', error);
  }
};
