import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

function WorkflowInvoiceLineTransaction({
  lineData,
  transaction,
  addTransaction,
  removeTransaction,
  setLineData,
  i,
  invoice,
  product,
  getProductTransactions,
  disabled,
}) {
  const [taxAmount, setTaxAmount] = useState(transaction.taxAmount);
  const [description, setDescription] = useState(transaction.description);

  const oldValues = {
    netAmount: React.useRef(transaction.netAmount),
    taxAmount: React.useRef(0),
    totalAmount: React.useRef(0),
  };
  let onChange = (e) => {
    var name = e.target.name;
    let oldValue = oldValues[name].current;
    if (!oldValue) {
      oldValue = 0;
    }
    let inputValue = e.target.value; // let oldValue = will be here
    if (!inputValue) {
      inputValue = 0;
    }
    let newValue =
      parseFloat(lineData[name]) +
      parseFloat(oldValue) -
      parseFloat(inputValue);
    transaction.netAmount = inputValue;
    setLineData((prevNote) => ({
      ...prevNote,

      [name]: newValue,
    }));

    oldValues[name].current = e.target.value;
  };

  const editProductLine = (event) => {
    transaction[event.target.name] = event.target.value;
    var targetName = event.target.name;
    var targetType = event.target.type;

    if (targetName === "description") {
      setDescription(event.target.value);
    }
    if (targetName === "taxValueId") {
      var oldTaxAmount = transaction.taxAmount || 0;
      var oldTotalAmount = transaction.totalAmount || 0;
      var taxValueId = event.target.value;
      var percentage =
        event.target.selectedOptions[0].getAttribute("percentage") || 0;
      var netAmount = transaction.netAmount;
      var taxAmount = (parseFloat(netAmount) * parseFloat(percentage)) / 100;
      var totalAmount = parseFloat(netAmount) + taxAmount;
      setTaxAmount(taxAmount);
      transaction.taxAmount = taxAmount;
      transaction.totalAmount = totalAmount;
      console.log(totalAmount);

      setLineData((prevNote) => ({
        ...prevNote,

        ["taxAmount"]:
          parseFloat(lineData.taxAmount) +
          parseFloat(oldTaxAmount) -
          parseFloat(taxAmount),
      }));

      setLineData((prevNote) => ({
        ...prevNote,

        ["totalAmount"]:
          parseFloat(lineData.totalAmount) +
          parseFloat(oldTotalAmount) -
          parseFloat(totalAmount),
      }));
    }
  };

  const saveProductLine = () => {
    apiService.updateInvoiceProductLine(invoice, product, transaction);
    getProductTransactions();
  };

  useEffect(() => {}, [disabled]);
  return (
    <tr>
      <td>
        <input
          class="form-control form-control-sm"
          disabled
          type="text"
          value={lineData.productName}
        />
      </td>
      <td>
        <input
          class="form-control form-control-sm"
          disabled
          type="text"
          value={parseFloat(lineData.netAmount).toFixed(2)}
        />
      </td>
      <td>
        <input
          class="form-control form-control-sm"
          disabled
          type="text"
          value={parseFloat(lineData.taxAmount).toFixed(2)}
        />
      </td>
      <td>
        <input
          class="form-control form-control-sm"
          disabled
          type="text"
          value={parseFloat(lineData.totalAmount).toFixed(2)}
        />
      </td>

      <td>
        <select
          class="form-control form-control-sm "
          name="accountId"
          onChange={(event) => editProductLine(event)}
          aria-label=". example"
          disabled={disabled}
        >
          <option selected={transaction.accountId === ""} value>
            {" "}
            -- select--{" "}
          </option>

          {invoice.customer.accounts.map((account) => {
            return (
              <option
                selected={transaction.accountId == account.id}
                value={account.id}
              >
                {account.code}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <select
          class="form-control form-control-sm"
          name="costCenterId"
          onChange={(event) => editProductLine(event)}
          aria-label=". example"
          disabled={disabled}
        >
          <option selected={transaction.costCenterId === ""} value>
            {" "}
            -- Select --{" "}
          </option>

          {invoice.customer.costCenters.map((costCenter) => {
            return (
              <option
                value={costCenter.id}
                selected={transaction.costCenterId == costCenter.id}
              >
                {costCenter.code}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <select
          class="form-control form-control-sm"
          name="factoryId"
          onChange={(event) => editProductLine(event)}
          aria-label=". example"
          disabled={disabled}
        >
          <option selected={transaction.factoryId === ""} value>
            {" "}
            -- select--{" "}
          </option>

          {invoice.customer.factories.map((factory) => {
            return (
              <option
                selected={transaction.factoryId == factory.id}
                value={factory.id}
              >
                {factory.code}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <select
          class="form-control form-control-sm"
          name="businessLineId"
          onChange={(event) => editProductLine(event)}
          aria-label=". example"
          disabled={disabled}
        >
          <option selected={transaction.businessLineId === ""} value>
            {" "}
            -- select--{" "}
          </option>

          {invoice.customer.businessLines.map((businessLine) => {
            return (
              <option
                selected={transaction.businessLineId == businessLine.id}
                value={businessLine.id}
              >
                {businessLine.code}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          class="form-control form-control-sm"
          type="text"
          name="description"
          onChange={(event) => editProductLine(event)}
          value={description}
          disabled={disabled}
        />
      </td>
      <td>
        <input
          disabled={disabled}
          class="form-control form-control-sm"
          type="number"
          value={parseFloat(transaction.netAmount).toFixed(2)}
          onChange={onChange}
          name="netAmount"
        />
      </td>
      <td>
        <select
          disabled={disabled}
          class="form-control form-control-sm"
          name="taxValueId"
          onChange={(event) => editProductLine(event)}
          aria-label=". example"
        >
          <option selected={transaction.taxValueId === ""} value>
            {" "}
            --select--{" "}
          </option>

          {invoice.customer.taxCodes.map((taxCode) => {
            return taxCode.taxValues.map((taxValue) => {
              return (
                <option
                  selected={transaction.taxValueId == taxValue.id}
                  value={taxValue.id}
                  percentage={taxValue.percentage}
                >
                  {taxCode.code} - {taxValue.name} ({taxValue.percentage}%)
                </option>
              );
            });
          })}
        </select>
      </td>
      <td>
        <input
          class="form-control form-control-sm"
          name="taxAmount"
          type="number"
          onChange={onChange}
          disabled
          value={parseFloat(transaction.taxAmount).toFixed(2)}
        />
      </td>

      <td>
        <input
          class="form-control form-control-sm"
          name="totalAmount"
          type="number"
          onChange={onChange}
          disabled
          value={parseFloat(transaction.totalAmount).toFixed(2)}
        />
      </td>

      <td className="">
        <div className="d-flex">
          <button
            disabled={disabled}
            className="mx-1"
            onClick={() => addTransaction()}
          >
            +
          </button>

          <button
            disabled={disabled}
            className="mx-1"
            onClick={() => removeTransaction(transaction.id)}
          >
            -
          </button>
        </div>
      </td>
      <td>
        <button
          onClick={() => saveProductLine()}
          disabled={disabled}
          className="btn btn-success form-control form-control-sm"
        >
          SAVE
        </button>
      </td>
    </tr>
  );
}

export default WorkflowInvoiceLineTransaction;
