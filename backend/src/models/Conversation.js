const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "in_progress", "closed"),
      allowNull: false,
      defaultValue: "pending",
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: false,
  }
);

module.exports = Conversation;