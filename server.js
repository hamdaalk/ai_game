const express = require('express');
const path = require('node:path');
const http = require('node:http');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
app.disable('x-powered-by');
app.enable('trust proxy');

const server = http.createServer(app);
const syncServer = new WebSocketServer({ server, path: '/sync' });
const rooms = new Map();

function leaveRoom(socket) {
  if (!socket.room) return;
  const members = rooms.get(socket.room);
  if (!members) return;
  members.delete(socket);
  if (!members.size) rooms.delete(socket.room);
}

syncServer.on('connection', socket => {
  socket.on('message', raw => {
    let message;
    try { message = JSON.parse(String(raw)); } catch { return; }
    if (message.type === 'join') {
      leaveRoom(socket);
      socket.room = String(message.room || '').toUpperCase();
      if (!/^[A-Z]{4}$/.test(socket.room)) return socket.close(1008, 'Invalid room');
      if (!rooms.has(socket.room)) rooms.set(socket.room, new Set());
      rooms.get(socket.room).add(socket);
      socket.send(JSON.stringify({ type: 'joined', room: socket.room }));
      return;
    }
    if (!socket.room) return;
    for (const member of rooms.get(socket.room) || []) {
      if (member !== socket && member.readyState === WebSocket.OPEN) member.send(String(raw));
    }
  });
  socket.on('close', () => leaveRoom(socket));
  socket.on('error', () => leaveRoom(socket));
});

app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/connection-test', (_req, res) => res.status(200).json({
  ok: true,
  transport: 'websocket',
  rooms: rooms.size
}));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'survey-says.html')));

const port = Number(process.env.PORT) || 10000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Survey Says listening on 0.0.0.0:${port}`);
});
