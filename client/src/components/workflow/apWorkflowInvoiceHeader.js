import React from "react";

import moment from "moment";

function InvoiceHeader({ invoice }) {
  return (
    <div className="d-flex border rounded ">
      <form className="p-2">
        <div class="row">
          <div class="col py-3">
            <label for="inputCompanyName">Company Name</label>
            <input
              type="text"
              name="name"
              disabled
              value={invoice.vendor.name}
              required
              class="form-control form-control-sm"
              id="inputCompanyName"
            ></input>
          </div>
          <div class="col py-3">
            <label for="inputVatNo">Vat No.</label>
            <input
              disabled
              type="text"
              required
              class="form-control form-control-sm"
              name="vatNo"
              value={invoice.vendor.identificator}
              id="inputVatNo"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputCountry">Country</label>
            <input
              type="text"
              disabled
              required
              name="country"
              value={invoice.vendor.address.country}
              class="form-control form-control-sm"
              id="inputCountry"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputPostCode" className="text-nowrap">
              Post Code
            </label>
            <input
              type="text"
              required
              disabled
              name="postcode"
              value={invoice.vendor.address.postcode}
              class="form-control form-control-sm"
              id="inputPostCode"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputCity">City</label>
            <input
              disabled
              type="text"
              required
              name="city"
              value={invoice.vendor.address.city}
              class="form-control form-control-sm"
              id="inputCity"
            ></input>
          </div>
          <div className="col py-3">
            <label for="inputStreet">Street</label>
            <input
              disabled
              type="text"
              required
              name="street"
              value={invoice.vendor.address.street}
              class="form-control form-control-sm"
              id="inputStreet"
            ></input>
          </div>
          <div className="col py-3">
            <label for="inputStreetNo">Street No.</label>
            <input
              disabled
              type="text"
              required
              name="streetNo"
              value={invoice.vendor.address.streetNo}
              class="form-control form-control-sm"
              id="inputStreetNo"
            ></input>
          </div>
        </div>

        <div class="row">
          <div class="col py-3">
            <label for="inputInvoiceNo">Invoice No.</label>
            <input
              type="text"
              name="name"
              disabled
              value={invoice.documentNo}
              required
              class="form-control form-control-sm"
              id="inputInvoiceNo"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputStreetNo">PO</label>
            <input
              disabled
              type="text"
              required
              name="streetNo"
              value={invoice.purchaseOrder}
              class="form-control form-control-sm"
              id="inputStreetNo"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputStreetNo">Delivery Note</label>
            <input
              disabled
              type="text"
              required
              name="deliveryNote"
              value={invoice.deliveryNote}
              class="form-control form-control-sm"
              id="inputStreetNo"
            ></input>
          </div>
          <div className="col py-3">
            <label for="inputPostCode">Document Date</label>
            <input
              type="text"
              required
              disabled
              name="postcode"
              value={moment(invoice.documentDate).format("DD.MM.yyyy")}
              class="form-control form-control-sm"
              id="inputPostCode"
            ></input>
          </div>
          <div className="col py-3">
            <label for="inputPostCode">Due Date</label>
            <input
              type="text"
              required
              disabled
              name="postcode"
              value={moment(invoice.dueDate).format("DD.MM.yyyy")}
              class="form-control form-control-sm"
              id="inputPostCode"
            ></input>
          </div>
        </div>

        <div className="row">
          {/* <div className="col-6 py-3">
            <label for="inputStreetNo">Wallet Address</label>
            <input
              disabled
              type="text"
              required
              name="streetNo"
              value={invoice.walletAddress}
              class="form-control form-control-sm"
              id="inputStreetNo"
            ></input>
          </div> */}

          <div class="col py-3">
            <label for="inputVatNo">Total Net Amount</label>
            <input
              disabled
              type="text"
              required
              class="form-control form-control-sm"
              name="vatNo"
              value={invoice.netAmount}
              id="inputVatNo"
            ></input>
          </div>
          <div class="col py-3">
            <label for="inputVatNo">Shipping Charges</label>
            <input
              disabled
              type="text"
              required
              class="form-control form-control-sm"
              name="vatNo"
              value={invoice.freightCharge}
              id="inputVatNo"
            ></input>
          </div>
          <div class="col py-3">
            <label for="inputVatNo">Rounding</label>
            <input
              disabled
              type="text"
              required
              class="form-control form-control-sm"
              name="vatNo"
              value={invoice.priceRounding}
              id="inputVatNo"
            ></input>
          </div>

          <div className="col py-3">
            <label for="inputCountry">Total Vat Amount</label>
            <input
              type="text"
              disabled
              required
              name="country"
              value={invoice.taxAmount}
              class="form-control form-control-sm"
              id="inputCountry"
            ></input>
          </div>
          <div className="col py-3">
            <label for="inputRegion">Total Gross Amount</label>
            <input
              type="text"
              disabled
              required
              name="region"
              value={invoice.totalAmount}
              class="form-control form-control-sm"
              id="inputRegion"
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceHeader;
