import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchUserContexts, ShowUserContexts } from "../../App";
import OrderDetails from "./orderDetails";
import SalesOrderRow from "./salesOrdersRow";

function SalesInvoices() {
  const showUserContext = ShowUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [invoices, setInvoices] = useState([]);

  const getSalesInvoices = async () => {
    try {
      var res = await apiService.getSalesInvoices();

      setInvoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSalesInvoices();
  }, [showUserContext]);

  return (
    <div>
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer VAT no</th>
              <th scope="col">Customer Email</th>
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
                  <td>{invoice.customer.id}</td>
                  <td>{invoice.customer.name}</td>
                  <td>{invoice.customer.vatNo}</td>
                  <td>{invoice.customer.email}</td>
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

export default SalesInvoices;
