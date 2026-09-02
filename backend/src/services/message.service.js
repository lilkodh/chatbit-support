const { Message, Conversation } = require("../models");

const createMessage = async (conversationId, userId, content) => {

  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message = await Message.create({

    conversation_id: conversationId,

    sender_id: userId,

    content,

  });

  return message;
};

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
    conversation: {
      id: conversation.id,
      status: conversation.status,
      client_id: conversation.client_id,
      agent_id: conversation.agent_id,
    },
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
  createMessage,

};