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

module.exports = {
  createConversation,
  getConversations,
};