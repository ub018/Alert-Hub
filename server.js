const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize the server
const app = express();
const server = http.createServer(app);

// Setup WebSockets and allow connections from your frontend
const io = new Server(server, {
  cors: {
    origin: "*", // Allows your GitHub Pages site to talk to this server
    methods: ["GET", "POST"]
  }
});

// Listen for connections from users' phones
io.on('connection', (socket) => {
  console.log('A new member connected:', socket.id);

  // 1. Listen for standard chat messages (Text or Photos)
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    // Push the message to everyone ELSE in the chat
    socket.broadcast.emit('receive_message', data);
  });

  // 2. Listen for the Emergency Button activation
  socket.on('trigger_emergency', (emergencyData) => {
    console.log('EMERGENCY TRIGGERED by:', emergencyData.sender);
    // Instantly push the alert and live location to EVERYONE
    io.emit('emergency_alert', emergencyData);
  });

  // Handle when a user closes the app
  socket.on('disconnect', () => {
    console.log('A member disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Yuvraj's Chat Server is running on port ${PORT}`);
});
