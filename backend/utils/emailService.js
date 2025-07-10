const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generic email sender
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"E-Health Care" <sobiiii3265@gmail.com>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Email error:`, err);
  }
};

// Invoice email sender
const sendInvoiceEmail = async (to, data, recipientType) => {
  const subject = recipientType === 'patient'
    ? `Payment Confirmation - Appointment #${data.appointmentId}`
    : `You've Earned Rs.${data.doctorPayout} - Appointment #${data.appointmentId}`;

  const html = `
    <h3>${recipientType === 'patient' ? 'Payment Confirmation' : 'Earnings Notification'}</h3>
    <p>Hello ${recipientType === 'patient' ? data.patientName : data.doctorName},</p>
    <p>Here are the payment details for Appointment #${data.appointmentId}:</p>
    <ul>
      <li><strong>Date:</strong> ${data.date}</li>
      <li><strong>Total Amount:</strong> Rs.${data.amount}</li>
      <li><strong>Platform Commission:</strong> Rs.${data.commission}</li>
      <li><strong>${recipientType === 'patient' ? 'Paid To Doctor' : 'Your Earnings'}:</strong> Rs.${data.doctorPayout}</li>
    </ul>
    <p>Thank you for using E-Health Care.</p>
  `;

  await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendInvoiceEmail
};
