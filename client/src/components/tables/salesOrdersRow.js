import React, { useEffect, useState } from "react";

function SalesOrderRow({
  order,
  setSelectedOrder,
  setShowDetails,
  showDetails,
  addOrderToBill,
  ordersToBill,
}) {
  const selected = true;

  return (
    <tr>
      <th scope="row">{order.id}</th>
      <td>{order.customer.id}</td>
      <td>{order.customer.name}</td>
      <td>{order.customer.vatNo}</td>
      <td>{order.customer.email}</td>
      <td>{order.amount}</td>
      <td>
        <span
          className={`badge badge-pill${
            order.status === "Invoiced" ? " badge-success" : " badge-danger"
          }`}
        >
          {order.status}
        </span>
      </td>
      <td>{order.createdAt}</td>
      <td>
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={() => (
            setSelectedOrder(order), setShowDetails(!showDetails)
          )}
        >
          Details
        </button>
      </td>

      <td>
        {order.invoice && (
          <a href={order.invoice.url} className="btn btn-outline-success">
            Download
          </a>
        )}
      </td>
      <td>
        <input
          class="form-check-input"
          type="checkbox"
          disabled={order.status === "Invoiced"}
          checked={ordersToBill.some(
            (existingOrder) => existingOrder.id === order.id
          )}
          onChange={() => addOrderToBill(order)}
          id="flexCheckDefault"
        ></input>
      </td>
    </tr>
  );
}

export default SalesOrderRow;
