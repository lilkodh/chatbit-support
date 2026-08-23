const { Conversation } = require("../models");
const { createMessage } = require("../services/message.service");

const setupMessageSocket = (io, socket) => {

  socket.on("message:send", async (data) => {
    try {
      const { conversationId, content } = data;

      if (!conversationId || !content) {
        throw new Error("conversationId and content are required");
      }

      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.status === "closed") {
        throw new Error("Conversation is closed");
      }

      const isClient =
        socket.user.role === "client" &&
        conversation.client_id === socket.user.id;

      const isAgent =
        socket.user.role === "agent" &&
        conversation.agent_id === socket.user.id;

      if (!isClient && !isAgent) {
        throw new Error(
          "You are not part of this conversation"
        );
      }

      const message = await createMessage(
        conversationId,
        socket.user.id,
        content
      );

      io.to(`conversation:${conversationId}`).emit(
        "message:new",
        message
      );

    } catch (error) {

      socket.emit("socket:error", {
        message: error.message,
      });

    }
  });

};

module.exports = setupMessageSocket;