module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "address",
    {
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "country is required" },
        },
      },
      region: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "region is required" },
        },
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "city is required" },
        },
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "street is required" },
        },
      },
      streetNo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "streetNo is required" },
        },
      },
      postcode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "postcode is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Address;
};
