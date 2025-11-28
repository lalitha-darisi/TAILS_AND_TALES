// backend/src/controllers/chatController.js
const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');

function initSocket(io) {
  // Validate token at handshake and attach user info to socket
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: token required'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(payload.id);
      socket.userRole = payload.role;
      return next();
    } catch (err) {
      console.error('Socket auth failed:', err.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: id=${socket.id} userId=${socket.userId}`);

    // join personal room for this user
    socket.join(socket.userId);

    socket.on('send_message', async (payload, ack) => {
      try {
        const from = socket.userId; // authoritative
        const toRaw = payload.to ?? '';
        const petRaw = payload.pet ?? null;
        const message = String(payload.message ?? '').trim();

        if (!message) {
          const err = { ok: false, message: 'Message cannot be empty' };
          if (typeof ack === 'function') return ack(err);
          return socket.emit('chat_error', err);
        }

        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(String(toRaw))) {
          const err = { ok: false, message: 'Invalid recipient id' };
          if (typeof ack === 'function') return ack(err);
          return socket.emit('chat_error', err);
        }
        const to = String(toRaw);

        let petId = null;
        if (petRaw && String(petRaw).trim() !== '') {
          if (!mongoose.Types.ObjectId.isValid(String(petRaw))) {
            const err = { ok: false, message: 'Invalid pet id' };
            if (typeof ack === 'function') return ack(err);
            return socket.emit('chat_error', err);
          }
          petId = String(petRaw);
        }

        const conversationId = `${[from, to, petId || ''].sort().join('_')}`;

        const doc = await ChatMessage.create({
          conversationId,
          from,
          to,
          pet: petId,
          message
        });

        // Emit saved message to recipient and sender rooms
        io.to(to).emit('receive_message', doc);
        io.to(from).emit('receive_message', doc);

        // Call ack if provided with success and the saved doc
        if (typeof ack === 'function') return ack({ ok: true, message: 'sent', data: doc });

      } catch (err) {
        console.error('send_message error', err);
        if (typeof ack === 'function') return ack({ ok: false, message: err.message || 'Server error' });
        socket.emit('chat_error', { message: 'Server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: id=${socket.id} userId=${socket.userId}`);
    });
  });
}

async function getConversation(req, res) {
  try {
    const { userId, otherId, petId } = req.query;
    if (!userId || !otherId) return res.status(400).json({ message: 'userId and otherId required' });
    const conversationId = `${[userId, otherId, petId || ''].sort().join('_')}`;
    const messages = await ChatMessage.find({ conversationId }).sort('createdAt');
    return res.json(messages);
  } catch (err) {
    console.error('getConversation error', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { initSocket, getConversation };
