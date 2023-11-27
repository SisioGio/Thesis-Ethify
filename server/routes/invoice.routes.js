module.exports = (app) => {
  const invoice = require("../controllers/invoice.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new invoice
  router.post("/", invoice.create);

  // Update an invoice
  router.put("/", invoice.update);

  // Retrieve all invoice
  router.get("/", invoice.findAll);

  router.get("/sales/:vendorId", invoice.getSalesInvoices);
  router.get("/squinvoice/", invoice.getSquinvoiceData);

  // Retrieve purchase invoices with basic data
  router.get("/purchase/:customerId", invoice.getPurchaseInvoices);
  // Retrieve purchase invoice details
  router.get("/purchase/details/:invoiceId", invoice.getPurchaseInvoiceDetails);

  router.get("/purchase/ids/:customerId", invoice.getPurchaseInvoicesIds);
  // Delete an invoice with id
  router.delete("/:id", invoice.delete);

  // Delete all invoices
  router.delete("/", invoice.deleteAll);

  app.use("/api/invoice", router);
};
