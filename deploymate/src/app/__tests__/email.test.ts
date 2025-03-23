import nodemailer from 'nodemailer';
import {
  sendTaskAssignmentEmail,
  sendTaskUpdateEmail,
  sendTaskCompletionEmail,
} from '../lib/email/email';

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

describe('Email Notifications', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendTaskAssignmentEmail', () => {
    it('sends task assignment email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await sendTaskAssignmentEmail(
        mockUser,
        'Test Task',
        'This is a test task description'
      );

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM,
        to: mockUser.email,
        subject: 'New Task Assigned: Test Task',
        html: expect.stringContaining('Test Task'),
      });
    });

    it('handles email sending error', async () => {
      const mockError = new Error('Failed to send email');
      const mockSendMail = jest.fn().mockRejectedValue(mockError);
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await expect(
        sendTaskAssignmentEmail(mockUser, 'Test Task', 'Description')
      ).rejects.toThrow('Failed to send email');
    });
  });

  describe('sendTaskUpdateEmail', () => {
    it('sends task update email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await sendTaskUpdateEmail(
        mockUser,
        'Test Task',
        'Task status has been updated'
      );

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM,
        to: mockUser.email,
        subject: 'Task Update: Test Task',
        html: expect.stringContaining('Task status has been updated'),
      });
    });

    it('handles email sending error', async () => {
      const mockError = new Error('Failed to send email');
      const mockSendMail = jest.fn().mockRejectedValue(mockError);
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await expect(
        sendTaskUpdateEmail(mockUser, 'Test Task', 'Update message')
      ).rejects.toThrow('Failed to send email');
    });
  });

  describe('sendTaskCompletionEmail', () => {
    it('sends task completion email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await sendTaskCompletionEmail(mockUser, 'Test Task');

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM,
        to: mockUser.email,
        subject: 'Task Completed: Test Task',
        html: expect.stringContaining('Congratulations'),
      });
    });

    it('handles email sending error', async () => {
      const mockError = new Error('Failed to send email');
      const mockSendMail = jest.fn().mockRejectedValue(mockError);
      (nodemailer.createTransport as jest.Mock).mockReturnValue({
        sendMail: mockSendMail,
      });

      await expect(sendTaskCompletionEmail(mockUser, 'Test Task')).rejects.toThrow(
        'Failed to send email'
      );
    });
  });
}); 