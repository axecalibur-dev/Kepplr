import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export const Posts = sequelize.define("Posts", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now,
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now,
  },

  user: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },

  post_string: {
    type: DataTypes.STRING(200),
    required: true,
  },

  likes: {
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
  },

  dislikes: {
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
  },

  retweets: {
    type: DataTypes.INTEGER,
    required: true,
    defaultValue: 0,
  },

  isReplyTweet: {
    type: DataTypes.BOOLEAN,
    required: true,
    defaultValue: false,
  },

  isPrivate: { type: DataTypes.BOOLEAN, required: true, defaultValue: false },
});
