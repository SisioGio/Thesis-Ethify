module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define(
    "customer",
    {},
    {
      paranoid: true,
    }
  );

  return Customer;
};
