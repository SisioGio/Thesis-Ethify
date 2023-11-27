const express = require("express");
const cors = require("cors");
const generateSitemap = require("./sitemap-generator");
const cron = require("node-cron");
const {
  sequelize,
  stock,
  taxCode,
  customerGroup,
  taxValues,
} = require("./models");
const app = express();
var bcrypt = require("bcryptjs");
var multipart = require("connect-multiparty");
var corsOptions = {
  origin: "http://localhost:3307",
};
// cron.schedule("*/2 * * * * *", function () {
//   console.log("---------------------");
//   console.log("running a task every 2 seconds");
// });
app.use(express.static("./../client/public/"));
app.use(express.static("./../client/public/prod_images/"));
app.use(cors(corsOptions));
app.use(
  multipart({
    uploadDir:
      "/home/alessio/Documents/TIN/TIN TASK 10/client/public/prod_images",
  })
);
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./../server/models");
const { cart } = require("./../server/models");
const { DB } = require("./config/db.config");

// Company - Address

db.company.hasOne(db.address, { onDelete: "RESTRICT" });
db.address.belongsTo(db.company, { onDelete: "RESTRICT" });
// Company - Customer
db.customer.hasOne(db.address, { onDelete: "RESTRICT" });
db.address.belongsTo(db.customer, { onDelete: "RESTRICT" });
// Company - Vendor
db.vendor.hasOne(db.address, { onDelete: "RESTRICT" });
db.address.belongsTo(db.vendor, { onDelete: "RESTRICT" });

// Company - Owner
db.user.hasMany(db.company, { onDelete: "RESTRICT" });
db.company.belongsTo(db.user, { onDelete: "RESTRICT" });

// user - refreshToken
db.user.hasMany(db.refreshToken, { onDelete: "RESTRICT" });
db.refreshToken.belongsTo(db.user, { onDelete: "RESTRICT" });

// Customer - Invoice
db.company.hasMany(db.invoice, {
  onDelete: "RESTRICT",
  as: "purchaseInvoices",
  foreignKey: "customerId",
});
db.invoice.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "customer",
  foreignKey: "customerId",
});
// Vendor - Invoice
db.company.hasMany(db.invoice, {
  onDelete: "RESTRICT",
  as: "salesInvoices",
  foreignKey: "vendorId",
});
db.invoice.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "vendor",
  foreignKey: "vendorId",
});

// Invoice - Payment
db.payment.hasMany(db.invoice, { onDelete: "RESTRICT" });
db.invoice.belongsTo(db.payment, { onDelete: "RESTRICT" });

// Customer - Order
db.company.hasMany(db.order, {
  onDelete: "RESTRICT",
  as: "purchaseOrders",
  foreignKey: "customerId",
});
db.order.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "customer",
  foreignKey: "customerId",
});

// Vendor- Order
db.company.hasMany(db.order, {
  onDelete: "RESTRICT",
  as: "salesOrder",
  foreignKey: "customerId",
});
db.order.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "vendor",
  foreignKey: "vendorId",
});

// Comapny - Product
db.company.hasMany(db.product, { onDelete: "RESTRICT" });
db.product.belongsTo(db.company, { onDelete: "RESTRICT" });

// Product - Order many to many

db.product.belongsToMany(db.order, { through: db.orderProduct });
db.order.belongsToMany(db.product, { through: db.orderProduct });

db.product.hasMany(db.orderProduct);
db.orderProduct.belongsTo(db.product);

db.order.hasMany(db.orderProduct);
db.orderProduct.belongsTo(db.order);

// Invoice - Order
db.invoice.hasMany(db.order, { onDelete: "RESTRICT" });
db.order.belongsTo(db.invoice, { onDelete: "RESTRICT" });

// Invoice - InvoiceLine
db.invoice.hasMany(db.invoiceLine, { onDelete: "RESTRICT" });
db.invoiceLine.belongsTo(db.invoice, { onDelete: "RESTRICT" });

// Invoice Line - TaxValue
db.taxValues.hasMany(db.invoiceLine, { onDelete: "RESTRICT" });
db.invoiceLine.belongsTo(db.taxValues, { onDelete: "RESTRICT" });
// Invoice Line - OrderProduct
db.orderProduct.hasOne(db.invoiceLine, { onDelete: "RESTRICT" });
db.invoiceLine.belongsTo(db.orderProduct, { onDelete: "RESTRICT" });

// Product - Image
db.product.hasMany(db.image, { onDelete: "RESTRICT" });
db.image.belongsTo(db.product, { onDelete: "RESTRICT" });

// Company - Cost Center
db.company.hasMany(db.costCenter, { onDelete: "RESTRICT" });
db.costCenter.belongsTo(db.company, { onDelete: "RESTRICT" });

// Company - Vendor
db.company.hasMany(db.customer, {
  onDelete: "RESTRICT",
  as: "vendor",
  foreignKey: "vendorId",
});
db.customer.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "vendor",
  foreignKey: "vendorId",
});

// Company - Customer
db.company.hasMany(db.customer, {
  onDelete: "RESTRICT",
  as: "referenceCustomerCompany",
  foreignKey: "referenceCustomerCompanyId",
});
db.customer.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "referenceCustomerCompany",
  foreignKey: "referenceCustomerCompanyId",
});

// Company - Vendor
db.company.hasMany(db.vendor, {
  onDelete: "RESTRICT",
  as: "vendors",
  foreignKey: "customerId",
});
db.vendor.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "customer",
  foreignKey: "customerId",
});

// Company - Vendor
db.company.hasMany(db.vendor, {
  onDelete: "RESTRICT",
  as: "referenceVendorCompany",
  foreignKey: "referenceVendorCompanyId",
});
db.vendor.belongsTo(db.company, {
  onDelete: "RESTRICT",
  as: "referenceVendorCompany",
  foreignKey: "referenceVendorCompanyId",
});

// Company - Tax Code
db.company.hasMany(db.taxCode, { onDelete: "RESTRICT" });
db.taxCode.belongsTo(db.company, { onDelete: "RESTRICT" });

// Company - customerGroup
db.company.hasMany(db.customerGroup, { onDelete: "RESTRICT" });
db.customerGroup.belongsTo(db.company, { onDelete: "RESTRICT" });

// Customer - CustomerGroup
db.customerGroup.hasMany(db.customer, { onDelete: "RESTRICT" });
db.customer.belongsTo(db.customerGroup, { onDelete: "RESTRICT" });

// Company - TaxValues
db.company.hasMany(db.taxValues, { onDelete: "RESTRICT" });
db.taxValues.belongsTo(db.company, { onDelete: "RESTRICT" });

// TaxCode - CustomerGroup
taxCode.belongsToMany(customerGroup, { through: taxValues });
customerGroup.belongsToMany(taxCode, { through: taxValues });
taxCode.hasMany(taxValues);
taxValues.belongsTo(taxCode);
customerGroup.hasMany(taxValues);
taxValues.belongsTo(customerGroup);

// Company - Factory
db.company.hasMany(db.factory, { onDelete: "RESTRICT" });
db.factory.belongsTo(db.company, { onDelete: "RESTRICT" });

// Company - BL
db.company.hasMany(db.businessLine, { onDelete: "RESTRICT" });
db.businessLine.belongsTo(db.company, { onDelete: "RESTRICT" });

// Company - Account
db.company.hasMany(db.account, { onDelete: "RESTRICT" });
db.account.belongsTo(db.company, { onDelete: "RESTRICT" });

// Customer - Payment Terms
db.customer.hasOne(db.paymentTerm, { onDelete: "RESTRICT" });
db.paymentTerm.belongsTo(db.customer, { onDelete: "RESTRICT" });
// Vendor - Payment Terms
db.vendor.hasOne(db.paymentTerm, { onDelete: "RESTRICT" });
db.paymentTerm.belongsTo(db.vendor, { onDelete: "RESTRICT" });

// Customer - Payment Terms
db.company.hasMany(db.paymentTerm, { onDelete: "RESTRICT" });
db.paymentTerm.belongsTo(db.company, { onDelete: "RESTRICT" });

// Account - transaction
db.account.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.account, { onDelete: "RESTRICT" });

// Company - transaction
db.company.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.company, { onDelete: "RESTRICT" });

// BusinessLine - transaction
db.businessLine.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.businessLine, { onDelete: "RESTRICT" });

// Factory - transaction
db.factory.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.factory, { onDelete: "RESTRICT" });

// CostCenter - transaction
db.costCenter.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.costCenter, { onDelete: "RESTRICT" });

// TaxCode - transaction
db.taxValues.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.taxValues, { onDelete: "RESTRICT" });

// InvoiceLine - transaction
db.invoiceLine.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.invoiceLine, { onDelete: "RESTRICT" });
// Product - transaction
db.warehouse.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.warehouse, { onDelete: "RESTRICT" });

// Invoice - transaction
db.invoice.hasMany(db.transaction, { onDelete: "RESTRICT" });
db.transaction.belongsTo(db.invoice, { onDelete: "RESTRICT" });

// Product - tax code
db.taxCode.hasMany(db.product, { onDelete: "RESTRICT" });
db.product.belongsTo(db.taxCode, { onDelete: "RESTRICT" });

db.sequelize
  .authenticate({ force: true })
  .then(async () => {
    var [user, createdAt] = await db.user.findOrCreate({
      where: {
        name: "alessio",
        surname: "giovannini",
        email: "alessiogiovannini23@gmail.com",
        password:
          "$2a$10$/RFOL16QYdauWjFKPiUwFeLDP5fZM6bvsagnKLg8aOBp8RO2arX2G",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODA3OTQzNzksImV4cCI6MTY4MDg5NDM3OX0.D7ysjTzW6smBfIFLagCAjVwH_PVvKM6FxbjogsmAdq8",
      },
    });

    var [company1, createdAt] = await db.company.findOrCreate({
      where: {
        name: "Company 1",
        vatNo: "IT12345678",
        email: "alessiogiovannini@hotmail.it",
        walletAddress: "Zawiszy 12",
        userId: user.id,
      },
    });
    var [company2, createdAt] = await db.company.findOrCreate({
      where: {
        name: "Company 2",
        vatNo: "PL12345678",
        email: "alessiogiovannini@hotmail.it",
        walletAddress: "Zawiszy 12",
        userId: user.id,
      },
    });

    var [address1, createdAt] = await db.address.findOrCreate({
      where: {
        country: "Italy",
        region: "Poland",
        city: "Warsaw",
        street: "Zawiszy",
        streetNo: "12",
        postcode: "01-167",
        companyId: company1.id,
      },
    });
    var [address2, createdAt] = await db.address.findOrCreate({
      where: {
        country: "Poland",
        region: "Warsaw",
        city: "Warsaw",
        street: "Zawiszy",
        streetNo: "12",
        postcode: "01-167",
        companyId: company2.id,
      },
    });

    var [vendor, createdAt] = await db.vendor.findOrCreate({
      where: {
        customerId: company1.id,
        referenceVendorCompanyId: company2.id,
      },
    });

    var [customer, createdAt] = await db.customer.findOrCreate({
      where: {
        vendorId: company2.id,
        referenceCustomerCompanyId: company1.id,
      },
    });

    var [paymentTerm, createdAt] = await db.paymentTerm.findOrCreate({
      where: {
        type: "NET",
        days: 60,
        customerId: customer.id,
        vendorId: vendor.id,
      },
    });

    var [taxCode, createdAt] = await db.taxCode.findOrCreate({
      where: {
        code: "1D",
        name: "Sales of goods",
        companyId: company2.id,
      },
    });
    var [cGroup1, createdAt] = await db.customerGroup.findOrCreate({
      where: {
        code: "LOCAL",
        name: "LOCAL",
        companyId: company2.id,
      },
    });
    var [cGroup2, createdAt] = await db.customerGroup.findOrCreate({
      where: {
        code: "UE",
        name: "UE",
        companyId: company2.id,
      },
    });
    var [taxValue1, createdAt] = await db.taxValues.findOrCreate({
      where: {
        percentage: 23,
        name: "Sales of goods (LOCAL)",
        companyId: company2.id,
        taxCodeId: taxCode.id,
        customerGroupId: cGroup1.id,
      },
    });
    var [taxValue2, createdAt] = await db.taxValues.findOrCreate({
      where: {
        percentage: 0,
        name: "Sales of goods (UE)",
        companyId: company2.id,
        taxCodeId: taxCode.id,
        customerGroupId: cGroup2.id,
      },
    });
    customer.customerGroupId = cGroup1.id;
    await customer.save();

    var [product, createdAt] = await db.product.findOrCreate({
      where: {
        name: "Product 1",
        description: "dfsadfasdfasd",
        price: 100.0,
        cost: 40.0,
        quantity: 100,
        type: "Product",
        unitOfMeasure: "KG",
        companyId: company2.id,
        taxCodeId: taxCode.id,
      },
    });

    var [acc1, createdAt] = await db.account.findOrCreate({
      where: {
        code: "10002000",
        name: "Purchase of goods",
        isNode: false,
        type: "Asset",
        balance: 0.0,
        companyId: company1.id,
      },
    });
    var [acc2, createdAt] = await db.account.findOrCreate({
      where: {
        code: "10003000",
        name: "Purchase of goods for productions",
        isNode: false,
        type: "Asset",
        balance: 0.0,
        companyId: company1.id,
      },
    });
    var [acc3, createdAt] = await db.account.findOrCreate({
      where: {
        code: "10004000",
        name: "Purchase of machines",
        isNode: false,
        type: "Asset",
        balance: 0.0,
        companyId: company1.id,
      },
    });

    var [cc1, createdAt] = await db.costCenter.findOrCreate({
      where: {
        code: "100190",
        name: "Tools",
        companyId: company1.id,
      },
    });
    var [cc2, createdAt] = await db.costCenter.findOrCreate({
      where: {
        code: "100200",
        name: "Components",
        companyId: company1.id,
      },
    });

    var [bl1, createdAt] = await db.businessLine.findOrCreate({
      where: {
        code: "BL18",
        name: "BL18",
        companyId: company1.id,
      },
    });
    var [bl2, createdAt] = await db.businessLine.findOrCreate({
      where: {
        code: "BL20",
        name: "BL20",
        companyId: company1.id,
      },
    });

    var [factory1, createdAt] = await db.factory.findOrCreate({
      where: {
        code: "LMN",
        name: "Limena",
        companyId: company1.id,
      },
    });
    var [factory2, createdAt] = await db.factory.findOrCreate({
      where: {
        code: "BGT",
        name: "Brugherio",
        companyId: company1.id,
      },
    });

    var [taxCode2, createdAt] = await db.taxCode.findOrCreate({
      where: {
        code: "1D",
        name: "Purchase of goods",
        companyId: company1.id,
      },
    });
    var [cGroup3, createdAt] = await db.customerGroup.findOrCreate({
      where: {
        code: "LOCAL",
        name: "LOCAL",
        companyId: company1.id,
      },
    });
    var [cGroup4, createdAt] = await db.customerGroup.findOrCreate({
      where: {
        code: "UE",
        name: "UE",
        companyId: company1.id,
      },
    });
    var [taxValue3, createdAt] = await db.taxValues.findOrCreate({
      where: {
        percentage: 23,
        name: "Purchase of goods (LOCAL)",
        companyId: company1.id,
        taxCodeId: taxCode2.id,
        customerGroupId: cGroup3.id,
      },
    });
    var [taxValue2, createdAt] = await db.taxValues.findOrCreate({
      where: {
        percentage: 0,
        name: "Purchase of goods (UE)",
        companyId: company1.id,
        taxCodeId: taxCode2.id,
        customerGroupId: cGroup4.id,
      },
    });

    console.log("Sync completed");
  })
  .catch((err) => {
    console.log("Sync failed - " + err.message ? err.message : null);
  });
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});
require("./routes/account.routes")(app);
require("./routes/address.routes")(app);
require("./routes/businessLine.routes")(app);
require("./routes/company.routes")(app);
require("./routes/costCenter.routes")(app);
require("./routes/factory.routes")(app);
require("./routes/image.routes")(app);
require("./routes/order.routes")(app);
require("./routes/payment.routes")(app);
require("./routes/product.routes")(app);
require("./routes/taxCode.routes")(app);
require("./routes/transaction.routes")(app);
require("./routes/user.routes")(app);
require("./routes/invoice.routes")(app);
require("./routes/vendor.routes")(app);
require("./routes/customer.routes")(app);
require("./routes/customerGroup.routes")(app);
require("./routes/taxValues.routes")(app);
require("./routes/invoiceLine.routes")(app);
require("./routes/warehouse.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
