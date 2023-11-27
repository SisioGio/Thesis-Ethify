module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      documentDate: {
        type: Sequelize.DATEONLY,
      },
      dueDate: {
        type: Sequelize.DATEONLY,
      },
      status: {
        type: Sequelize.STRING,
        enum: ["New", "Saved", "Posted"],
        defaultValue: "New",
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalAmount is required" },
        },
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "taxAmount is required" },
        },
      },
      netAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "netAmount is required" },
        },
      },
      url: {
        type: Sequelize.STRING,
      },
      squinvoiceUrl: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );

  return Invoice;
};
