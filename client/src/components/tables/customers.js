import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { Link } from "react-router-dom";
import { ShowUserContexts } from "../../App";
import CustomerRow from "./customerRow";
function Customers() {
  const [customers, setCustomers] = useState([]);
  const UserContext = ShowUserContexts();
  const [companies, setCompanies] = useState([]);
  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const [customerGroups, setCustomerGroups] = useState([]);

  const getCustomerGroups = async () => {
    try {
      let res = await apiService.getCustomerGroups(apiService.getCompany().id);
      setCustomerGroups(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getCompanies = async () => {
    try {
      const userId = apiService.getUser().id;
      var res = await apiService.getCompanies(userId);
      const vendorId = apiService.getCompany().id;
      const filtered_companies = res.data.filter(
        (company) => company.id != vendorId
      );

      setCompanies(filtered_companies);
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomers = async () => {
    try {
      const customerId = apiService.getCompany().id;
      var res = await apiService.getCustomers(customerId);
      console.log(res.data);
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const CreateCompany = async (event) => {
    event.preventDefault();
    try {
      data.vendorId = apiService.getCompany().id;
      let res = await apiService.addCustomer(data);

      dispatch({
        value: true,
        message: `Success, customer ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });

      getCustomers();
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
  };

  const [data, setData] = useState({
    name: "",
    vatNo: "",
    email: "",
    walletAddress: "",
    country: "",
    region: "",
    city: "",
    street: "",
    streetNo: "",
    postcode: "",
    referenceCustomerCompanyId: "",
    vendorId: apiService.getCompany().id,
    type: "",
    days: "",
    customerGroupId: "",
  });

  function updateCustomer(event, companyId) {
    const company = companies.find((company) => company.id == companyId);
    if (company) {
      setData({
        name: company.name,
        vatNo: company.vatNo,
        email: company.email,
        walletAddress: company.walletAddress,
        country: company.address.country,
        region: company.address.region,
        city: company.address.city,
        street: company.address.street,
        streetNo: company.address.streetNo,
        postcode: company.address.postcode,
        referenceCustomerCompanyId: companyId,
        days: data.days,
        type: data.type,
        vendorId: apiService.getCompany().id,
        customerGroupId: company.customerGroup.id,
      });
      setFormDisabled(true);
    }
  }
  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getCustomers();
    getCompanies();
    getCustomerGroups();
  }, [UserContext]);

  return (
    <div>
      {/* New Company Form */}
      {/* <div className={`company-form  ${visible ? "visible" : "hidden"}`}>
        <form className="w-50 bg-white  center rounded border p-5">
          <svg
            className="close-btn"
            onClick={() => setVisible(false)}
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>
          <div class="row">
            <div className="col-md-12">
              <select class="form-select  mb-3" aria-label=". example">
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>
                {companies.map((company) => {
                  return (
                    <option
                      selected={data.referenceCompanyId === company.id}
                      value={company.id}
                    >
                      {company.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class="col-md-6">
              <label for="inputCompanyName">Company Name</label>
              <input
                type="text"
                name="name"
                disabled
                onChange={handleChange}
                value={data.name}
                required
                class="form-control"
                id="inputCompanyName"
                placeholder="Alessio"
              ></input>
            </div>
            <div class="col-md-6">
              <label for="inputVatNo">Vat No.</label>
              <input
                disabled
                type="text"
                required
                class="form-control"
                name="vatNo"
                onChange={handleChange}
                value={data.vatNo}
                id="inputVatNo"
                placeholder="Giovannini"
              ></input>
            </div>
          </div>

          <div class="row">
            <div class=" col-md-6">
              <label for="inputEmail4">Email</label>
              <input
                type="email"
                disabled
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                class="form-control"
                id="inputEmail4"
                placeholder="Email"
              ></input>
            </div>
            <div class=" col-md-6">
              <label for="inputWalletAddress">Wallet Address</label>
              <input
                type="text"
                disabled
                required
                name="walletAddress"
                onChange={handleChange}
                value={data.walletAddress}
                class="form-control"
                id="inputWalletAddress"
                placeholder="ABC12223423FSDFADSDFASDC"
              ></input>
            </div>
          </div>

          <div class="row">
            <div className="col-6">
              <label for="inputCountry">Country</label>
              <input
                type="text"
                disabled
                required
                name="country"
                onChange={handleChange}
                value={data.country}
                class="form-control"
                id="inputCountry"
                placeholder="Italy"
              ></input>
            </div>
            <div className="col-4">
              <label for="inputRegion">Region</label>
              <input
                type="text"
                disabled
                required
                name="region"
                onChange={handleChange}
                value={data.region}
                class="form-control"
                id="inputRegion"
                placeholder="Lazio"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputPostCode">Post Code</label>
              <input
                type="text"
                required
                disabled
                name="postcode"
                onChange={handleChange}
                value={data.postcode}
                class="form-control"
                id="inputPostCode"
                placeholder="01-100"
              ></input>
            </div>
          </div>
          <div class="row">
            <div className="col-6">
              <label for="inputCity">City</label>
              <input
                type="text"
                disabled={formDisabled}
                required
                name="city"
                onChange={handleChange}
                value={data.city}
                class="form-control"
                id="inputCity"
                placeholder="Viterbo"
              ></input>
            </div>
            <div className="col-4">
              <label for="inputStreet">Street</label>
              <input
                type="text"
                required
                disabled={formDisabled}
                name="street"
                onChange={handleChange}
                value={data.street}
                class="form-control"
                id="inputStreet"
                placeholder="S. Agostino"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputStreetNo">Street No.</label>
              <input
                type="text"
                required
                name="streetNo"
                onChange={handleChange}
                disabled={formDisabled}
                value={data.streetNo}
                class="form-control"
                id="inputStreetNo"
                placeholder="42/A"
              ></input>
            </div>

            <div className="col-6">
              <label for="inputStreetNo">Payment Terms</label>
              <select
                class="form-select  mb-3"
                onChange={(event) => (data.type = event.target.value)}
                aria-label=". example"
              >
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>

                <option
                // selected={data.type === company.paymentTerm.type}
                >
                  EOF
                </option>
                <option
                // selected={data.type === company.paymentTerm.type}
                >
                  NET
                </option>
              </select>
            </div>

            <div className="col-6">
              <label for="inputDays">Days</label>
              <input
                type="number"
                required
                name="days"
                onChange={handleChange}
                value={data.days}
                class="form-control"
                id="inputDays"
                placeholder="60"
              ></input>
            </div>
          </div>

          <button
            onClick={(event) => CreateCompany(event)}
            type="submit"
            class="btn btn-primary btn-lg btn-block m-2 w-100"
          >
            {data.id ? "Update" : "Create"}
          </button>

          <button
            onClick={(event) => (empty(data), setFormDisabled(false))}
            type="submit"
            class="btn btn-warning btn-lg btn-block m-2 w-100"
          >
            Clear
          </button>
        </form>
      </div>

      <a href="#">
        <svg
          width={36}
          onClick={() => (
            setVisible(true), setData(empty(Object.assign({}, data)))
          )}
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
            fill-rule="nonzero"
          />
        </svg>
      </a> */}
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Company Name</th>
              <th scope="col">VAT No.</th>
              <th scope="col">Wallet Address</th>
              <th scope="col">Email Address</th>
              <th scope="col">Country</th>
              <th scope="col">Region</th>
              <th scope="col">City</th>
              <th scope="col">Post Code</th>
              <th scope="col">Street</th>
              <th scope="col">Street No.</th>
              <th scope="col">Payment Terms</th>
              <th scope="col">Customer Group</th>
              <th scope="col">Catalog</th>
            </tr>
          </thead>
          {customers.length === 0 && (
            <h5 className="absolute-center ">
              Looks like you don't have any customer yet...
            </h5>
          )}
          <tbody>
            {customers.map((company, i) => {
              return (
                <CustomerRow
                  company={company}
                  customerGroups={customerGroups}
                  getCustomers={getCustomers}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
