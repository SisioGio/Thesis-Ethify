import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/dashboard.css";
import "./../../style/companies.css";
import { Link } from "react-router-dom";
import { ShowUserContexts } from "../../App";
function CustomerRow({ company, customerGroups, getCustomers }) {
  const feedback = DispatchFeedbackContexts();
  const [form, setForm] = useState({
    customerGroupId: company.customerGroupId,
    referenceCustomerCompanyId: company.referenceCustomerCompanyId,
    vendorId: company.vendorId,
    id: company.id,
  });

  const updateCustomerGroup = async () => {
    try {
      await apiService.updateCustomer(form);
      feedback({
        type: "Success",
        message: "Success! Customer group saved!",
      });
      getCustomers();
    } catch (err) {
      console.log(err);
      feedback({
        type: "Error",
        message: `Ops! Something went wrong while saving the customer group. (${
          err.response.data.message
            ? err.response.data.message
            : "Error from server"
        })`,
      });
    }
  };
  function handleChange(event) {
    const { value, name } = event.target;

    setForm((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  return (
    <tr>
      <th scope="row">{company.id}</th>
      <td>{company.referenceCustomerCompany.name}</td>
      <td>{company.referenceCustomerCompany.vatNo}</td>
      <td>{company.referenceCustomerCompany.walletAddress}</td>
      <td>{company.referenceCustomerCompany.email}</td>
      <td>{company.referenceCustomerCompany.address.country}</td>
      <td>{company.referenceCustomerCompany.address.region}</td>
      <td>{company.referenceCustomerCompany.address.city}</td>
      <td>{company.referenceCustomerCompany.address.postcode}</td>
      <td>{company.referenceCustomerCompany.address.street}</td>
      <td>{company.referenceCustomerCompany.address.streetNo}</td>
      <td>{company.paymentTerm.type + " " + company.paymentTerm.days}</td>
      <td className={form.customerGroupId ? "" : "bg-danger"}>
        <div className="row ">
          <div className="col-8">
            <select
              class="form-select  mb-3"
              onChange={(event) => (form.customerGroupId = event.target.value)}
              aria-label=". example"
            >
              <option selected={form.customerGroupId === ""} value>
                {" "}
                -- select an option --{" "}
              </option>

              {customerGroups.map((customerGroup) => {
                return (
                  <option
                    selected={form.customerGroupId === customerGroup.id}
                    value={customerGroup.id}
                  >
                    {customerGroup.code}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-4">
            <button
              type="button"
              class="btn btn-success"
              onClick={() => updateCustomerGroup()}
            >
              Update
            </button>
          </div>
        </div>
      </td>
      <td>
        <Link to={`/products?vendorId=${company.id}`}>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M7 16.462l1.526-.723c1.792-.81 2.851-.344 4.349.232 1.716.661 2.365.883 3.077 1.164 1.278.506.688 2.177-.592 1.838-.778-.206-2.812-.795-3.38-.931-.64-.154-.93.602-.323.818 1.106.393 2.663.79 3.494 1.007.831.218 1.295-.145 1.881-.611.906-.72 2.968-2.909 2.968-2.909.842-.799 1.991-.135 1.991.72 0 .23-.083.474-.276.707-2.328 2.793-3.06 3.642-4.568 5.226-.623.655-1.342.974-2.204.974-.442 0-.922-.084-1.443-.25-1.825-.581-4.172-1.313-6.5-1.6v-5.662zm-1 6.538h-4v-8h4v8zm15-11.497l-6.5 3.468v-7.215l6.5-3.345v7.092zm-7.5-3.771v7.216l-6.458-3.445v-7.133l6.458 3.362zm-3.408-5.589l6.526 3.398-2.596 1.336-6.451-3.359 2.521-1.375zm10.381 1.415l-2.766 1.423-6.558-3.415 2.872-1.566 6.452 3.558z" />
          </svg>
        </Link>
      </td>
    </tr>
  );
}

export default CustomerRow;
