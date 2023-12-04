import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export const Users = sequelize.define("Users", {
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

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  username_handle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
