import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export const Relationships = sequelize.define("Relationships", {
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

  personA: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },

  personB: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});
