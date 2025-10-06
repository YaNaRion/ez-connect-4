// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameEvent } from '~/components/Game';

// Define types for the context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  transport: string;
}

interface SocketProviderProps {
  children: ReactNode;
}


// Create context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook for using socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:3000';

    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    const onConnect = () => {
      setIsConnected(true);
      setTransport(newSocket.io.engine.transport.name);
      console.log('Socket connected');
    };

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      setTransport("N/A");
      console.log('Socket disconnected:', reason);
    };

    const onConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
    };

    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);

    return () => {
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
      newSocket.close();
    };
  }, []);


  const value: SocketContextType = {
    socket,
    isConnected,
    transport,
  };

  if (!isConnected) return <div>Connecting to server...</div>;
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
