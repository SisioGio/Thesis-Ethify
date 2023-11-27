module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define(
    "company",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      vatNo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "vatNo is required" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "email is required" },
        },
      },
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "walletAddress is required" },
        },
      },
     
    },
    {
      paranoid: true,
    }
  );

  return Company;
};
