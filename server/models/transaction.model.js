module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    "transaction",
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
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "description is required" },
        },
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "quantity is required" },
        },
      },
      totalLineNetAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalLineNetAmount is required" },
        },
      },

      totalLineTaxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalLineTaxAmount is required" },
        },
      },
      totalLineAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalLineAmount is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Transaction;
};
