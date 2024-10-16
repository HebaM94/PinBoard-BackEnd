import nodemailer from 'nodemailer';

export async function sendEmail(mailOptions) {
    try {

      const transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io', // change after deployment to the actual domain in  mailtrap
        port: 587, // Or 465 for SSL
        secure: false, // true for SSL
        auth: {
          user: 'smtp@mailtrap.io',
          pass: 'd5d364ace96f2b1b1eb97a13addd7825',
        },
      });
      
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${mailOptions.to}`);
      return response.status(200).json({ message: 'Please check your email' });
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
  }