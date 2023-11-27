import React, { useEffect, useState } from "react";
import moment from "moment";
import { DispatchUserContexts, ShowCartContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/payments.css";

import PaymentSummary from "./paymentSummary";
function Payments() {
  const [invoices, setInvoices] = useState([]);
  const [invoicesCopy, setInvoicesCopy] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const userContext = ShowCartContexts();
  const filterData = () => {
    var filtered_data = JSON.parse(JSON.stringify(invoicesCopy));
    var itemValue;
    for (let key in filters) {
      filtered_data = filtered_data.filter((item) => {
        if ((key === "name") | (key === "vatNo")) {
          itemValue = item.vendor[key].toString().toLowerCase();
        } else {
          itemValue = item[key].toString().toLowerCase();
        }

        const filterValue = filters[key].toString().toLowerCase();
        const isMatch = itemValue.includes(filterValue);
        return isMatch;
      });
    }
    console.log(filtered_data);
    setInvoices(filtered_data);
  };

  const check = () => {
    console.log(filters);
  };
  const addFilterValue = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;

    setFilters((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  const getPurchaseInvoices = async () => {
    try {
      setSelectedInvoices([]);
      var res = await apiService.getPurchaseInvoices();
      setInvoices(res.data);
      setInvoicesCopy(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const dueInvoices = () => {
    return invoices.filter((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      let today = new Date();
      let nextDate = new Date(
        today.getTime() + threshold * 24 * 60 * 60 * 1000
      );
      let isDue = dueDate <= nextDate;
      return isDue;
    });
  };

  const invoiceIsDue = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    let today = new Date();
    let nextDate = new Date(today.getTime() + threshold * 24 * 60 * 60 * 1000);
    let isDue = dueDate <= nextDate;
    console.log(dueDate);
    return isDue;
  };
  const selectDueInvoices = () => {
    setSelectedInvoices(dueInvoices);
  };
  const handleInvoiceSelection = (id) => {
    let outputArray = JSON.parse(JSON.stringify(selectedInvoices));
    let invoiceIndex = outputArray.findIndex((invoice) => invoice.id === id);
    if (invoiceIndex > -1) {
      outputArray.splice(invoiceIndex, 1);
    } else {
      var invoiceObjIndex = invoices.findIndex((invoice) => invoice.id === id);

      outputArray.push(invoices[invoiceObjIndex]);
    }

    setSelectedInvoices(outputArray);
    console.log(outputArray);
  };
  useEffect(() => {
    getPurchaseInvoices();
    setFilters((prevState) => ({
      ...prevState,
      paid: false,
    }));
    filterData();
    console.log("State changed!");
  }, [userContext]);

  useEffect(() => {
    filterData();
  }, [filters]);
  return (
    <div className="payment position-relative d-flex justify-center flex-column  ">
      <PaymentSummary
        invoices={selectedInvoices}
        getPurchaseInvoices={getPurchaseInvoices}
      />
      <div className="d-flex justify-content-between gap-5 p-2 payment-filters pb-5">
        <div class="input-group  ">
          <input
            type="text"
            class="form-control"
            placeholder="Enter a name"
            aria-label="Enter a name"
            aria-describedby="button-addon2"
            name="name"
            onChange={(event) => addFilterValue(event)}
          />
        </div>

        <div class="input-group ">
          <input
            type="text"
            class="form-control"
            placeholder="Enter a vat no."
            aria-label="Enter a vat no."
            aria-describedby="button-addon2"
            name="vatNo"
            onChange={(event) => addFilterValue(event)}
          />
        </div>

        <div class="input-group">
          <select
            className="form-select"
            name="paid"
            onChange={(event) => addFilterValue(event)}
          >
            <option value="false">Unpaid</option>

            <option value="true">Paid</option>
          </select>
        </div>

        <div class="input-group ">
          <button
            class="btn btn-outline-light"
            type="button"
            id="button-addon2"
          >
            Due In...
          </button>

          <input
            onChange={(event) => setThreshold(event.target.value)}
            type="number"
            class="form-control"
            placeholder="3"
            aria-label="3"
            aria-describedby="button-addon2"
            value={threshold}
          />
        </div>

        <div className="input-group  ">
          <button
            onClick={() => selectDueInvoices()}
            className="btn btn-success w-100"
          >
            Select Due Invoices
          </button>
        </div>
      </div>
      <div className="col h-100 w-100 m-0 list  w-100">
        <table class="table table-filter ">
          <thead className="pt-5">
            <tr>
              <th scope="col">Vendor Name</th>
              <th scope="col">Vendor Vat No.</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Document Date</th>
              <th scope="col">Due Date</th>
              <th scope="col">Paid</th>
              {/* <ColumnWithFilter
                name="Paid"
                options={["True", "False"]}
                technicalName="paid"
                data={invoices}
                addFilterValue={addFilterValue}
                type="select"
              /> */}
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => {
              return (
                <tr key={invoice.id}>
                  <td>{invoice.vendor.name}</td>
                  <td>{invoice.vendor.vatNo}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.status}</td>
                  <td>{moment(invoice.createdAt).format("DD.MM.yyyy")}</td>
                  <td>{moment(invoice.dueDate).format("DD.MM.yyyy")}</td>
                  <td>
                    <small
                      className={`badge badge-pill ${
                        invoice.paid
                          ? "badge-success"
                          : invoiceIsDue(invoice.dueDate)
                          ? "badge-danger"
                          : "badge-warning"
                      } `}
                    >
                      {invoice.paid
                        ? "Paid"
                        : invoiceIsDue(invoice.dueDate)
                        ? "Due"
                        : "Not Due"}
                    </small>
                    {/* <input
                      type="checkbox"
                      aria-label="Paid/Unpaid"
                      checked={invoice.paid}
                    /> */}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      disabled={invoice.paid}
                      checked={
                        selectedInvoices.findIndex(
                          (invObj) => invObj.id === invoice.id
                        ) > -1
                      }
                      onChange={() => handleInvoiceSelection(invoice.id)}
                    />
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

export default Payments;
