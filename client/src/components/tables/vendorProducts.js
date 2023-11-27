import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { DispatchCartContexts, ShowCartContexts } from "../../App";
import { ShowUserContexts } from "../../App";
import { Link, Navigate, useLocation } from "react-router-dom";
function VendorProducts() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const vendorId = params.get("vendorId");
  const [quantity, setQuantity] = useState(0);
  const cartDispatch = DispatchCartContexts();
  const userContext = ShowUserContexts();
  const getComapanyProducts = async () => {
    try {
      var res = await apiService.getProduct(vendorId);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createOrder = () => {};
  useEffect(() => {
    getComapanyProducts();
  }, []);

  return (
    <div>
      {vendorId === userContext.selectedCompany && <Navigate to={"/vendors"} />}

      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content text-center">
            <div class="modal-header justify-content-center">
              <h3 class="modal-title text-center " id="exampleModalLongTitle">
                Confirm Order
              </h3>
            </div>
            {selectedProduct && (
              <div class="modal-body">
                <p>
                  You're about to order the{" "}
                  {selectedProduct.type === "Product"
                    ? " product"
                    : "service" + " " + selectedProduct.name}
                </p>

                <div>
                  <label for="inputQuantity">Enter the desired quantity</label>
                  <input
                    type="number"
                    required
                    name="quantity"
                    class="form-control"
                    id="inputQuantity"
                    disabled={selectedProduct.type === "Service"}
                    // disabled={selectedProduct.type === "Service"}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="123456"
                  ></input>
                </div>
              </div>
            )}

            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => (
                  apiService.addProductToCart(
                    selectedProduct,
                    selectedProduct.type === "Service" ? 1 : quantity
                  ),
                  cartDispatch({
                    cart: apiService.getCompanyCart(),
                  })
                )}
                type="button"
                class="btn btn-success"
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
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
              <th scope="col">Order</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.cost}</td>
                  <td>{product.type}</td>
                  <td>{product.unitOfMeasure}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalCenter"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Order
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendorProducts;
