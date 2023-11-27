module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      status: {
        type: Sequelize.STRING,
        enum: ["New", "Invoiced"],

        default: "New",
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

  return Order;
};
