import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { user_name, user_email, message } = await req.json();

  // IMPORTANT: Replace with your own email configuration in environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  try {
    await transporter.sendMail({
      from: `"${user_name}" <${process.env.EMAIL_FROM}>`, // Sender's name and authorized email
      to: process.env.EMAIL_TO, // Your receiving email address
      replyTo: user_email, // Set the reply-to to the user's email
      subject: `New message from ${user_name} on your website`,
      text: message,
      html: `<p>You have a new message from:</p>
             <p><strong>Name:</strong> ${user_name}</p>
             <p><strong>Email:</strong> ${user_email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    return NextResponse.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ message: 'Failed to send message.' }, { status: 500 });
  }
}
