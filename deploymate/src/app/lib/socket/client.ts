import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const useSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.token) return;

    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      auth: {
        token: session.token,
      },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [session?.token]);

  const joinTaskRoom = (taskId: string) => {
    socketRef.current?.emit('join-task-room', taskId);
  };

  const leaveTaskRoom = (taskId: string) => {
    socketRef.current?.emit('leave-task-room', taskId);
  };

  const emitTaskUpdate = (taskId: string, update: any) => {
    socketRef.current?.emit('task-update', { taskId, update });
  };

  const onTaskUpdate = (callback: (data: any) => void) => {
    socketRef.current?.on('task-updated', callback);
  };

  return {
    socket: socketRef.current,
    joinTaskRoom,
    leaveTaskRoom,
    emitTaskUpdate,
    onTaskUpdate,
  };
}; 