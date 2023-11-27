import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchUserContexts, ShowUserContexts } from "../../App";
import OrderDetails from "./orderDetails";
import SalesOrderRow from "./salesOrdersRow";

function PurchaseInvoices() {
  const showUserContext = ShowUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [invoices, setInvoices] = useState([]);

  const getPurchaseInvoices = async () => {
    try {
      var res = await apiService.getPurchaseInvoices();

      setInvoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPurchaseInvoices();
  }, [showUserContext]);

  return (
    <div>
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Vendor ID</th>
              <th scope="col">Vendor Name</th>
              <th scope="col">Vendor VAT no</th>
              <th scope="col">Vendor Email</th>
              <th scope="col">Net Amount</th>
              <th scope="col">Vat Amount</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>

              <th scope="col">File</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => {
              return (
                <tr>
                  <th scope="row">{invoice.id}</th>
                  <td>{invoice.vendor.id}</td>
                  <td>{invoice.vendor.name}</td>
                  <td>{invoice.vendor.vatNo}</td>
                  <td>{invoice.vendor.email}</td>
                  <td>{invoice.netAmount}</td>
                  <td>{invoice.taxAmount}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.status}</td>
                  <td>{invoice.createdAt}</td>
                  <td>
                    {invoice.url && (
                      <a href={invoice.url} className="btn btn-outline-success">
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseInvoices;
