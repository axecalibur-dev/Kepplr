import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";
//
export const PostActions = sequelize.define("PostActions", {
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

  post: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Posts",
      key: "id",
    },
  },

  action: {
    type: DataTypes.STRING,
    required: true,
  },
});
