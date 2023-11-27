import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchUserContexts, ShowUserContexts } from "../../App";
import OrderDetails from "./orderDetails";
import SalesOrderRow from "./salesOrdersRow";
import SalesOrdersBilingTab from "./salesOrdersBillingTab";

function SalesOrders() {
  const dispatchUserContext = DispatchUserContexts();
  const showUserContext = ShowUserContexts();
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [ordersToBill, setOrdersToBill] = useState([]);
  const getSalesOrders = async () => {
    try {
      const companyId =
        showUserContext.selectedCompany | apiService.getCompany().id;
      var res = await apiService.getSalesOrders(companyId);

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addOrderToBill = (clickedOrder) => {
    console.log({ orderToAdd: clickedOrder });
    console.log({ currentOrdersToBill: ordersToBill });
    if (ordersToBill.some((order) => order.id === clickedOrder.id)) {
      var newBills = ordersToBill.filter(
        (order) => order.id != clickedOrder.id
      );
    } else {
      var newBills = [...ordersToBill, clickedOrder];
    }
    console.log({ newOrdersToBill: newBills });
    setOrdersToBill(newBills);
  };

  const selectAll = () => {
    var newOrders = [];
    orders.forEach((order) => {
      if (order.status != "Invoiced") {
        newOrders.push(order);
      }
    });

    setOrdersToBill(newOrders);
  };
  const billOrders = async () => {
    try {
      let res = await apiService.createInvoice({
        orders: ordersToBill,
      });
      getSalesOrders();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSalesOrders();
    console.log("Orders to bill updated!");
  }, [showUserContext, ordersToBill]);

  return (
    <div>
      <OrderDetails
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        orderDetails={selectedOrder}
      />
      <SalesOrdersBilingTab
        selectAll={selectAll}
        billOrders={billOrders}
        ordersToBill={ordersToBill}
      />

      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer VAT no</th>
              <th scope="col">Customer Email</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>
              <th scope="col">Products</th>
              <th scope="col">Invoice</th>
              <th scope="col">Select</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              return (
                <SalesOrderRow
                  order={order}
                  setSelectedOrder={setSelectedOrder}
                  setShowDetails={setShowDetails}
                  showDetails={showDetails}
                  ordersToBill={ordersToBill}
                  addOrderToBill={addOrderToBill}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesOrders;
