'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { setActiveSessions } from '@/store/inventorySlice';

const SOCKET_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:4000';

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('Successful connection to the WebSocket server');
    });

    socket.on('sessions_count', (count: number) => {
      dispatch(setActiveSessions(count));
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('WebSocket is disconnected:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};