// client/src/App.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "./../../style/cart.css";
import { DispatchCartContexts, ShowCartContexts } from "../../App";
import { DispatchFeedbackContexts } from "../../App";
import "./../../style/orders.css";
function OrderDetails({ showDetails, setShowDetails, orderDetails }) {
  useEffect(() => {
    console.log({ orderDetails: orderDetails });
  }, [orderDetails]);
  return (
    showDetails && (
      <div id="cart" className="order-details-background">
        <div className="cart-details ">
          <svg
            onClick={() => setShowDetails(!showDetails)}
            className="close-btn"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>

          {orderDetails.orderProducts ? (
            <div className="cart-body p-5 ">
              <div className="cart-items">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Order ID</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                      <th scope="col">Total</th>
                      <th scope="col">Vendor Name</th>
                      <th scope="col">Vendor VatNo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.orderProducts.map((item, i) => {
                      return (
                        <tr>
                          <th scope="row">{i}</th>
                          <td>{orderDetails.id}</td>
                          <td>{item.product.name}</td>
                          <td>{item.product.type}</td>
                          <td>{item.quantity}</td>
                          <td>{item.product.price}</td>

                          <td>
                            {parseFloat(item.quantity) *
                              parseFloat(item.product.price)}
                          </td>
                          <td>{orderDetails.vendor.name}</td>
                          <td>{orderDetails.vendor.vatNo}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* <div className="cart-data py-2 d-flex justify-content-around">
                <h5>
                  Total Amount :
                  <span className="text-danger"> {orderDetails.amount}</span>
                </h5>
              </div> */}
            </div>
          ) : (
            <h5>Your Cart is empty</h5>
          )}
        </div>
      </div>
    )
  );
}

export default OrderDetails;
