const setupTypingSocket = (io, socket) => {

  socket.on("typing:start", (conversationId) => {

    const room = `conversation:${conversationId}`;

    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      isTyping: true,
    });

  });

  socket.on("typing:stop", (conversationId) => {

    const room = `conversation:${conversationId}`;

    socket.to(room).emit("typing:update", {
      userId: socket.user.id,
      isTyping: false,
    });

  });

};

module.exports = setupTypingSocket;