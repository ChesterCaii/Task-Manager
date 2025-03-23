import { renderHook, act } from '@testing-library/react';
import { useSocket } from '../lib/socket/client';
import { io } from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      token: 'mock-token',
    },
  }),
}));

describe('useSocket Hook', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes socket connection', () => {
    renderHook(() => useSocket());

    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        auth: {
          token: 'mock-token',
        },
      })
    );
  });

  it('joins task room', () => {
    const { result } = renderHook(() => useSocket());

    act(() => {
      result.current.joinTaskRoom('task-1');
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('join-task-room', 'task-1');
  });

  it('leaves task room', () => {
    const { result } = renderHook(() => useSocket());

    act(() => {
      result.current.leaveTaskRoom('task-1');
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('leave-task-room', 'task-1');
  });

  it('emits task update', () => {
    const { result } = renderHook(() => useSocket());

    act(() => {
      result.current.emitTaskUpdate('task-1', { status: 'completed' });
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('task-update', {
      taskId: 'task-1',
      update: { status: 'completed' },
    });
  });

  it('listens for task updates', () => {
    const { result } = renderHook(() => useSocket());

    act(() => {
      result.current.onTaskUpdate((data) => {
        expect(data).toEqual({
          taskId: 'task-1',
          update: { status: 'completed' },
        });
      });
    });

    expect(mockSocket.on).toHaveBeenCalledWith(
      'task-updated',
      expect.any(Function)
    );
  });

  it('disconnects socket on unmount', () => {
    const { unmount } = renderHook(() => useSocket());

    unmount();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
}); 