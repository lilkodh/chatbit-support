const { Conversation } = require("../models");

const setupConversationSocket = (io, socket) => {

  socket.on("conversation:join", async (conversationId) => {
    try {
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (
        socket.user.role === "client" &&
        conversation.client_id !== socket.user.id
      ) {
        throw new Error("You are not part of this conversation");
      }

      if (
        socket.user.role === "agent" &&
        conversation.agent_id !== socket.user.id
      ) {
        throw new Error("You are not assigned to this conversation");
      }

      if (conversation.status === "closed") {
        throw new Error("Conversation is closed");
      }

      const room = `conversation:${conversationId}`;

      socket.join(room);

      console.log(
        `User ${socket.user.id} joined ${room}`
      );

      socket.emit("conversation:joined", {
        conversationId,
      });

    } catch (error) {

      socket.emit("socket:error", {
        message: error.message,
      });

    }
  });

  socket.on("conversation:leave", (conversationId) => {

    const room = `conversation:${conversationId}`;

    socket.leave(room);

    console.log(
      `User ${socket.user.id} left ${room}`
    );

    socket.emit("conversation:left", {
      conversationId,
    });

  });

};

module.exports = setupConversationSocket;