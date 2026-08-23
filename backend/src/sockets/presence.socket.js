const { User } = require("../models");

const onlineUsers = new Map();

const setupPresenceSocket = (io, socket) => {

  const setOnline = async () => {

    const userId = socket.user.id;

    const connections = onlineUsers.get(userId) || 0;

    onlineUsers.set(userId, connections + 1);

    await User.update(
      { is_online: true },
      {
        where: {
          id: userId,
        },
      }
    );

    io.emit("presence:update", {
      userId,
      isOnline: true,
    });
  };

  const setOffline = async () => {

    const userId = socket.user.id;

    const connections = onlineUsers.get(userId) || 0;

    if (connections <= 1) {

      onlineUsers.delete(userId);

      await User.update(
        { is_online: false },
        {
          where: {
            id: userId,
          },
        }
      );

      io.emit("presence:update", {
        userId,
        isOnline: false,
      });

      return;
    }

    onlineUsers.set(userId, connections - 1);
  };

  setOnline();

  return {
    setOnline,
    setOffline,
  };
};

module.exports = setupPresenceSocket;