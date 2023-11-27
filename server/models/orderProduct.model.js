module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define(
    "orderProduct",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "quantity is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return OrderProduct;
};
