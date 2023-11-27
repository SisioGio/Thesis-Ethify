import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { DispatchUserContexts, ShowUserContexts } from "../../App";

function ApWorkflow() {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const navigate = useNavigate();
  const UserContext = ShowUserContexts();
  const getPurchaseInvoices = async () => {
    try {
      var res = await apiService.getPurchaseInvoices();
      setPurchaseInvoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (id) => {
    navigate(`/ap-workflow/${id}`);
  };

  useEffect(() => {
    getPurchaseInvoices();
  }, [UserContext]);

  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Vendor Name</th>
          <th scope="col">Vendor VAT no</th>

          <th scope="col">Net Amount</th>
          <th scope="col">Vat Amount</th>
          <th scope="col">Total Amount</th>
          <th scope="col">Status</th>
          <th scope="col">Created At</th>
        </tr>
      </thead>
      <tbody>
        {purchaseInvoices.map((invoice, i) => {
          return (
            <tr onClick={() => handleClick(invoice.id)}>
              <td>{invoice.vendor.name}</td>
              <td>{invoice.vendor.vatNo}</td>

              <td>{invoice.netAmount}</td>
              <td>{invoice.taxAmount}</td>
              <td>{invoice.totalAmount}</td>
              <td>
                <span
                  className={`${
                    invoice.status === "Saved"
                      ? "badge badge-pill badge-success"
                      : "badge badge-pill badge-danger"
                  }`}
                >
                  {invoice.status}
                </span>{" "}
              </td>
              <td>{invoice.createdAt}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ApWorkflow;
