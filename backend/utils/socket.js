const socketIO = require('socket.io');
let io;

// Initialize socket.io
exports.init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a room based on user ID
    socket.on('join', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

// Send notification to specific user
exports.sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user-${userId}`).emit('notification', notification);
  }
};