import { Server } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { decrypt } from '../auth/auth';

export const initSocketServer = (server: NetServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await decrypt(token);
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.data.user.email);

    socket.on('join-task-room', (taskId: string) => {
      socket.join(`task-${taskId}`);
    });

    socket.on('leave-task-room', (taskId: string) => {
      socket.leave(`task-${taskId}`);
    });

    socket.on('task-update', (data: { taskId: string; update: any }) => {
      io.to(`task-${data.taskId}`).emit('task-updated', {
        taskId: data.taskId,
        update: data.update,
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.data.user.email);
    });
  });

  return io;
}; 