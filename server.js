const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let activeSessions = 0;

io.on('connection', (socket) => {
  activeSessions++;
  console.log(`[Socket] New connection: ${socket.id}. Active sessions: ${activeSessions}`);
  io.emit('sessions_count', activeSessions);

  socket.on('disconnect', (reason) => {
    activeSessions = Math.max(0, activeSessions - 1);
    console.log(`[Socket] Disconnect: ${socket.id} (reason: ${reason}). Active sessions: ${activeSessions}`);
    io.emit('sessions_count', activeSessions);
  });

  socket.on('error', (err) => {
    console.error(`[Socket Error] Error in socket ${socket.id}:`, err);
  });
});

// Global error catch
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is already in use by another process!`);
  } else {
    console.error('[Server Error] Error while server start:', error);
  }
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n[Server] Shutting down the WebSocket server...');
  io.close(() => {
    server.close(() => {
      console.log('[Server] The server has been successfully stopped.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`🚀 WebSocket Server has been successfully started on http://localhost:${PORT}`);
});