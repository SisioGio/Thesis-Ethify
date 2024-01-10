var dbConfig;

const Sequelize = require("sequelize");

if (process.env.NODE_ENV === "test") {
  dbConfig = require("../config/db.config.test.js");
} else {
  dbConfig = require("../config/db.config.js");
}
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  define: {
    timestamps: true,
    paranoid: true,
  },
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = require("./account.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);

db.address = require("./address.model.js")(sequelize, Sequelize);
db.businessLine = require("./businessLine.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.costCenter = require("./costCenter.model.js")(sequelize, Sequelize);
db.factory = require("./factory.model.js")(sequelize, Sequelize);
db.invoice = require("./invoice.model.js")(sequelize, Sequelize);
db.invoiceLine = require("./invoiceLine.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.orderProduct = require("./orderProduct.model.js")(sequelize, Sequelize);
db.payment = require("./payment.model.js")(sequelize, Sequelize);

db.refreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);
db.taxCode = require("./taxCode.model.js")(sequelize, Sequelize);
db.transaction = require("./transaction.model.js")(sequelize, Sequelize);

db.user = require("./user.model.js")(sequelize, Sequelize);

db.verificationCode = require("./verificationCode.model.js")(
  sequelize,
  Sequelize
);

db.image = require("./image.model.js")(sequelize, Sequelize);

db.customerGroup = require("./customerGroup.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);

db.vendor = require("./vendor.model.js")(sequelize, Sequelize);
db.paymentTerm = require("./paymentTerms.model.js")(sequelize, Sequelize);
db.taxValues = require("./taxValues.model.js")(sequelize, Sequelize);
db.warehouse = require("./warehouse.model.js")(sequelize, Sequelize);

module.exports = db;
