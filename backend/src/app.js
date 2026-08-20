const express = require("express");
const { apiReference } = require("@scalar/express-api-reference");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(
  "/docs",
  apiReference({
    spec: {
      content: require("./docs/openapi.yaml"),
    },
  })
);

app.use(errorMiddleware);

module.exports = app;