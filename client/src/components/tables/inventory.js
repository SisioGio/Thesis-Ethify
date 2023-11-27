import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/dashboard.css";
import "./../../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../../App";

function Inventory() {
  const dispatchUserContext = DispatchUserContexts();
  const showUserContext = ShowUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [taxCodes, setTaxCodes] = useState([]);
  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const getTaxCodes = async () => {
    try {
      let res = await apiService.getTaxCodes(apiService.getCompany().id);
      setTaxCodes(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getProducts = async () => {
    try {
      const companyId = showUserContext.selectedCompany;
      var res = await apiService.getProduct(apiService.getCompany().id);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const addProduct = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      if (data.id) {
        var res = await apiService.updateProduct(data);
      } else {
        res = await apiService.addProduct(data);
      }

      dispatch({
        value: true,
        message: `Success, product ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });

      getProducts();
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
    description: "",
    price: "",
    cost: "",
    quantity: "",
    type: "",
    unitOfMeasure: "",
    taxCodeId: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    // alert("Getting companies");
    getProducts();
    getTaxCodes();
  }, [showUserContext]);

  return (
    <div>
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Cost</th>
              <th scope="col">Type</th>
              <th scope="col">unitOfMeasure</th>
              <th scope="col">Quantity</th>
              <th scope="col">Tax Code</th>
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
                  class="form-control"
                  id="inputProductName"
                  placeholder="Energy"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  class="form-control"
                  name="description"
                  onChange={handleChange}
                  value={data.description}
                  id="inputDescription"
                  placeholder="Product description"
                ></input>
              </td>
              <td>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={data.price}
                  required
                  class="form-control"
                  id="inputPrice"
                  placeholder="99.99"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="number"
                  required
                  name="cost"
                  onChange={handleChange}
                  value={data.cost}
                  class="form-control"
                  id="inputcost"
                  placeholder="50.00"
                ></input>
              </td>
              <td>
                {" "}
                <select
                  onChange={(event) => (data.type = event.target.value)}
                  class="form-control "
                >
                  <option value> -- select an option -- </option>

                  <option selected={data.type === "Product"}>Product</option>
                  <option selected={data.type === "Service"}>Service</option>
                </select>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  name="unitOfMeasure"
                  onChange={handleChange}
                  value={data.unitOfMeasure}
                  class="form-control"
                  id="inputunitOfMeasure"
                  placeholder="KG"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="number"
                  required
                  name="quantity"
                  onChange={handleChange}
                  value={data.quantity}
                  class="form-control"
                  id="inputQuantity"
                  placeholder="100"
                ></input>
              </td>
              <td>
                <select
                  class="form-select "
                  onChange={(event) => (data.taxCodeId = event.target.value)}
                  aria-label=". example"
                >
                  <option selected={data.name === ""} value>
                    {" "}
                    -- select an option --{" "}
                  </option>

                  {taxCodes.map((taxCode) => {
                    return (
                      <option
                        value={taxCode.id}
                        selected={data.taxCodeId == taxCode.id}
                      >
                        {taxCode.code}
                      </option>
                    );
                  })}
                </select>
              </td>

              <td className="d-flex gap-2">
                <a
                  href="#"
                  className={`btn ${data.id ? "btn-info" : "btn-success"}`}
                  onClick={(event) => addProduct(event)}
                >
                  {data.id ? "Update" : "Save"}
                </a>

                <a
                  href="#"
                  className="btn btn-danger"
                  onClick={(event) => setData(empty(Object.assign({}, data)))}
                >
                  Clear
                </a>
              </td>
            </tr>

            {products.map((product, i) => {
              return (
                <tr onClick={() => setData(Object.assign({}, product))}>
                  <th scope="row">{i}</th>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.cost}</td>
                  <td>{product.type}</td>
                  <td>{product.unitOfMeasure}</td>
                  <td>{product.quantity}</td>
                  <td>{product.taxCode ? product.taxCode.code : "MISSING"}</td>
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

export default Inventory;
