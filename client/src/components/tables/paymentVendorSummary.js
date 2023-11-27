import React, { useState } from "react";
import moment from "moment";
function VendorSummary({ vendor, invoices }) {
  const [expanded, setExpanded] = useState(false);

  const totalAmount = invoices.reduce(
    (total, invoice) => total + parseFloat(invoice.totalAmount),
    0
  );

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className=" p-3 payment-vendor">
      <div className="d-flex justify-content-between">
        <h5>
          {" "}
          <b>Vendor Name : </b>
          {vendor.name}
        </h5>
        <h5>
          <b>Wallet Address:</b> {vendor.walletAddress}
        </h5>
        <h5>
          <b>Amount to pay: </b>
          {totalAmount.toFixed(2)}
        </h5>
        <button onClick={toggleExpanded} className="btn btn-outline-info ">
          {expanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      <table
        class={`table table-striped my-4 vendor-payment-details ${
          expanded ? "details-expand" : "details-hidden"
        }`}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Document Date</th>
            <th scope="col">Due Date</th>
            <th scope="col">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <th scope="row">{invoice.id}</th>
              <td>{moment(invoice.createdAt).format("DD.MM.yyyy")}</td>
              <td>{moment(invoice.dueDate).format("DD.MM.yyyy")}</td>
              <td>{parseFloat(invoice.totalAmount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorSummary;
