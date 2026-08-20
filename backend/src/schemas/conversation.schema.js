const { z } = require("zod");

const createConversationSchema = z.object({
  subject: z.string().min(1),
});

module.exports = {
  createConversationSchema,
};
