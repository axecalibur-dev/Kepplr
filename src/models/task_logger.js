import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export const TaskLogger = sequelize.define("TaskLogger", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  job_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  queue_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  job_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  args: {
    type: DataTypes.JSON,
    allowNull: false,
    default: {},
  },
});
