module.exports = (sequelize, Sequelize) => {
  const InvoiceLine = sequelize.define(
    "invoiceLine",
    {
      netAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "netAmount is required" },
        },
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "taxAmount is required" },
        },
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalAmount is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return InvoiceLine;
};
