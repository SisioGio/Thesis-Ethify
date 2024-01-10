const db = require("../models");
const Invoice = db.invoice;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
// createInvoice.js
const AWS = require("aws-sdk");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const randomstring = require("randomstring");
const axios = require("axios");
const dotenv = require("dotenv");

// const pdf = require("pdf-parse");
const request = require("request");
const PDFParser = require("pdf2json");
dotenv.config();

async function sendRequestToSquinvoice(squinvoiceUrl) {
  let response;
  try {
    response = await axios.get(squinvoiceUrl);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(`Couldn't fetch data from Squinvoice ${err.message}`);
  }
}

async function getSuggestedAccountingLine(invoiceLines, invoiceId, output) {
  for (let i = 0; i < invoiceLines.length; i++) {
    // Initialize suggested transactions that must be sent to the client
    var suggestedProductTransactions = [];
    var invoiceLine = invoiceLines[i];
    // Check for existing warehouse (incoming products/services) in the database
    var warehouseObj = await db.warehouse.findOne({
      where: {
        externalId: invoiceLine.articleCode,
      },
    });
    // If product/service is found, retrieving previously posted transactions
    if (warehouseObj) {
      var previousTransactions = await db.transaction.findAll({
        where: { warehouseId: warehouseObj.id },
        include: db.warehouse,
      });
      // Group transactions by invoice,
      //  this grouping is needed otherwise the function would retrieve all the transactions
      // of all invoices with the same warehouse object id
      var groupedInvoideSuggestedTransactions = groupBy(
        previousTransactions,
        "invoiceId"
      );
      // Get object keys to see how many invoices were posted with this product
      var suggestedTransactionsKeys = Object.keys(
        groupedInvoideSuggestedTransactions
      );
      // If no invoices were found then the output array is empty
      if (suggestedTransactionsKeys.length === 0) {
        suggestedProductTransactions = [];
      } else {
        // Get transactions related to last booking
        suggestedProductTransactions =
          groupedInvoideSuggestedTransactions[
            suggestedTransactionsKeys[suggestedTransactionsKeys.length - 1]
          ];
        for (let i = 0; i < suggestedProductTransactions.length; i++) {
          let transaction = suggestedProductTransactions[i];
          // Calculate new netAmount
          suggestedProductTransactions[i].netAmount = getProportionatedAmount(
            transaction.netAmount,
            transaction.totalLineNetAmount,
            invoiceLine.netAmount
          );
          // Calculate new taxAmount
          suggestedProductTransactions[i].taxAmount = getProportionatedAmount(
            transaction.taxAmount,
            transaction.totalLineTaxAmount,
            invoiceLine.taxAmount
          );
          //Calculate new totalAmount
          suggestedProductTransactions[i].totalAmount = getProportionatedAmount(
            transaction.totalAmount,
            transaction.totalLineAmount,
            invoiceLine.totalAmount
          );
        }
        // Attached suggested transactions to the response body
        output.invoiceLines[i].suggestedTransactions =
          suggestedProductTransactions;
        output.invoiceLines[i].postedTransactions =
          await db.transaction.findAll({
            where: { invoiceId: invoiceId, warehouseId: warehouseObj.id },
            include: db.warehouse,
          });
      }
    }

    return output;
  }
}
//  Retrieve Squinvoice data
exports.getSquinvoiceData = async (req, res) => {
  try {
    // Get query parameters
    const invoiceUrl = req.query.invoiceUrl;
    const invoiceId = req.query.invoiceId;
    // Validate incoming request
    if (!invoiceUrl) {
      return res.status(400).send({ message: "Missing paramter 'invoiceUrl'" });
    }
    if (!invoiceId) {
      return res.status(400).send({ message: "Missing paramter 'invoiceId'" });
    }

    // Make a GET request using the Squinvoice link (invoiceUrl)
    let response = await sendRequestToSquinvoice(invoiceUrl);
    let output = response.data;
    // Retrieve invoice lines from response body
    var invoiceLines = response.data.invoiceLines;
    // Check for previously posted transactions and calculate new amounts
    output = await getSuggestedAccountingLine(invoiceLines, invoiceId, output);

    return res.send(output);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Squinvoice data",
    });
  }
};

const getProportionatedAmount = (x, y, z) => {
  return (parseFloat(x) / parseFloat(y)) * parseFloat(z);
};
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1",
});
const s3 = new AWS.S3();

const saveFileToS3 = async (file) => {
  let fileLocation;

  const randomName = randomstring.generate({
    length: 30,
  });

  const params = {
    Bucket: "ethify",
    Key: `${randomName}${".pdf"}`,
    Body: file,
    ContentType: "application/pdf",
  };

  try {
    let res = await s3.upload(params).promise();
    console.log("Saved succesfully!");
    console.log(res.Location);
    return res.Location;
  } catch (err) {
    console.log("Error while saving to S3");
    console.log(err);
  }
};

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(30, y).lineTo(550, y).stroke();
}

const InvoiceVendorHeader = (doc, vendor) => {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(vendor.name, 200, 55, { align: "right" })
    .fontSize(10)
    .text(vendor.vatNo, 200, 85, { align: "right" })
    .text(vendor.address.street + " " + vendor.address.streetNo, 200, 105, {
      align: "right",
    })
    .text(
      vendor.address.city +
        ", " +
        vendor.address.postcode +
        ", " +
        vendor.address.country,
      200,
      125,
      { align: "right" }
    )
    .moveDown();
  generateHr(doc, 150);
};

const InvoiceCustomerHeader = (doc, customer) => {
  doc
    .font("Helvetica")
    .text(customer.name, 300, 160)
    .text(customer.vatNo, 300, 180)
    .text(
      customer.address.street +
        " " +
        customer.address.streetNo +
        ", " +
        customer.address.city +
        ", " +
        customer.address.postcode +
        ", " +
        customer.address.country,
      300,
      200
    )

    .moveDown();
};

const InvoiceLineItemHeader = (doc) => {
  // Invoice line items header
  doc.font("Helvetica-Bold");
  doc.fontSize(10);

  InvoiceLineItem(doc, 250, [
    "#",
    "Order",
    "Description",
    "Price",
    "Qty",
    "Net",
    "Tax",
    "Total",
  ]);
};

const InvoiceLineItem = (doc, y, line) => {
  doc
    .fontSize(10)
    .text(line[0], 30, y)
    .text(line[1], 60, y)
    .text(line[2], 100, y)
    .text(line[3], 200, y)
    .text(line[4], 270, y)
    .text(line[5], 350, y)
    .text(line[6], 430, y)
    .text(line[7], 500, y);
};
const InvoiceDataHeader = (doc, key, invoiceDetails) => {
  doc
    .font("Helvetica-Bold")
    .text(`Invoice Number: ${key}`, 30, 160)
    .text(`Invoice Date: ${invoiceDetails.invoiceDate}`, 30, 180)
    .text(`Invoice Due Date: ${invoiceDetails.invoiceDueDate}`, 30, 200);
};

const InvoiceLineItems = (doc, items, position) => {
  j = 0;
  items.forEach((item, index) => {
    position = position + (index + 1) * 30;
    generateHr(doc, position + 20);
    doc.fontSize(10);
    j += 1;
    InvoiceLineItem(doc, position, [
      j,
      item.order,
      item.description,
      item.price.toFixed(2),
      item.unitOfMeasure + " " + item.quantity,
      parseFloat(item.netAmount).toFixed(2),
      "[" + item.taxCode.code + "] " + item.vatAmount.toFixed(2),
      item.totalAmount.toFixed(2),
    ]);
  });

  return position;
};
const generateInvoiceData = async (orders, customer, invoice, t) => {
  let output = {
    invoiceDate: new Date().toISOString().slice(0, 10),
    invoiceDueDate: calculateDueDate(customer).toISOString().slice(0, 10),
    totalAmount: 0,
    vatAmount: 0,
    netAmount: 0,
    items: [],
    taxCodes: [],
  };
  for (i = 0; i < orders.length; i++) {
    var orderId = orders[i].id;
    for (j = 0; j < orders[i].orderProducts.length; j++) {
      var item = orders[i].orderProducts[j];
      console.log("Customer group id " + customer.customerGroupId);
      var taxValueIndex = item.product.taxCode.taxValues.findIndex(
        (taxValue) => taxValue.customerGroupId == customer.customerGroupId
      );

      var taxCodeValue = item.product.taxCode.taxValues[taxValueIndex];
      var taxCode = item.product.taxCode;
      var netAmount = (
        parseFloat(item.quantity) * parseFloat(item.product.price)
      ).toFixed(2);
      var vatAmount = (
        (netAmount * parseFloat(taxCodeValue.percentage)) /
        100
      ).toFixed(2);
      var totalAmount = (parseFloat(netAmount) + parseFloat(vatAmount)).toFixed(
        2
      );
      output.totalAmount += parseFloat(totalAmount);
      output.netAmount += parseFloat(netAmount);
      output.vatAmount += parseFloat(vatAmount);

      let taxCodeIndex = output.taxCodes.findIndex(
        (taxCode) => taxCode.id === taxCode.id
      );
      if (taxCodeIndex > -1) {
        output.taxCodes[taxCodeIndex].amount += parseFloat(vatAmount);
        output.taxCodes[taxCodeIndex].taxAmount += parseFloat(vatAmount);
        output.taxCodes[taxCodeIndex].netAmount += parseFloat(netAmount);
      } else {
        output.taxCodes.push({
          id: taxCode.id,
          code: taxCode.code,
          amount: parseFloat(vatAmount),
          percentage: taxCodeValue.percentage,
          taxDescription: taxCode.code,
          taxPercentage: taxCodeValue.percentage,
          taxAmount: parseFloat(vatAmount),
          netAmount: parseFloat(netAmount),
        });
      }
      await db.invoiceLine.create(
        {
          netAmount: parseFloat(netAmount),
          taxAmount: parseFloat(vatAmount),
          totalAmount: parseFloat(totalAmount),
          invoiceId: invoice.id,
          taxValueId: taxCodeValue.id,
          orderProductId: item.id,
        },
        { transaction: t }
      );
      // Add item to array
      output.items.push({
        index: j,
        order: orderId,
        articleCode: item.product.id,
        description: item.product.name,
        purchaseOrder: orderId,
        deliveryNote: "",
        unitOfMeasure: item.product.unitOfMeasure,
        quantity: item.quantity,

        unitPrice: parseFloat(item.product.price),
        taxPercentage: taxCodeValue.percentage,
        taxAmount: parseFloat(vatAmount),
        totalAmount: parseFloat(totalAmount),
        price: parseFloat(item.product.price),

        netAmount: parseFloat(netAmount),
        vatAmount: parseFloat(vatAmount),
        totalAmount: parseFloat(totalAmount),
        taxCode: {
          code: taxCode.code,
          percentage: taxCodeValue.percentage,
        },
      });
    }
  }

  return output;
};

const generateFooter = async (doc, squinvoiceUrl) => {
  doc
    .font("Helvetica-Bold")
    .text(`Squinvoice URL : ${squinvoiceUrl}`, 30, doc.page.height - 70);
};
const calculateDueDate = (customer) => {
  var today = new Date();

  var dueDate = new Date();

  if (customer.paymentTerm.type === "EOM") {
    var lastDayOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    dueDate.setDate(
      lastDayOfCurrentMonth.getDate() + customer.paymentTerm.days
    );
  } else {
    dueDate.setDate(today.getDate() + customer.paymentTerm.days);
  }
  return dueDate;
};

const sendDataToSquinvoice = async (data) => {
  try {
    let res = await axios.post("http://127.0.0.1:8080/api/invoice", data);
    let resData = res.data;

    return resData.InvoiceURL;
  } catch (err) {
    console.log(err.data);
  }
};

// Create and Save a new invoice
exports.create = async (req, res) => {
  // Save invoice in the database
  try {
    let invoices = [];
    const result = await sequelize.transaction(async (t) => {
      // Input is a list of orders
      const body = req.body.orders;

      // Group orders by customerId
      var result = body.reduce((x, y) => {
        (x[y.customerId] = x[y.customerId] || []).push(y);
        return x;
      }, {});

      // For each customer
      for (const [key, value] of Object.entries(result)) {
        // Set document path
        let customer = value[0].customer;
        let vendor = value[0].vendor;
        var path = `/home/alessio/Documents/Projects/Thesis/server/invoices/Invoice ${customer.name}.pdf`;

        let orders = [...new Set(value.map((order) => order.id))];
        // Get customer object from database
        let customerObj = await db.customer.findOne({
          where: { vendorId: vendor.id, referenceCustomerCompanyId: key },
          include: db.paymentTerm,
        });

        let invoice = await db.invoice.create({
          paid: false,
          dueDate: "2023-04-05",
          documentDate: "2023-04-05",
          totalAmount: 0,
          taxAmount: 0,
          netAmount: 0,
          customerId: customer.id,
          vendorId: vendor.id,
          url: "",
          status: "New",
        });
        let invoiceDetails = await generateInvoiceData(
          value,
          customerObj,
          invoice,
          t
        );

        invoice.netAmount = invoiceDetails.netAmount;
        invoice.taxAmount = invoiceDetails.vatAmount;
        invoice.totalAmount = invoiceDetails.totalAmount;
        invoice.dueDate = invoiceDetails.invoiceDueDate;
        invoice.documentDate = invoiceDetails.invoiceDate;

        await invoice.save({ transaction: t });

        for (let i = 0; i < orders.length; i++) {
          var orderObj = await db.order.findByPk(orders[i]);
          orderObj.invoiceId = invoice.id;
          orderObj.status = "Invoiced";
          await orderObj.save({ transaction: t });
        }

        let customerCompany = await customerObj.getReferenceCustomerCompany();
        let customerAddress = await customerCompany.getAddress();

        let squinvoiceInvoiceUrl = await sendDataToSquinvoice({
          vendorName: vendor.name,
          vendorIdentificator: vendor.vatNo,
          type: "INVOICE",
          documentNo: invoice.id,
          documentDate: invoice.documentDate,
          netAmount: invoice.netAmount,
          taxAmount: invoice.taxAmount,
          totalAmount: invoice.totalAmount,
          freightCharge: 0,
          priceRounding: 0,
          purchaseOrder: "",
          deliveryNote: "",
          shippingAddress: {
            country: customerAddress.country,
            city: customerAddress.city,
            street: customerAddress.street,
            streetNo: customerAddress.streetNo,
            postcode: customerAddress.postcode,
          },
          vendorAddress: {
            country: vendor.address.country,
            city: vendor.address.city,
            street: vendor.address.street,
            streetNo: vendor.address.streetNo,
            postcode: vendor.address.postcode,
          },

          lineItems: invoiceDetails.items,
          taxLines: invoiceDetails.taxCodes,
        });
        invoice.squinvoiceUrl = squinvoiceInvoiceUrl;

        console.log(squinvoiceInvoiceUrl);
        // Create document vendor header
        let doc = new PDFDocument({ margin: 50 });

        InvoiceVendorHeader(doc, vendor);

        InvoiceCustomerHeader(doc, customer);

        InvoiceDataHeader(doc, key, invoiceDetails);

        generateHr(doc, 220);

        InvoiceLineItemHeader(doc);
        // Invoice line items
        let i;
        let j;

        doc.font("Helvetica");
        // return res.send(invoiceDetails);
        var position = 250;

        position = InvoiceLineItems(doc, invoiceDetails.items, position);

        console.log(position);
        // Net Amount
        doc.font("Helvetica-Bold");
        position = position + 50;
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total Net",
          "€ " + parseFloat(invoiceDetails.netAmount).toFixed(2),
        ]);

        invoiceDetails.taxCodes.forEach((taxCode) => {
          position = position + 30;
          doc.font("Helvetica");
          InvoiceLineItem(doc, position, [
            "",
            "",
            "",
            "",
            "",
            "",
            "VAT [" + taxCode.code + "]",
            "€ " + parseFloat(taxCode.amount).toFixed(2),
          ]);
        });
        doc.font("Helvetica-Bold");
        position = position + 30;
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total Vat",
          "€ " + parseFloat(invoiceDetails.vatAmount).toFixed(2),
        ]);

        position = position + 30;
        doc.font("Helvetica-Bold");
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total",
          "€ " + parseFloat(invoiceDetails.totalAmount).toFixed(2),
        ]);
        generateFooter(doc, squinvoiceInvoiceUrl);
        doc.end();
        doc.pipe(fs.createWriteStream(path));

        let invoiceUrl = await saveFileToS3(doc);
        invoice.url = invoiceUrl;
        await invoice.save({ transaction: t });
      }
      return res.send(await result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the invoice.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Invoice.findAll({
    include: [
      { model: db.company, as: "vendor", include: db.address },

      {
        model: db.invoiceLine,
        include: [
          { model: db.orderProduct, include: db.product },
          { model: db.taxValues },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    });
};

exports.getSalesInvoices = (req, res) => {
  const vendorId = req.params.vendorId;

  Invoice.findAll({
    where: { vendorId: vendorId },
    include: [{ model: db.company, as: "customer" }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    });
};

exports.getPurchaseInvoices = async (req, res) => {
  const customerId = req.params.customerId;
  data = [];
  try {
    const result = await sequelize.transaction(async (t) => {
      data = await Invoice.findAll(
        {
          where: { customerId: customerId },
          include: [
            { model: db.company, as: "vendor" },
            {
              model: db.company,
              as: "customer",
            },
          ],
        },
        { transaction: t }
      );
    });

    return res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving invoices.",
    });
  }
};

exports.getPurchaseInvoiceDetails = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  data = [];
  try {
    const result = await sequelize.transaction(async (t) => {
      data = await Invoice.findByPk(
        invoiceId,
        {
          include: [
            { model: db.invoiceLine },
            { model: db.company, as: "vendor", include: db.address },
            {
              model: db.company,
              as: "customer",
              include: [
                db.account,
                db.costCenter,
                db.businessLine,
                { model: db.taxCode, include: db.taxValues },
                db.factory,
              ],
            },
          ],
        },
        { transaction: t }
      );
    });

    return res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving invoices.",
    });
  }
};

exports.getPurchaseInvoicesIds = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    let invoices = await Invoice.findAll({
      where: { customerId: customerId },
      attributes: ["id"],
    });
    var output = invoices.map((idObj) => {
      return idObj.id;
    });
    return res.send(output);
  } catch (err) {
    console.log(err);
  }
};
var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// Update a invoice by the id in the request form
exports.update = async (req, res) => {
  let invoice = await db.invoice.findByPk(10);
  if (invoice.status === "New") {
    invoice.status = "Saved";
  } else {
    invoice.status = "New";
  }

  await invoice.save();
  return res.send();
  // const id = req.body.id;
  // try {
  //   let invoice = await Invoice.update(req.body, { where: { id: id } });
  //   return res.send(await invoice.findByPk(id));
  // } catch (err) {
  //   res.status(500).send({
  //     message: "Error updating invoice with id=" + id,
  //   });
  // }
};
// Delete a invoice with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Invoice.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "invoice was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete invoice with id=${id}. Maybe invoice was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete invoice with id=" + id,
      });
    });
};

// Delete all invoice from the database.
exports.deleteAll = (req, res) => {
  Invoice.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} invoice were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all invoice.",
      });
    });
};
