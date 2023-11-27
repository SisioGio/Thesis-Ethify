module.exports = (sequelize, Sequelize) => {
  const TaxValues = sequelize.define(
    "taxValues",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },

      percentage: {
        type: Sequelize.DECIMAL(4, 2),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return TaxValues;
};
