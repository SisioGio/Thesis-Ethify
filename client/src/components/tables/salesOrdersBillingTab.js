import React, { useEffect, useState } from "react";

function SalesOrdersBilingTab({ selectAll, billOrders, ordersToBill }) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState(0);
  const [orders, setOrders] = useState(0);
  const calculateValues = () => {
    setOrders(ordersToBill.length);

    setTotalAmount(sumAmounts(ordersToBill));
    setItems(sumOrderProductQuantities(ordersToBill));
  };

  function sumAmounts(arrayOfObjects) {
    // Use the reduce method to calculate the sum
    const totalAmount = arrayOfObjects.reduce((sum, currentObject) => {
      // Check if the currentObject has an 'amount' property
      if (currentObject.hasOwnProperty("amount")) {
        return sum + parseFloat(currentObject.amount);
      }
      // If the 'amount' property is missing, return the current sum unchanged
      return sum;
    }, 0); // Initialize sum to 0

    return totalAmount;
  }
  function sumOrderProductQuantities(data) {
    let totalQuantity = 0;

    data.forEach((item) => {
      if (
        item.hasOwnProperty("orderProducts") &&
        Array.isArray(item.orderProducts)
      ) {
        item.orderProducts.forEach((orderProduct) => {
          if (orderProduct.hasOwnProperty("quantity")) {
            totalQuantity += parseFloat(orderProduct.quantity);
          }
        });
      }
    });

    return totalQuantity;
  }
  useEffect(() => {
    calculateValues();
  }, [ordersToBill]);
  return (
    <div className="billing-details d-flex justify-content-end py-3">
      <div className="w-50  d-flex justify-content-between">
        <div className="d-flex">
          <p className="font-weight-bold">Total Amount:</p>
          <p className=" ">{totalAmount.toFixed(2)}</p>
        </div>

        <div className="d-flex">
          <p className="font-weight-bold ">Orders:</p>
          <p>{orders}</p>
        </div>

        <div className="d-flex">
          <p className="font-weight-bold">Items:</p>
          <p>{items}</p>
        </div>

        <div className="d-flex">
          <btn
            href="#"
            className="btn btn-primary d-flex justify-items-center"
            onClick={(event) => selectAll()}
          >
            Select All
          </btn>
        </div>

        <div className="d-flex">
          <a
            href="#"
            className="btn btn-primary"
            onClick={(event) => billOrders()}
          >
            Generate Invoices
          </a>
        </div>
      </div>
    </div>
  );
}

export default SalesOrdersBilingTab;
