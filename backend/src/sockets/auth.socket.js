const { verifyToken } = require("../utils/jwt");

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const user = verifyToken(token);

    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};

module.exports = authenticateSocket;