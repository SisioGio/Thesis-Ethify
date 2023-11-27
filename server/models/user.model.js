module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "surname is required" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "email is required" },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
        },
      },

      token: {
        type: Sequelize.STRING,
      },
      
      status: {
        type: Sequelize.STRING,
        enum: ["Pending", "Active"],
        default: "Pending",
      },
      confirmationCode: {
        type: Sequelize.STRING,
        unique: true,
      },
    },
    {
      paranoid: true,
    }
  );

  return User;
};
