module.exports = (sequelize, Sequelize) => {
  const BusinessLine = sequelize.define(
    "businessLine",
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
      },
      

    },
    {
      paranoid: true,
    }
  );

  return BusinessLine;
};
