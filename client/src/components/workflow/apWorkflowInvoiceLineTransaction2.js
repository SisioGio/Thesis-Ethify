import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

function WorkflowInvoiceLineTransaction2({
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
  const [taxPercentage, setTaxPercentage] = useState(0);
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
    let inputValue = e.target.value;
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

    calculateTransactionAmounts();
  };

  const editProductLine = (event) => {
    transaction[event.target.name] = event.target.value;

    console.log(event.target.value);
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
      setTaxPercentage(percentage);
      setTaxAmount(taxAmount);
      calculateTransactionAmounts(percentage);
      transaction.taxAmount = taxAmount;
      transaction.totalAmount = totalAmount;

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

    apiService.updateInvoiceProductLine(invoice, product, transaction);
  };

  const calculateTransactionAmounts = (percentage) => {
    // Set oldValues ( needed to calculate new parent line amounts)

    oldValues.taxAmount.current = transaction.taxAmount;
    oldValues.totalAmount.current = transaction.totalAmount;

    // Calculate new values based on net amount
    let netAmount = transaction.netAmount || 0;
    var percentageValue;
    if (percentage) {
      percentageValue = percentage;
    } else {
      percentageValue = taxPercentage;
    }

    let taxAmount = (netAmount * percentageValue) / 100;
    let totalAmount = parseFloat(netAmount) + parseFloat(taxAmount);

    // Set new transaction amounts
    transaction.netAmount = netAmount;
    transaction.taxAmount = taxAmount;
    transaction.totalAmount = totalAmount;
    apiService.updateInvoiceProductLine(invoice, product, transaction);
    // Update parent line amounts by changing value of lineData (defined in parent component InvoiceLine)
    setLineData((prevNote) => ({
      ...prevNote,
      ["taxAmount"]:
        parseFloat(lineData.taxAmount) +
        parseFloat(oldValues.taxAmount.current) -
        parseFloat(transaction.taxAmount),
      ["totalAmount"]:
        parseFloat(lineData.totalAmount) +
        parseFloat(oldValues.totalAmount.current) -
        parseFloat(transaction.totalAmount),
    }));
  };

  const saveProductLine = () => {
    apiService.updateInvoiceProductLine(invoice, product, transaction);
    // getProductTransactions();
  };

  useEffect(() => {
    console.log("State changed!");
  }, [disabled, taxPercentage]);
  return (
    <tr>
      <td>
        <input
          class="form-control form-control-sm"
          disabled
          type="text"
          value={lineData.description}
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
          disabled
          value={parseFloat(transaction.taxAmount).toFixed(2)}
        />
      </td>

      <td>
        <input
          class="form-control form-control-sm"
          name="totalAmount"
          type="number"
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
      {/* <td>
        <button
          onClick={() => saveProductLine()}
          disabled={disabled}
          className="btn btn-success form-control form-control-sm"
        >
          SAVE
        </button>
      </td> */}
    </tr>
  );
}

export default WorkflowInvoiceLineTransaction2;
