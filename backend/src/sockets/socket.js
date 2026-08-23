const authenticateSocket = require("./auth.socket");
const setupConversationSocket = require("./conversation.socket");
const setupMessageSocket = require("./message.socket");
const setupTypingSocket = require("./typing.socket");
const setupPresenceSocket = require("./presence.socket");

const setupSocket = (io) => {

  io.use(authenticateSocket);

  io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);
    console.log("User:", socket.user);

    setupConversationSocket(io, socket);

    setupMessageSocket(io, socket);

    setupTypingSocket(io, socket);

    const presence = setupPresenceSocket(io, socket);

    socket.on("disconnect", async () => {

      console.log("Client disconnected:", socket.id);

      await presence.setOffline();

    });

  });

};

module.exports = setupSocket;