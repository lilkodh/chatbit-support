const express = require("express");
const fs = require("fs");
const path = require("path");

const { apiReference } = require("@scalar/express-api-reference");
const YAML = require("yaml");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/conversations", conversationRoutes);

const openapiPath = path.join(__dirname, "docs", "openapi.yaml");

const openapiDocument = YAML.parse(
  fs.readFileSync(openapiPath, "utf8")
);

app.use(
  "/docs",
  apiReference({
    spec: {
      content: openapiDocument,
    },
  })
);

app.use(errorMiddleware);

module.exports = app;