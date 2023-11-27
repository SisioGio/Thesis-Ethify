import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchUserContexts, ShowUserContexts } from "../../App";
import CustomerGroupForm from "./customerGroupForm";
import TaxValueRow from "./taxValueRow";
import "./../../style/taxcode.css";
function TaxCodes() {
  const userContext = ShowUserContexts();
  const feedback = DispatchFeedbackContexts();
  const [taxData, setTaxData] = useState({
    code: "",
    name: "",
  });
  const [taxValues, setTaxValues] = useState([]);

  const addTaxCode = async (event) => {
    event.preventDefault();
    try {
      let companyId = apiService.getCompany().id;
      taxData.companyId = companyId;
      let res = await apiService.addTaxCode(taxData);
      feedback({
        type: "Success",
        message: "Success! New tax code added",
      });
      console.log(res.data);

      getTaxValues();
    } catch (err) {
      console.log(err);
      feedback({
        type: "Error",
        message: `Ops! Something went wrong while creating the tax code. (${
          err.response.data.message
            ? err.response.data.message
            : "Error from server"
        })`,
      });
    }
  };

  const getTaxValues = async () => {
    try {
      let res = await apiService.getTaxValues(apiService.getCompany().id);
      console.log(res.data);
      setTaxValues(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setTaxData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  const test = () => {
    alert("Hello from parent");
  };
  useEffect(() => {
    getTaxValues();
  }, [userContext]);
  return (
    <div>
      <div className="tax-code-form d-flex  justify-content-between text-white">
        <form className="  ">
          <div class="row">
            <div class="col-5 d-flex">
              <label
                for="inputTaxCode"
                className="text-nowrap d-flex align-items-center mx-2"
              >
                Tax Code
              </label>
              <input
                type="text"
                name="code"
                onChange={handleChange}
                value={taxData.code.toUpperCase()}
                required
                class="form-control"
                id="inputTaxCode"
                placeholder="1D"
              ></input>
            </div>
            <div class="col-5 d-flex">
              <label
                for="inputTaxCodeName"
                className="text-nowrap d-flex align-items-center  mx-2"
              >
                Tax Code Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={taxData.name}
                required
                class="form-control"
                id="inputTaxCodeName"
                placeholder="Sale of goods"
              ></input>
            </div>
            <button
              onClick={(event) => addTaxCode(event)}
              type="submit"
              class="btn btn-primary  col-2 "
            >
              Create
            </button>
          </div>
        </form>

        <CustomerGroupForm test={test} refreshData={getTaxValues} />
      </div>

      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Customer Group Code</th>
              <th scope="col">Tax Code</th>
              <th scope="col">Percentage</th>

              <th scope="col">Save</th>
            </tr>
          </thead>
          <tbody>
            {taxValues.map((tax, i) => {
              return <TaxValueRow refreshData={getTaxValues} row={tax} i={i} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaxCodes;
