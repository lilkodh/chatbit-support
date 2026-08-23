const sequelize = require("./config/database");
const http = require("http");
const app = require("./app");

require("dotenv").config();
require("./models");

const { Server } = require("socket.io");

const { setIO } = require("./sockets/socket.io");
const setupSocket = require("./sockets/socket");

const server = http.createServer(app);

const io = new Server(server);

setIO(io);
setupSocket(io);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected");

    await sequelize.sync();

    console.log("Database synchronized");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Database connection failed", err);
  }
};

startServer();