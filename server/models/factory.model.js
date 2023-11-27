module.exports = (sequelize, Sequelize) => {
  const Factory = sequelize.define(
    "factory",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "code is required" },
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      }
     

    },
    {
      paranoid: true,
    }
  );

  return Factory;
};
