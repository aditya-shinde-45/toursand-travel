const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * Send booking confirmation email to customer
 */
async function sendBookingConfirmationEmail(booking) {
  try {
    const mailOptions = {
      from: `"Aditya Tours & Travels" <${SMTP_USER}>`,
      to: booking.customer_email,
      subject: `Booking Confirmation - ${booking.reference_number}`,
      html: generateBookingConfirmationHTML(booking)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

/**
 * Send booking status update email
 */
async function sendBookingStatusUpdateEmail(booking, oldStatus, newStatus) {
  try {
    const mailOptions = {
      from: `"Aditya Tours & Travels" <${SMTP_USER}>`,
      to: booking.customer_email,
      subject: `Booking ${newStatus} - ${booking.reference_number}`,
      html: generateStatusUpdateHTML(booking, oldStatus, newStatus)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
}

/**
 * Generate booking confirmation email HTML
 */
function generateBookingConfirmationHTML(booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1B3A5F; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF9933; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #1B3A5F; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #FF9933; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚖 Booking Confirmed!</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.customer_name},</h2>
          <p>Thank you for choosing Aditya Tours & Travels! Your booking has been confirmed.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="label">Reference Number:</span> <strong>${booking.reference_number}</strong>
            </div>
            <div class="detail-row">
              <span class="label">Trip Type:</span> ${booking.trip_type === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
            </div>
            <div class="detail-row">
              <span class="label">Pickup:</span> ${booking.pickup_address}
            </div>
            <div class="detail-row">
              <span class="label">Drop:</span> ${booking.drop_address}
            </div>
            <div class="detail-row">
              <span class="label">Departure:</span> ${new Date(booking.departure_datetime).toLocaleString('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
              })}
            </div>
            <div class="detail-row">
              <span class="label">Distance:</span> ${booking.distance_km} km
            </div>
            <div class="detail-row">
              <span class="label">Passengers:</span> ${booking.passenger_count}
            </div>
            <div class="detail-row">
              <span class="label">Total Fare:</span> <strong>₹${booking.total_fare}</strong>
            </div>
          </div>

          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Our driver will contact you 30 minutes before departure</li>
            <li>Keep your reference number handy for tracking</li>
            <li>You can track your booking status online</li>
          </ul>

          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track?ref=${booking.reference_number}" class="button">Track Your Booking</a>
          </center>

          <p>If you have any questions, feel free to contact us at ${SMTP_USER} or call us at +91-9969984328.</p>
        </div>

        <div class="footer">
          <p>© 2024 Aditya Tours & Travels. All rights reserved.</p>
          <p>24/7 Customer Support | Trusted Since 2015</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate status update email HTML
 */
function generateStatusUpdateHTML(booking, oldStatus, newStatus) {
  const statusColors = {
    CONFIRMED: '#10B981',
    CANCELLED: '#EF4444',
    COMPLETED: '#3B82F6',
    PENDING: '#F59E0B'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1B3A5F; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .status-box { background: white; padding: 20px; margin: 15px 0; text-align: center; border-radius: 8px; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; color: white; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Status Update</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.customer_name},</h2>
          <p>Your booking status has been updated.</p>
          
          <div class="status-box">
            <p><strong>Reference Number:</strong> ${booking.reference_number}</p>
            <div style="margin: 20px 0;">
              <span class="status-badge" style="background: ${statusColors[oldStatus] || '#999'};">${oldStatus}</span>
              <span style="margin: 0 10px;">→</span>
              <span class="status-badge" style="background: ${statusColors[newStatus] || '#999'};">${newStatus}</span>
            </div>
          </div>

          ${newStatus === 'CONFIRMED' ? `
            <p><strong>Great news!</strong> Your booking has been confirmed. Our driver will contact you shortly before your trip.</p>
          ` : ''}

          ${newStatus === 'CANCELLED' ? `
            <p>Your booking has been cancelled. If you have any questions, please contact us.</p>
          ` : ''}

          ${newStatus === 'COMPLETED' ? `
            <p>Thank you for traveling with us! We hope you had a pleasant journey.</p>
            <p>We'd love to hear your feedback. Please rate your experience.</p>
          ` : ''}

          <p>For any queries, contact us at ${SMTP_USER} or call +91-9969984328.</p>
        </div>

        <div class="footer">
          <p>© 2024 Aditya Tours & Travels. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send new booking notification to admin
 */
async function sendAdminNewBookingNotification(booking) {
  try {
    const mailOptions = {
      from: `"Aditya Tours & Travels" <${SMTP_USER}>`,
      to: [SMTP_USER, 'adityashinde8073@gmail.com'], // Send to both business and personal email
      subject: `New Booking Alert - ${booking.reference_number}`,
      html: generateAdminNewBookingHTML(booking)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin new booking notification sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending admin new booking notification:', error);
    throw error;
  }
}

/**
 * Send booking status update notification to admin
 */
async function sendAdminStatusUpdateNotification(booking, oldStatus, newStatus, adminName) {
  try {
    const mailOptions = {
      from: `"Aditya Tours & Travels" <${SMTP_USER}>`,
      to: [SMTP_USER, 'adityashinde8073@gmail.com'], // Send to both business and personal email
      subject: `Booking Status Updated - ${booking.reference_number}`,
      html: generateAdminStatusUpdateHTML(booking, oldStatus, newStatus, adminName)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin status update notification sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending admin status update notification:', error);
    throw error;
  }
}

/**
 * Generate admin new booking notification HTML
 */
function generateAdminNewBookingHTML(booking) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 2px solid #EF4444; border-top: none; border-radius: 0 0 8px 8px; }
        .alert-box { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF9933; border-radius: 4px; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        .label { font-weight: bold; color: #1B3A5F; }
        .value { color: #333; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #FEF3C7; color: #92400E; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; margin-top: 20px; }
        .action-required { background: #DBEAFE; border: 1px solid #3B82F6; padding: 15px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Booking Alert!</h1>
          <p style="margin: 5px 0; font-size: 18px;">Action Required</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h2 style="margin: 0 0 10px 0;">⚠️ New Customer Booking Received</h2>
            <p style="margin: 5px 0;">A new booking has been placed and requires your attention.</p>
          </div>

          <div class="booking-details">
            <h3 style="margin: 0 0 15px 0; color: #1B3A5F;">Booking Information</h3>
            
            <div class="detail-row">
              <span class="label">Reference Number:</span>
              <strong style="color: #EF4444;">${booking.reference_number}</strong>
            </div>
            
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="status status-pending">${booking.status}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Booking Time:</span>
              <span class="value">${new Date(booking.created_at).toLocaleString('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'medium',
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
          </div>

          <div class="booking-details">
            <h3 style="margin: 0 0 15px 0; color: #1B3A5F;">Trip Details</h3>
            
            <div class="detail-row">
              <span class="label">Trip Type:</span>
              <span class="value">${booking.trip_type === 'ONE_WAY' ? 'One Way' : 'Round Trip'}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Pickup Location:</span>
              <span class="value">${booking.pickup_address}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Drop Location:</span>
              <span class="value">${booking.drop_address}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Departure Date & Time:</span>
              <span class="value">${new Date(booking.departure_datetime).toLocaleString('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
            
            ${booking.return_datetime ? `
            <div class="detail-row">
              <span class="label">Return Date & Time:</span>
              <span class="value">${new Date(booking.return_datetime).toLocaleString('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
            ` : ''}
            
            <div class="detail-row">
              <span class="label">Distance:</span>
              <span class="value">${booking.distance_km} km</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Travel Time:</span>
              <span class="value">${booking.travel_time_minutes} minutes</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Passengers:</span>
              <span class="value">${booking.passenger_count}</span>
            </div>
          </div>

          <div class="booking-details">
            <h3 style="margin: 0 0 15px 0; color: #1B3A5F;">Customer Details</h3>
            
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${booking.customer_name}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value"><a href="tel:${booking.customer_phone}">${booking.customer_phone}</a></span>
            </div>
            
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${booking.customer_email}">${booking.customer_email}</a></span>
            </div>
            
            ${booking.special_instructions ? `
            <div class="detail-row" style="border: none; display: block;">
              <span class="label">Special Instructions:</span>
              <p style="margin: 5px 0; padding: 10px; background: #F3F4F6; border-radius: 4px;">${booking.special_instructions}</p>
            </div>
            ` : ''}
          </div>

          <div class="booking-details">
            <h3 style="margin: 0 0 15px 0; color: #1B3A5F;">Payment Information</h3>
            
            <div class="detail-row">
              <span class="label">Total Fare:</span>
              <strong style="color: #10B981; font-size: 18px;">₹${booking.total_fare}</strong>
            </div>
          </div>

          <div class="action-required">
            <h4 style="margin: 0 0 10px 0; color: #1E40AF;">📋 Action Required</h4>
            <ul style="margin: 5px 0; padding-left: 20px;">
              <li>Review the booking details</li>
              <li>Check vehicle availability</li>
              <li>Assign driver if not already assigned</li>
              <li>Confirm or update booking status</li>
              <li>Contact customer if needed</li>
            </ul>
            <p style="margin: 10px 0 0 0; font-style: italic; color: #6B7280;">Login to admin panel to manage this booking.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Aditya Tours & Travels - Admin Dashboard</strong></p>
          <p>This is an automated notification. Please login to your admin panel to take action.</p>
          <p style="margin-top: 10px; font-size: 11px;">© ${new Date().getFullYear()} Aditya Tours & Travels. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate admin status update notification HTML
 */
function generateAdminStatusUpdateHTML(booking, oldStatus, newStatus, adminName) {
  const statusColors = {
    CONFIRMED: { bg: '#D1FAE5', text: '#065F46', color: '#10B981' },
    CANCELLED: { bg: '#FEE2E2', text: '#991B1B', color: '#EF4444' },
    COMPLETED: { bg: '#DBEAFE', text: '#1E3A8A', color: '#3B82F6' },
    PENDING: { bg: '#FEF3C7', text: '#92400E', color: '#F59E0B' }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: #1B3A5F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 2px solid #1B3A5F; border-top: none; border-radius: 0 0 8px 8px; }
        .status-box { background: white; padding: 20px; margin: 15px 0; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin: 0 10px; }
        .booking-summary { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF9933; border-radius: 4px; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        .label { font-weight: bold; color: #1B3A5F; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Booking Status Update</h1>
          <p style="margin: 5px 0; font-size: 18px;">Admin Notification</p>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; margin: 0 0 20px 0;"><strong>Administrator:</strong> ${adminName || 'Admin'} has updated a booking status.</p>

          <div class="status-box">
            <p style="margin: 0 0 15px 0; color: #6B7280;"><strong>Reference:</strong> ${booking.reference_number}</p>
            <div style="margin: 20px 0;">
              <span class="status-badge" style="background: ${statusColors[oldStatus]?.bg || '#E5E7EB'}; color: ${statusColors[oldStatus]?.text || '#1F2937'};">${oldStatus}</span>
              <span style="font-size: 24px; color: #6B7280;">→</span>
              <span class="status-badge" style="background: ${statusColors[newStatus]?.bg || '#E5E7EB'}; color: ${statusColors[newStatus]?.text || '#1F2937'};">${newStatus}</span>
            </div>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #6B7280;">Updated at: ${new Date().toLocaleString('en-IN', { 
              dateStyle: 'full', 
              timeStyle: 'medium',
              timeZone: 'Asia/Kolkata'
            })}</p>
          </div>

          <div class="booking-summary">
            <h3 style="margin: 0 0 15px 0; color: #1B3A5F;">Booking Summary</h3>
            
            <div class="detail-row">
              <span class="label">Customer:</span>
              <span>${booking.customer_name}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span><a href="tel:${booking.customer_phone}">${booking.customer_phone}</a></span>
            </div>
            
            <div class="detail-row">
              <span class="label">Route:</span>
              <span>${booking.pickup_address} → ${booking.drop_address}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Departure:</span>
              <span>${new Date(booking.departure_datetime).toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Total Fare:</span>
              <strong style="color: #10B981;">₹${booking.total_fare}</strong>
            </div>
          </div>

          ${newStatus === 'CONFIRMED' ? `
            <div style="background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <p style="margin: 0; color: #065F46;"><strong>✓ Next Steps:</strong> Assign driver and ensure vehicle is ready for departure.</p>
            </div>
          ` : ''}

          ${newStatus === 'CANCELLED' ? `
            <div style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <p style="margin: 0; color: #991B1B;"><strong>⚠ Cancelled:</strong> Customer has been notified. Process refund if applicable.</p>
            </div>
          ` : ''}

          ${newStatus === 'COMPLETED' ? `
            <div style="background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1E3A8A;"><strong>✓ Completed:</strong> Trip finished successfully. Follow up for feedback if needed.</p>
            </div>
          ` : ''}

          <p style="margin: 20px 0 0 0; font-size: 14px; color: #6B7280; font-style: italic;">Customer has been notified via email about this status update.</p>
        </div>

        <div class="footer">
          <p><strong>Aditya Tours & Travels - Admin Dashboard</strong></p>
          <p>This is an automated status update notification.</p>
          <p style="margin-top: 10px; font-size: 11px;">© ${new Date().getFullYear()} Aditya Tours & Travels. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send contact form notification to admin
 */
async function sendAdminContactNotification(contactData) {
  try {
    const { name, email, phone, subject, message, created_at } = contactData;
    
    const mailOptions = {
      from: `"Aditya Tours & Travels" <${SMTP_USER}>`,
      to: SMTP_USER, // Send to admin email
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: generateContactNotificationHTML(contactData),
      replyTo: email // Allow admin to reply directly to customer
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent to admin:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending contact notification email:', error);
    // Don't throw - we don't want contact form submission to fail if email fails
    return null;
  }
}

/**
 * Generate contact notification HTML for admin
 */
function generateContactNotificationHTML(contactData) {
  const { name, email, phone, subject, message, created_at } = contactData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #1B3A5F 0%, #2D5A8E 100%); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .info-card { background: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #FF9933; border-radius: 4px; }
        .info-row { padding: 10px 0; border-bottom: 1px solid #e9ecef; display: flex; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #1B3A5F; min-width: 120px; }
        .info-value { color: #495057; flex: 1; }
        .message-box { background: #fff8e1; border: 1px solid #ffd54f; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .message-box h3 { margin-top: 0; color: #f57c00; }
        .message-text { color: #333; white-space: pre-wrap; word-wrap: break-word; line-height: 1.8; }
        .action-buttons { text-align: center; margin: 25px 0; }
        .button { background: #FF9933; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px; font-weight: 600; }
        .button:hover { background: #e68a2e; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
        .timestamp { background: #e7f3ff; color: #0066cc; padding: 8px 15px; border-radius: 4px; font-size: 13px; text-align: center; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has reached out through your website</p>
        </div>
        
        <div class="content">
          <div class="timestamp">
            <strong>Received:</strong> ${new Date(created_at).toLocaleString('en-IN', { 
              dateStyle: 'full', 
              timeStyle: 'medium',
              timeZone: 'Asia/Kolkata'
            })}
          </div>

          <div class="info-card">
            <h3 style="margin-top: 0; color: #1B3A5F;">Contact Information</h3>
            
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value"><strong>${name}</strong></span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value"><a href="mailto:${email}" style="color: #FF9933;">${email}</a></span>
            </div>
            
            ${phone ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value"><a href="tel:${phone}" style="color: #FF9933;">${phone}</a></span>
            </div>
            ` : ''}
            
            ${subject ? `
            <div class="info-row">
              <span class="info-label">Subject:</span>
              <span class="info-value"><strong>${subject}</strong></span>
            </div>
            ` : ''}
          </div>

          <div class="message-box">
            <h3>📝 Message</h3>
            <div class="message-text">${message}</div>
          </div>

          <div class="action-buttons">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your Inquiry')}" class="button">Reply to ${name}</a>
          </div>

          <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0066cc;">
              <strong>💡 Quick Tip:</strong> Respond to inquiries within 24 hours to maintain excellent customer service.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Aditya Tours & Travels - Admin Notification</strong></p>
          <p>This is an automated notification from your contact form.</p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} Aditya Tours & Travels. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendAdminNewBookingNotification,
  sendAdminStatusUpdateNotification,
  sendAdminContactNotification
};
