const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Task = require("./Task");

const Subtask = sequelize.define(
  "Subtask",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "subtasks",
    timestamps: false,
  }
);

if (!Task.associations.subtasks) {
  Task.hasMany(Subtask, { foreignKey: "task_id", as: "subtasks", onDelete: "CASCADE" });
}

if (!Subtask.associations.task) {
  Subtask.belongsTo(Task, { foreignKey: "task_id", as: "task" });
}

module.exports = Subtask;
