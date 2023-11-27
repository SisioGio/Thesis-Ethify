import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/dashboard.css";
import "./../../style/companies.css";
import { Link } from "react-router-dom";
import { ShowUserContexts } from "../../App";
function Vendors() {
  const [vendors, setVendors] = useState([]);
  const UserContext = ShowUserContexts();
  const [companies, setCompanies] = useState([]);
  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const getCompanies = async () => {
    try {
      const userId = apiService.getUser().id;
      var res = await apiService.getCompanies(userId);
      const customerId = apiService.getCompany().id;
      const filtered_companies = res.data.filter(
        (company) => company.id != customerId
      );
      console.log({ companies: filtered_companies });
      setCompanies(filtered_companies);
    } catch (err) {
      console.log(err);
    }
  };

  const getVendors = async () => {
    try {
      const customerId = apiService.getCompany().id;
      var res = await apiService.getVendors(customerId);
      console.log(res.data);
      setVendors(res.data);
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
      data.customerId = apiService.getCompany().id;
      let res = await apiService.addVendor(data);

      dispatch({
        value: true,
        message: `Success, vendor ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });

      getVendors();
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
    referenceVendorCompanyId: "",
    customerId: apiService.getCompany().id,
    type: "",
    days: "",
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
        referenceVendorCompanyId: companyId,
        days: data.days,
        type: data.type,
        customerId: apiService.getCompany().id,
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
    getVendors();
    getCompanies();
  }, [UserContext]);

  return (
    <div>
      <div className="list text-sm">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" className="text-nowrap">
                Company Name
              </th>
              <th scope="col" className="text-nowrap">
                VAT No.
              </th>
              <th scope="col" className="text-nowrap">
                Wallet Address
              </th>
              <th scope="col" className="text-nowrap">
                Email Address
              </th>
              <th scope="col" className="text-nowrap">
                Country
              </th>
              <th scope="col" className="text-nowrap">
                Region
              </th>
              <th scope="col" className="text-nowrap">
                City
              </th>
              <th scope="col" className="text-nowrap">
                Post Code
              </th>
              <th scope="col" className="text-nowrap">
                Street
              </th>
              <th scope="col" className="text-nowrap">
                Street No.
              </th>
              <th scope="col" className="text-nowrap">
                Payment Terms
              </th>
              <th scope="col" className="text-nowrap">
                Days
              </th>
              <th scope="col" className="text-nowrap">
                Catalog
              </th>
              <th scope="col" className="text-nowrap">
                Action
              </th>
            </tr>
          </thead>

          {vendors.length === 0 && (
            <h5 className="absolute-center ">
              Looks like you don't have any vendor yet...
            </h5>
          )}
          <tbody>
            <tr>
              <th scope="row ">
                <select
                  class="form-select form-control-sm text-nowrap  text-sm"
                  onChange={(event) =>
                    updateCustomer(event, event.target.value)
                  }
                  aria-label=". example"
                >
                  <option selected={data.name === ""} value>
                    {" "}
                    Select
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
              </th>
              <td className="">{data.name}</td>
              <td>{data.vatNo}</td>
              <td>{data.walletAddress}</td>
              <td>{data.email}</td>
              <td>{data.country}</td>
              <td>{data.region}</td>
              <td>{data.city}</td>
              <td>{data.postcode}</td>
              <td>{data.street}</td>
              <td>{data.streetNo}</td>
              <td>
                <select
                  class="form-select form-control-sm  text-sm"
                  onChange={(event) => (data.type = event.target.value)}
                  aria-label=". example"
                >
                  <option selected={data.name === ""} value>
                    {" "}
                    -- select an option --{" "}
                  </option>

                  <option>EOM</option>
                  <option>NET</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  required
                  name="days"
                  onChange={handleChange}
                  value={data.days}
                  class="form-control form-control-sm  text-sm"
                  id="inputDays"
                  placeholder="60"
                ></input>
              </td>
              <td></td>
              <td className="p-0 d-flex">
                <button
                  onClick={(event) => CreateCompany(event)}
                  type="submit"
                  class="btn btn-primary  text-sm"
                >
                  {data.id ? "Update" : "Create"}
                </button>

                <button
                  onClick={(event) => (empty(data), setFormDisabled(false))}
                  type="submit"
                  class="btn btn-warning   text-sm "
                >
                  Clear
                </button>
              </td>
            </tr>

            {vendors.map((company, i) => {
              return (
                <tr>
                  <th scope="row">{company.id}</th>
                  <td>{company.referenceVendorCompany.name}</td>
                  <td>{company.referenceVendorCompany.vatNo}</td>
                  <td>{company.referenceVendorCompany.walletAddress}</td>
                  <td>{company.referenceVendorCompany.email}</td>
                  <td>{company.referenceVendorCompany.address.country}</td>
                  <td>{company.referenceVendorCompany.address.region}</td>
                  <td>{company.referenceVendorCompany.address.city}</td>
                  <td>{company.referenceVendorCompany.address.postcode}</td>
                  <td>{company.referenceVendorCompany.address.street}</td>
                  <td>{company.referenceVendorCompany.address.streetNo}</td>
                  <td>{company.paymentTerm.type}</td>
                  <td>{company.paymentTerm.days}</td>
                  <td>
                    <Link
                      to={`/products?vendorId=${company.referenceVendorCompanyId}`}
                    >
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

export default Vendors;
