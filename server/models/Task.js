const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("high", "medium", "low"),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tag: {
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
    tableName: "tasks",
    createdAt: "created_at",
    updatedAt: false,
  }
);

if (!User.associations.tasks) {
  User.hasMany(Task, { foreignKey: "user_id", as: "tasks" });
}

if (!Task.associations.user) {
  Task.belongsTo(User, { foreignKey: "user_id", as: "user" });
}

module.exports = Task;
