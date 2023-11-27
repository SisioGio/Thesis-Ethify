module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define(
    "vendor",
    {},
    {
      paranoid: true,
    }
  );

  return Vendor;
};
