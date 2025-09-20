import nodemailer from 'nodemailer';

interface DevoteeData {
  name: string;
  email: string;
  contactNo: string;
  facilitator: string;
  area: string;
  level: string;
  medicalNotes?: string;
  accommodation: string;
}

interface EmailData extends DevoteeData {
  paymentId: string;
  orderId: string;
  amount: number;
}

// Create transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });
};

export const sendConfirmationEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const accommodationType = emailData.accommodation === 'room' ? 'Room' : 'Dormitory';
    const accommodationPrice = emailData.accommodation === 'room' ? '₹2500' : '₹2000';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.email,
      subject: '🎉 Registration Confirmed - Kartik Braj Camp 2025',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #059669; }
            .value { color: #333; }
            .highlight { background: #059669; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Registration Confirmed!</h1>
              <h2>Kartik Braj Camp 2025</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${emailData.name}</strong>,</p>
              
              <p>Hare Krishna! 🙏</p>
              
              <p>Your registration for the Kartik Braj Camp 2025 has been <strong>successfully confirmed</strong>! We are excited to have you join us for this spiritual journey.</p>
              
              <div class="highlight">
                <h3>Payment Successful ✅</h3>
                <p><strong>Payment ID:</strong> ${emailData.paymentId}</p>
                <p><strong>Amount Paid:</strong> ${accommodationPrice}</p>
              </div>
              
              <div class="details">
                <h3 style="color: #059669; margin-top: 0;">Registration Details</h3>
                
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">${emailData.name}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${emailData.email}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Facilitator:</span>
                  <span class="value">${emailData.facilitator}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Area:</span>
                  <span class="value">${emailData.area}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Level:</span>
                  <span class="value">${emailData.level}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Accommodation:</span>
                  <span class="value">${accommodationType} (${accommodationPrice})</span>
                </div>
                
                ${emailData.medicalNotes ? `
                <div class="detail-row">
                  <span class="label">Medical Notes:</span>
                  <span class="value">${emailData.medicalNotes}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                  <span class="label">Order ID:</span>
                  <span class="value">${emailData.orderId}</span>
                </div>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-top: 0;">📋 Important Information</h4>
                <ul style="color: #92400e; margin: 0;">
                  <li>Please save this email for your records</li>
                  <li>Bring a printed copy of this confirmation</li>
                  <li>Camp details and schedule will be shared closer to the date</li>
                  <li>For any queries, contact your facilitator</li>
                </ul>
              </div>
              
              <p>We look forward to seeing you at the Kartik Braj Camp 2025!</p>
              
              <p><strong>Hare Krishna! 🙏</strong></p>
              
              <div class="footer">
                <p>This is an automated confirmation email from IYF Braj Camp Registration System.</p>
                <p>© 2025 ISKCON Youth Forum. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent successfully to ${emailData.email}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

export const sendAdminNotification = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (!adminEmail) {
      console.log('No admin email configured, skipping admin notification');
      return true;
    }

    const accommodationType = emailData.accommodation === 'room' ? 'Room' : 'Dormitory';
    const accommodationPrice = emailData.accommodation === 'room' ? '₹2500' : '₹2000';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Registration - ${emailData.name} - Kartik Braj Camp 2025`,
      html: `
        <h2>New Registration Received</h2>
        <p><strong>Payment ID:</strong> ${emailData.paymentId}</p>
        <p><strong>Order ID:</strong> ${emailData.orderId}</p>
        <p><strong>Amount:</strong> ${accommodationPrice}</p>
        
        <h3>Devotee Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${emailData.name}</li>
          <li><strong>Email:</strong> ${emailData.email}</li>
          <li><strong>Facilitator:</strong> ${emailData.facilitator}</li>
          <li><strong>Area:</strong> ${emailData.area}</li>
          <li><strong>Level:</strong> ${emailData.level}</li>
          <li><strong>Accommodation:</strong> ${accommodationType}</li>
          ${emailData.medicalNotes ? `<li><strong>Medical Notes:</strong> ${emailData.medicalNotes}</li>` : ''}
        </ul>
        
        <p>Registration completed at: ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};