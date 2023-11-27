// client/src/App.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../services/apiService";
import "./../style/cart.css";
import { DispatchCartContexts, ShowCartContexts } from "./../App";
import { DispatchFeedbackContexts } from "./../App";

function Cart() {
  const [showDetails, setShowDetails] = useState(false);
  const [cart, setCart] = useState(null);
  const FeedbackDispatcher = DispatchFeedbackContexts();
  const cartContext = ShowCartContexts();
  const [orders, setOrders] = useState([]);
  const cartDispatch = DispatchCartContexts();

  const clearItems = async () => {
    apiService.deleteCart();
    cartDispatch({
      cart: {},
    });
  };
  const createOrder = async () => {
    var customerId = apiService.getCompany().id;
    cart.customerId = customerId;

    // var vendors = [
    //   ...new Set(cart.items.map((item) => item.product.company.id)),
    // ];

    try {
      let res = await apiService.createOrder(cart);
      FeedbackDispatcher({
        type: "Success",
        message: "Congrats! Orders created!",
      });
      console.log(res.data);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      FeedbackDispatcher({
        value: true,
        message: "Error from server",
        type: "Error",
      });
    }
  };
  useEffect(() => {
    setCart(apiService.getCompanyCart());
  }, [cartContext]);
  return (
    cart &&
    cart.items.length > 0 && (
      <div id="cart" className="">
        <div id="cart-preview" onClick={() => setShowDetails(true)}>
          <h5>
            Cart <span>{cart && cart.numberOfItems}</span>
          </h5>
        </div>

        {showDetails && (
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
            <div className="cart-title">
              <h1>Checkout</h1>
            </div>

            {cart.items ? (
              <div className="cart-body p-5 ">
                <div className="cart-items">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Total</th>
                        <th scope="col">Vendor Name</th>
                        <th scope="col">Vendor VatNo</th>
                        {orders.length > 0 ? (
                          <th scope="col">Order ID</th>
                        ) : (
                          <th scope="col">Delete</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item, i) => {
                        return (
                          <tr>
                            <th scope="row">{i}</th>
                            <td>{item.product.name}</td>
                            <td>{item.product.type}</td>
                            <td>{item.quantity}</td>
                            <td>{item.product.price}</td>

                            <td>
                              {(
                                parseFloat(item.quantity) *
                                parseFloat(item.product.price)
                              ).toFixed(2)}
                            </td>
                            <td>{item.product.company.name}</td>
                            <td>{item.product.company.vatNo}</td>

                            {orders.length > 0 ? (
                              <td>
                                {
                                  orders.find(
                                    (order) =>
                                      order.vendorId === item.product.company.id
                                  ).id
                                }
                              </td>
                            ) : (
                              <td>
                                <a
                                  href="#"
                                  onClick={() => (
                                    apiService.removeProductFromCart(
                                      item.product.id
                                    ),
                                    cartDispatch({
                                      cart: apiService.getCompanyCart(),
                                    })
                                  )}
                                >
                                  Delete
                                </a>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="cart-data py-2 d-flex justify-content-around">
                  <h5>
                    Total Amount :
                    <span className="text-danger"> {cart.totalAmount}</span>
                  </h5>
                  <h5>
                    Number of items in your cart:{" "}
                    <span className="text-danger">{cart.numberOfItems}</span>
                  </h5>
                </div>

                <div className="cart-actions d-flex justify-content-around pt-3 ">
                  {orders.length > 0 && (
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => (setShowDetails(false), clearItems())}
                    >
                      OK
                    </button>
                  )}
                  {orders.length === 0 && (
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => setShowDetails(false)}
                    >
                      Close
                    </button>
                  )}
                  {orders.length === 0 && (
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => createOrder()}
                    >
                      Order
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <h5>Your Cart is empty</h5>
            )}
          </div>
        )}
      </div>
    )
  );
}

export default Cart;
