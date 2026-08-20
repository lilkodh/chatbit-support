const conversationService = require("../services/conversation.service");

const createConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.createConversation(
      req.user.id,
      req.body.subject
    );

    return res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getConversations(
      req.user
    );

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
  
};
const joinConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.joinConversation(
      Number(req.params.id),
      req.user
    );

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};
const closeConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.closeConversation(
      Number(req.params.id),
      req.user
    );

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createConversation,
  getConversations,
  joinConversation,
  closeConversation,
};