module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "product",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "description is required" },
        },
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "price is required" },
        },
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "cost is required" },
        },
      },
      quantity: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "quantity is required" },
        },
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false,
        enum: ["Product", "Service"],
        validate: {
          notNull: { msg: "Product is required" },
        },
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "unitOfMeasure is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Product;
};
