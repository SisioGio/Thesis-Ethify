module.exports = (sequelize, Sequelize) => {
  const VerificationCode = sequelize.define(
    "verificationCode",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "code is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return VerificationCode;
};
