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

  username_handle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "#noimage",
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isPrivateAccount: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  sharePrimaryContactEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  registration_source: {
    type: DataTypes.ENUM("Google", "Facebook", "Email"),
    allowNull: false,
    defaultValue: "Email",
  },

  oAuthCredentials: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
});
