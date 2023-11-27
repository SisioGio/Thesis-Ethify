import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DispatchFeedbackContexts,
  DispatchUserContexts,
  ShowUserContexts,
} from "../App";
import "./../style/header.css";
import { DispatchCartContexts, ShowCartContexts } from "./../App";
import apiService from "../services/apiService";
import CompanySelector from "./tables/companySelector";
function Header() {
  const UserContext = ShowUserContexts();
  const dispatchUserContexts = DispatchUserContexts();
  const cartDispatch = DispatchCartContexts();
  const setSelectedCompany = (company) => {
    console.log(company);
    apiService.setCompany(company);
    dispatchUserContexts({
      data: UserContext.data,
      authenticated: UserContext.authenticated,
      companies: UserContext.companies,
      selectedCompany: company,
    });
    cartDispatch({
      cart: apiService.getCompanyCart(),
    });
  };
  useEffect(() => {
    dispatchUserContexts({
      data: UserContext.data,
      authenticated: UserContext.authenticated,
      companies: UserContext.companies,
      selectedCompany: apiService.getCompany()
        ? apiService.getCompany().id
        : "NO company",
    });
  }, []);

  return (
    <nav class="navbar navbar-expand-lg justify-content-between navbar-dark px-5">
      <div>
        <a class="navbar-brand " href="#">
          Ethify
        </a>
      </div>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse flex-grow-0" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item active ">
            <Link class="nav-link  " to="/">
              Home{" "}
            </Link>
          </li>

          {UserContext.authenticated && (
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Accounts Payable
              </a>
              <div
                class="dropdown-menu text-center"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <Link class="dropdown-item" to="/vendors">
                  Vendors{" "}
                </Link>
                <Link class="dropdown-item" to="/payments">
                  Payments{" "}
                </Link>

                <Link class="dropdown-item" to="/purchase-orders">
                  Purchase Orders{" "}
                </Link>

                <Link class="dropdown-item" to="/purchase-invoices">
                  Purchase Invoices{" "}
                </Link>

                <Link class="dropdown-item" to="/ap-workflow">
                  AP Workflow{" "}
                </Link>
              </div>
            </li>
          )}

          {UserContext.authenticated && (
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Accounts Receivable
              </a>
              <div
                class="dropdown-menu text-center"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <Link class="dropdown-item" to="/sales-invoices">
                  Sales Invoices{" "}
                </Link>

                <Link class="dropdown-item" to="/customers">
                  Customers{" "}
                </Link>
                <Link class="dropdown-item" to="/salesOrders">
                  Sales Orders{" "}
                </Link>
              </div>
            </li>
          )}

          {UserContext.authenticated && (
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                General Ledger
              </a>
              <div
                class="dropdown-menu text-center"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <Link class="dropdown-item" to="/account">
                  Account{" "}
                </Link>

                <Link class="dropdown-item" to="/taxcodes">
                  Tax Codes{" "}
                </Link>

                <Link class="dropdown-item" to="/businesslines">
                  Business Lines{" "}
                </Link>

                <Link class="dropdown-item" to="/factories">
                  Factories{" "}
                </Link>
                <Link class="dropdown-item" to="/costcenters">
                  Cost Centers{" "}
                </Link>
              </div>
            </li>
          )}

          {UserContext.authenticated && (
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin
              </a>
              <div
                class="dropdown-menu text-center"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <Link class="dropdown-item" to="/inventory">
                  Inventory{" "}
                </Link>

                <Link class="dropdown-item" to="/companies">
                  Companies{" "}
                </Link>
              </div>
            </li>
          )}
          {UserContext.authenticated && <CompanySelector />}
          {!UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/signup">
                Sign Up{" "}
              </Link>
            </li>
          )}
          {!UserContext.authenticated && (
            <li class="nav-item ">
              <Link class="nav-link" to="/signin">
                Sign In{" "}
              </Link>
            </li>
          )}
          {UserContext.authenticated && (
            <li class="nav-item">
              <Link class="nav-link" to="/signout">
                Sign Out{" "}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
