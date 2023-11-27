import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../App";
import OrderDetails from "./tables/orderDetails";

function PurchaseOrders() {
  const dispatchUserContext = DispatchUserContexts();
  const showUserContext = ShowUserContexts();
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const getPurchaseOrders = async () => {
    try {
      const companyId =
        showUserContext.selectedCompany | apiService.getCompany().id;
      var res = await apiService.getPurchaseOrders(companyId);

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPurchaseOrders();
  }, [showUserContext]);

  return (
    <div>
      <OrderDetails
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        orderDetails={selectedOrder}
      />

      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Vendor ID</th>
              <th scope="col">Vendor Name</th>
              <th scope="col">Vendor VAT no</th>
              <th scope="col">Vendor Email</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>
              <th scope="col">Invoice</th>
              <th scope="col">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              return (
                <tr>
                  <th scope="row">{order.orderId}</th>
                  <td>{order.vendor.id}</td>
                  <td>{order.vendor.name}</td>
                  <td>{order.vendor.vatNo}</td>
                  <td>{order.vendor.email}</td>
                  <td>{order.amount}</td>
                  <td>{order.status}</td>
                  <td>{order.createdAt}</td>
                  <td>
                    {order.invoice && (
                      <a
                        href={order.invoice.url}
                        className="btn btn-outline-success"
                      >
                        Download
                      </a>
                    )}
                  </td>

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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseOrders;
