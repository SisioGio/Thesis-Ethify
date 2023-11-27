import React, { useEffect, useState } from "react";

import VendorSummary from "./paymentVendorSummary";

import Web3Payment from "../web3/web3Payment";
function PaymentSummary({ invoices, getPurchaseInvoices }) {
  const getSum = () => {
    let output = invoices.reduce(
      (total, obj) => parseFloat(total) + parseFloat(obj.totalAmount),
      0
    );
    return output;
  };

  const invoicesByVendor = invoices.reduce((acc, invoice) => {
    const vendorId = invoice.vendor.id;
    if (!acc[vendorId]) {
      acc[vendorId] = [];
    }
    acc[vendorId].push(invoice);

    return acc;
  }, {});

  return (
    <div className="p-3  payment-summary">
      <h1 className="">Payment Batch</h1>

      <Web3Payment
        getSum={getSum}
        invoices={invoices}
        getPurchaseInvoices={getPurchaseInvoices}
      />
      <div className="d-flex justify-content-between py-3">
        <h5>Number of invoices : {invoices.length}</h5>
        <h5>Total Amount to be paid : {getSum().toFixed(2)}</h5>
      </div>
      <div className="py-3">
        {invoices.length > 0 && <h3>Batch Details</h3>}

        {Object.entries(invoicesByVendor).map(([vendor, invoices]) => (
          <VendorSummary
            key={vendor}
            vendor={invoices[0].vendor}
            invoices={invoices}
          />
        ))}
      </div>
    </div>
  );
}

export default PaymentSummary;
