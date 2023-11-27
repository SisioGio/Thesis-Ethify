module.exports = (sequelize, Sequelize) => {
  const Warehouse = sequelize.define(
    "warehouse",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "price is required" },
        },
      },
      quantity: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "quantity is required" },
        },
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "unitOfMeasure is required" },
        },
      },
      externalId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "externalId is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Warehouse;
};
