import React, { useState, useEffect } from "react";
import "./../style/home.css";
import apiService from "../services/apiService";
import { ShowUserContexts } from "../App";
function Home() {
  const [kpi, setKpi] = useState(null);
  const userContext = ShowUserContexts();

  const getCompanyKPI = async () => {
    try {
      const companyId = apiService.getCompany().id;
      const res = await apiService.getCompanyKPI(companyId);
      setKpi(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCompanyKPI();
  }, [userContext]);
  return (
    <div className="py-5">
      <h1>Welcome Back To Ethify</h1>
      <div className="col-12 col-sm-10 col-md-8  col-lg-6 m-auto">
        {kpi && (
          <div className=" home-shortcuts">
            <div className="">
              <h5>Purchase Invoices</h5>
              <p>{kpi.purchaseInvoices}</p>
            </div>
            <div className="">
              <h5>Purchase Invoices Due</h5>
              <p>{kpi.duePurchaseInvoices}</p>
            </div>
            <div className="">
              <h5>Purchase Invoices Due Amount</h5>
              <p>{kpi.duePurchaseInvoicesValue}</p>
            </div>
            <div className="">
              <h5>Sales Invoices</h5>
              <p>{kpi.salesInvoices}</p>
            </div>
            <div className="">
              <h5>Sales Invoices Due</h5>
              <p>{kpi.dueSalesInvoices}</p>
            </div>
            <div className="">
              <h5>Sales Invoices Due Amount</h5>
              <p>{kpi.dueSalesInvoicesValue}</p>
            </div>

            <div className="">
              <h5>Sales Orders</h5>
              <p>{kpi.salesOrdersCounter}</p>
            </div>
            {/* <div className="">
              <h5>Sales Orders Amount</h5>
              <p>{kpi.salesOrdersTotalAmount}</p>
            </div> */}

            <div className="">
              <h5>Sales Orders Open</h5>
              <p>{kpi.openSalesOrders}</p>
            </div>
            <div className="">
              <h5>Sales Orders Open Amount</h5>
              <p>{kpi.openSalesOrdersValue}</p>
            </div>

            <div className="">
              <h5>Purchase Orders</h5>
              <p>{kpi.purchaseOrders}</p>
            </div>

            {/* <div className="">
              <h5>Purchase Orders Amount</h5>
              <p>{kpi.purchaseOrdersTotalAmount}</p>
            </div> */}
            <div className="">
              <h5>Purchase Orders Open</h5>
              <p>{kpi.openPurchaseOrders}</p>
            </div>

            <div className="">
              <h5>Purchase Orders Open Amount</h5>
              <p>{kpi.openPurchaseOrdersValue}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
