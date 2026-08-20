const express = require("express");

const conversationController = require("../controllers/conversation.controller");
const messageController = require("../controllers/message.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createConversationSchema,
} = require("../schemas/conversation.schema");

const {
  getMessagesSchema,
} = require("../schemas/message.schema");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  conversationController.getConversations
);

router.post(
  "/",
  authMiddleware,
  validate(createConversationSchema),
  conversationController.createConversation
);

router.get(
  "/:id/messages",
  authMiddleware,
  validate(getMessagesSchema, "query"),
  messageController.getMessages
);
router.patch(
  "/:id/join",
  authMiddleware,
  conversationController.joinConversation
);

module.exports = router;