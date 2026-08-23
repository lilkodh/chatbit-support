const { Op } = require("sequelize");

const { Conversation } = require("../models");

const createConversation = async (userId, subject) => {
  const conversation = await Conversation.create({
    subject,
    client_id: userId,
    status: "pending",
  });

  return conversation;
};

const getConversations = async (user) => {
  if (user.role === "agent") {
    return Conversation.findAll({
      where: {
        status: {
          [Op.in]: ["pending", "in_progress"],
        },
      },
      order: [["created_at", "DESC"]],
    });
  }

  return Conversation.findAll({
    where: {
      client_id: user.id,
    },
    order: [["created_at", "DESC"]],
  });
};

const joinConversation = async (conversationId, user) => {
  if (user.role !== "agent") {
    throw new Error("Only agents can join conversations");
  }

  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.status !== "pending") {
    throw new Error("Conversation is not pending");
  }

  conversation.agent_id = user.id;
  conversation.status = "in_progress";

  await conversation.save();

  return conversation;
};

const closeConversation = async (conversationId, user) => {
  if (user.role !== "agent") {
    throw new Error("Only agents can close conversations");
  }

  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.agent_id !== user.id) {
    throw new Error("You are not assigned to this conversation");
  }

  if (conversation.status !== "in_progress") {
    throw new Error("Conversation is not in progress");
  }

  conversation.status = "closed";
  conversation.closed_at = new Date();

  await conversation.save();

  return conversation;
};

module.exports = {
  createConversation,
  getConversations,
  joinConversation,
  closeConversation,
};