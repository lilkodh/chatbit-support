const messageService = require("../services/message.service");

const getMessages = async (req, res, next) => {
  try {
    const result = await messageService.getMessages(
      Number(req.params.id),
      req.user,
      req.query.page,
      req.query.limit
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
};