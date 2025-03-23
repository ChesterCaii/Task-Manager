import nodemailer from 'nodemailer';
import { User } from '@/app/types/auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTaskAssignmentEmail(
  user: User,
  taskTitle: string,
  taskDescription: string
) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <h1>New Task Assigned</h1>
        <p>Hello ${user.name},</p>
        <p>You have been assigned a new task:</p>
        <h2>${taskTitle}</h2>
        <p>${taskDescription}</p>
        <p>Please log in to your account to view the details.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    throw error;
  }
}

export async function sendTaskUpdateEmail(
  user: User,
  taskTitle: string,
  updateMessage: string
) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Task Update: ${taskTitle}`,
      html: `
        <h1>Task Update</h1>
        <p>Hello ${user.name},</p>
        <p>There has been an update to your task:</p>
        <h2>${taskTitle}</h2>
        <p>${updateMessage}</p>
        <p>Please log in to your account to view the changes.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending task update email:', error);
    throw error;
  }
}

export async function sendTaskCompletionEmail(
  user: User,
  taskTitle: string
) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Task Completed: ${taskTitle}`,
      html: `
        <h1>Task Completed</h1>
        <p>Hello ${user.name},</p>
        <p>Congratulations! You have completed the following task:</p>
        <h2>${taskTitle}</h2>
        <p>Great job on completing your task!</p>
      `,
    });
  } catch (error) {
    console.error('Error sending task completion email:', error);
    throw error;
  }
} 