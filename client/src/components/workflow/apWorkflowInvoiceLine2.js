import React, { useEffect, useState } from "react";
import WorkflowInvoiceLineTransaction from "../old/apWorkflowInvoiceLineTransaction";
import apiService from "../../services/apiService";
import WorkflowInvoiceLineTransaction2 from "./apWorkflowInvoiceLineTransaction2";

function WorkflowInvoiceLine2({ line, invoice }) {
  // One invoice line can have one or more transactions ( accounting lines )
  const [transactions, setTransactions] = useState([]);
  // Schema for empty transaction
  const emptyTransaction = {
    id: "",
    accountId: "",
    costCenterId: "",
    factoryId: "",
    description: "",
    taxValueId: "",
    netAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    businessLineId: "",
    name: line.description,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    unitOfMeasure: line.unitOfMeasure,
    warehouse: {
      externalId: line.articleCode,
    },
    totalLineNetAmount: parseFloat(line.unitPrice) * parseFloat(line.quantity),
    totalLineTaxAmount: line.taxAmount,
    totalLineAmount: line.totalAmount,
  };
  const addTransaction = () => {
    apiService.addInvoiceLine(invoice, line, emptyTransaction);
    getProductTransactions();

    // getProductTransactions(); Uncomment when calculation is implemented
  };

  const getSuggestedTransactions = async () => {
    try {
      var transactions = [];

      if (invoice.status != "New") {
        // Posted invoice
        transactions = line.postedTransactions;
        apiService.removeInvoiceProductLines(invoice, line.articleCode);
        insertTransactions(transactions);
      } else {
        // New Invoice
        var suggestedTransactions = line.suggestedTransactions;
        // apiService.removeInvoiceProductLines(invoice, line.articleCode);
        if (suggestedTransactions && suggestedTransactions.length > 0) {
          transactions = suggestedTransactions;
          insertTransactions(transactions);
        } else {
          transactions = apiService.getInvoiceProductLines(invoice, line).lines;
        }
      }

      getProductTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const insertTransactions = (transactions) => {
    transactions.forEach((transaction) => {
      apiService.addProposedLine(invoice, transaction.warehouse.externalId, {
        accountId: transaction.accountId,
        costCenterId: transaction.costCenterId,
        factoryId: transaction.factoryId,
        description: transaction.description,
        taxValueId: transaction.taxValueId,
        netAmount: transaction.netAmount,
        taxAmount: transaction.taxAmount,
        totalAmount: transaction.totalAmount,
        businessLineId: transaction.businessLineId,

        dbId: transaction.id,
        quantity: line.quantity,
        totalLineNetAmount: line.netAmount,
        totalLineAmount: line.totalAmount,
        totalLineTaxAmount: line.taxAmount,
      });
    });
  };

  const removeTransaction = (i) => {
    apiService.removeInvoiceProductLine(invoice.id, line.id, i);

    // transactions.splice(i, 1);

    // setTransactions([...transactions]);

    getProductTransactions();
  };

  // Calculates the line amounts such as net,tax and total amount every time a transaction amount changes
  const [lineData, setLineData] = useState({
    netAmount: parseFloat(line.quantity) * parseFloat(line.unitPrice),
    taxAmount: line.taxAmount,
    totalAmount: line.totalAmount,
    description: line.description,
  });
  //  Retrieve line transactions from local storage and update component state [transactions]
  const getProductTransactions = () => {
    var newTransactions = apiService.getInvoiceProductLines(
      invoice,
      line,
      line.articleCode
    ).lines;
    setTransactions(newTransactions);
    var netAmount = parseFloat(line.unitPrice) * parseFloat(line.quantity);
    var taxAmount = line.taxAmount;
    var totalAmount = line.totalAmount;

    newTransactions.forEach((transaction) => {
      netAmount -= parseFloat(transaction.netAmount).toFixed(2) || 0;
      taxAmount -= parseFloat(transaction.taxAmount).toFixed(2) || 0;
      totalAmount -= parseFloat(transaction.totalAmount).toFixed(2) || 0;
    });
    netAmount = netAmount.toFixed(2);
    taxAmount = taxAmount.toFixed(2);
    totalAmount = totalAmount.toFixed(2);
    setLineData((prevNote) => ({
      ...prevNote,
      ["netAmount"]: netAmount,
      ["taxAmount"]: taxAmount,
      ["totalAmount"]: totalAmount,
    }));
  };

  useEffect(() => {
    getSuggestedTransactions();
    console.log("line state changed!");
  }, [invoice]);
  return (
    line &&
    transactions.map((transaction, i) => {
      return (
        <WorkflowInvoiceLineTransaction2
          i={i}
          product={line}
          lineData={lineData}
          setLineData={setLineData}
          invoice={invoice}
          disabled={invoice.status === "Saved"}
          transaction={transaction}
          addTransaction={addTransaction}
          removeTransaction={removeTransaction}
        />
      );
    })
  );
}

export default WorkflowInvoiceLine2;
