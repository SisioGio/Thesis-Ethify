import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchUserContexts } from "../../App";

function CompaniesTest() {
  const dispatchUserContext = DispatchUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [companies, setCompanies] = useState([]);

  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const getCompanies = async () => {
    try {
      const userId = apiService.getUser().id;
      var res = await apiService.getCompanies(userId);

      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const CreateCompany = async (event) => {
    event.preventDefault();
    try {
      data.userId = apiService.getUser().id;

      if (data.id) {
        var res = await apiService.updateCompany(data);
      } else {
        res = await apiService.createCompany(data);
      }

      dispatch({
        value: true,
        message: `Success, company ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });
      apiService.addCompanyToLocalStorage(res.data);
      getCompanies();
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
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    // alert("Getting companies");
    getCompanies();
  }, []);

  return (
    <div>
      {/* New Company Form */}

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
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                  required
                  class="form-control form-control-sm"
                  id="inputCompanyName"
                  placeholder="Company XYZ"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  class="form-control form-control-sm"
                  name="vatNo"
                  onChange={handleChange}
                  value={data.vatNo}
                  id="inputVatNo"
                  placeholder="IT12345678"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="walletAddress"
                  onChange={handleChange}
                  value={data.walletAddress}
                  class="form-control form-control-sm"
                  id="inputWalletAddress"
                  placeholder="ABC12223423FSDFADSDFASDC"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  required
                  class="form-control form-control-sm"
                  id="inputEmail4"
                  placeholder="Email"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="country"
                  onChange={handleChange}
                  value={data.country}
                  class="form-control form-control-sm"
                  id="inputCountry"
                  placeholder="Italy"
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  required
                  name="region"
                  onChange={handleChange}
                  value={data.region}
                  class="form-control form-control-sm"
                  id="inputRegion"
                  placeholder="Lazio"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="city"
                  onChange={handleChange}
                  value={data.city}
                  class="form-control form-control-sm"
                  id="inputCity"
                  placeholder="Viterbo"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="postcode"
                  onChange={handleChange}
                  value={data.postcode}
                  class="form-control form-control-sm"
                  id="inputPostCode"
                  placeholder="01-100"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="street"
                  onChange={handleChange}
                  value={data.street}
                  class="form-control form-control-sm"
                  id="inputStreet"
                  placeholder="S. Agostino"
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  required
                  name="streetNo"
                  onChange={handleChange}
                  value={data.streetNo}
                  class="form-control form-control-sm"
                  id="inputStreetNo"
                  placeholder="42/A"
                ></input>
              </td>

              <td>
                <button
                  onClick={(event) => CreateCompany(event)}
                  className="table-btn btn btn-success"
                >
                  Save
                </button>
                {/* <button
                  onClick={(event) => CreateCompany(event)}
                  type="submit"
                  class="btn btn-primary btn-block w-100"
                >
                  Create
                </button> */}
              </td>
            </tr>

            {companies.map((company, i) => {
              return (
                <tr
                  onClick={() => (
                    setVisible(true), setData(Object.assign({}, company))
                  )}
                >
                  <th scope="row">{i}</th>
                  <td>{company.name}</td>
                  <td>{company.vatNo}</td>
                  <td>{company.walletAddress}</td>
                  <td>{company.email}</td>
                  <td>{company.address.country}</td>
                  <td>{company.address.region}</td>
                  <td>{company.address.city}</td>
                  <td>{company.address.postcode}</td>
                  <td>{company.address.street}</td>
                  <td>{company.address.streetNo}</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompaniesTest;
