module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    "account",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "code is required" },
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      isNode: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "isNode is required" },
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        enum: ['Asset','Liability','Equity','Revenue','Expense','Gain'],
        validate: {
          notNull: { msg: "type is required" },
        },
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        
        defaultValue:0.00,
        
      },

    },
    {
      paranoid: true,
    }
  );

  return Account;
};
