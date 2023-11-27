import React from "react";
import WorkflowInvoiceLine from "../old/apWorkflowInvoiceLine";
import WorkflowInvoiceLine2 from "./apWorkflowInvoiceLine2";

function InvoiceLineItem2({ invoice }) {
  return (
    <div className=" border rounded p-2" id="accounting-lines">
      <table class="table w-auto text-nowrap accounting-table p-2">
        <thead>
          <tr>
            <th scope="col col-sm-auto">ITEM</th>
            <th scope="col">NET</th>
            <th scope="col th-sm">VAT</th>
            <th scope="col">TOTAL</th>
            <th scope="col">ACCOUNT</th>
            <th scope="col">CC</th>
            <th scope="col">FCT</th>
            <th scope="col">BL</th>

            <th scope="col">DESCRIPTION</th>
            <th scope="col">NET</th>
            <th scope="col col-sm-auto">VAT CODE</th>
            <th scope="col">VAT</th>
            <th scope="col">TOTAL</th>

            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoiceLines.map((line, i) => {
            return (
              <WorkflowInvoiceLine2
                invoice={invoice}
                line={line}
                disabled={invoice.status != "New"}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceLineItem2;
