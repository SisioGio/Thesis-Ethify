import React, {
  useState,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import apiService from "./services/apiService";
import "./App.css";
import Account from "./components/tables/account";

import Feedback from "./components/feedback";
import Header from "./components/header";
import Logout from "./components/Logout";
import Signin from "./components/signin";
import Signup from "./components/signup";
import ProtectedRoute from "./components/onlyAuthorized";
import CompaniesTest from "./components/tables/companies";
import Inventory from "./components/tables/inventory";
import Vendors from "./components/tables/vendors";
import VendorProducts from "./components/tables/vendorProducts";
import Cart from "./components/cart";
import PurchaseOrders from "./components/purchaseOrders";
import SalesOrders from "./components/tables/salesOrders";
import TaxCodes from "./components/tables/taxCodes";
import Customers from "./components/tables/customers";
import SalesInvoices from "./components/tables/salesInvoices";
import PurchaseInvoices from "./components/tables/purchaseInvoices";
import ApWorkflow from "./components/workflow/apWorkflow";
import Factory from "./components/tables/factory";
import CostCenter from "./components/tables/costCenter";
import BusinessLine from "./components/tables/businessLine";
import WorkflowAccounting from "./components/workflow/apWorkflowAccounting";
import CompanyData from "./components/tables/payments";
import Payments from "./components/tables/payments";
import GenericDimensions from "./components/tables/generalDimensions";
import Footer from "./components/footer";
import Home from "./components/home";
const showFeedbackContext = createContext();
const dispatchFeedbackContext = createContext();
const showUserContext = createContext();
const dispatchUserContext = createContext();
const showCartContext = createContext();
const dispatchCartContext = createContext();
const FeedbackReducer = (state, action) => {
  return {
    message: action.message,
    type: action.type,
  };
};
const Feedbackstates = {
  message: "",
  type: "",
};

const UserReducer = (state, action) => {
  return {
    data: action.data,
    authenticated: action.authenticated,
    companies: action.companies,
    selectedCompany: action.selectedCompany,
  };
};
const Userstates = {
  data: {},
  authenticated: false,
  companies: [],
  selectedCompany: "",
  // selectedCompany: apiService.getCompany() ? apiService.getCompany().id : "",
};
const CartReducer = (state, action) => {
  return {
    cart: action.cart,
  };
};
const Cartstates = {
  cart: apiService.getCartItems(),
};
function App() {
  const [feedback, setFeedback] = useReducer(FeedbackReducer, Feedbackstates);
  const [userAuth, setUserAuth] = useReducer(UserReducer, Userstates);
  const [cart, setCart] = useReducer(CartReducer, Cartstates);

  return (
    <dispatchUserContext.Provider value={setUserAuth}>
      <showUserContext.Provider value={userAuth}>
        <dispatchFeedbackContext.Provider value={setFeedback}>
          <showFeedbackContext.Provider value={feedback}>
            <dispatchCartContext.Provider value={setCart}>
              <showCartContext.Provider value={cart}>
                <div className="App">
                  <Feedback />
                  <Router>
                    {userAuth.authenticated && <Cart />}

                    <div id="header">
                      <Header />
                    </div>

                    <div id="body">
                      <Routes>
                        {/* <Route
                          path="/dimensions"
                          element={
                            <ProtectedRoute requestedRoute={"dimensions"}>
                              <GenericDimensions />
                            </ProtectedRoute>
                          }
                        /> */}

                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute requestedRoute={"account"}>
                              <Account />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/businesslines"
                          element={
                            <ProtectedRoute requestedRoute={"businesslines"}>
                              <BusinessLine />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/factories"
                          element={
                            <ProtectedRoute requestedRoute={"factories"}>
                              <Factory />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/costcenters"
                          element={
                            <ProtectedRoute requestedRoute={"costcenters"}>
                              <CostCenter />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signout" element={<Logout />} />
                        <Route
                          path="/companies"
                          element={
                            <ProtectedRoute requestedRoute={"companies"}>
                              <CompaniesTest />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/inventory"
                          element={
                            <ProtectedRoute requestedRoute={"inventory"}>
                              <Inventory />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/sales-invoices"
                          element={
                            <ProtectedRoute requestedRoute={"sales-invoices"}>
                              <SalesInvoices />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/ap-workflow"
                          element={
                            <ProtectedRoute requestedRoute={"ap-workflow"}>
                              <ApWorkflow />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/ap-workflow/:id"
                          element={
                            <ProtectedRoute requestedRoute={"ap-workflow"}>
                              <WorkflowAccounting />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/products"
                          element={
                            <ProtectedRoute requestedRoute={"products"}>
                              <VendorProducts />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/purchase-invoices"
                          element={
                            <ProtectedRoute
                              requestedRoute={"purchase-invoices"}
                            >
                              <PurchaseInvoices />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/purchase-orders"
                          element={
                            <ProtectedRoute requestedRoute={"purchase-orders"}>
                              <PurchaseOrders />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/sales-invoices"
                          element={
                            <ProtectedRoute requestedRoute={"sales-invoices"}>
                              <SalesInvoices />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/vendors"
                          element={
                            <ProtectedRoute requestedRoute={"vendors"}>
                              <Vendors />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/payments"
                          element={
                            <ProtectedRoute requestedRoute={"payments"}>
                              <Payments />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customers"
                          element={
                            <ProtectedRoute requestedRoute={"customers"}>
                              <Customers />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/purchaseOrders"
                          element={
                            <ProtectedRoute requestedRoute={"purchaseOrders"}>
                              <PurchaseOrders />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/salesOrders"
                          element={
                            <ProtectedRoute requestedRoute={"salesOrders"}>
                              <SalesOrders />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/taxcodes"
                          element={
                            <ProtectedRoute requestedRoute={"taxcodes"}>
                              <TaxCodes />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path={"/home"}
                          element={
                            <ProtectedRoute requestedRoute={"home"}>
                              <Home />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path={"/"}
                          element={
                            <ProtectedRoute requestedRoute={"home"}>
                              <Home />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </div>

                    <Footer />
                  </Router>
                </div>
              </showCartContext.Provider>
            </dispatchCartContext.Provider>
          </showFeedbackContext.Provider>
        </dispatchFeedbackContext.Provider>
      </showUserContext.Provider>
    </dispatchUserContext.Provider>
  );
}

export default App;

export const DispatchUserContexts = () => useContext(dispatchUserContext);
export const ShowUserContexts = () => useContext(showUserContext);
export const DispatchFeedbackContexts = () =>
  useContext(dispatchFeedbackContext);
export const ShowFeedbackContexts = () => useContext(showFeedbackContext);
export const DispatchCartContexts = () => useContext(dispatchCartContext);
export const ShowCartContexts = () => useContext(showCartContext);
