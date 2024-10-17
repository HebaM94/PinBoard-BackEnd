import nodemailer from 'nodemailer';

export default async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // change after deployment to the actual domain in  mailtrap
      port: 465, // Or 465 for SSL
      secure: false, // true for SSL
      auth: {
        user: '650fe01f15a206',
        pass: 'efceab0c3c45fd',
      },
    });

    const result = await transporter.sendMail(mailOptions);
    console.log(result);
    console.log(`Email sent to ${mailOptions.to}`);
    // return .status(200).json({ message: 'Please check your email' });
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
}
