module.exports = (sequelize, Sequelize) => {
  const PaymentTerm = sequelize.define(
    "paymentTerm",
    {
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        enum: ["EOM", "NET"],
        validate: {
          notNull: { msg: "type is required" },
        },
      },

      days: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "days is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return PaymentTerm;
};
