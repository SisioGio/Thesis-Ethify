module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    "payment",
    {
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "transactionHash is required" },
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "amount is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Payment;
};
