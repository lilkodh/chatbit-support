const { Message, Conversation } = require("../models");

const getMessages = async (conversationId, user, page, limit) => {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isClient = conversation.client_id === user.id;
  const isAgent = conversation.agent_id === user.id;

  if (!isClient && !isAgent) {
    throw new Error("You do not have access to this conversation");
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Message.findAndCountAll({
    where: {
      conversation_id: conversationId,
    },
    order: [["sent_at", "ASC"]],
    limit,
    offset,
  });

  return {
    messages: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

module.exports = {
  getMessages,
};