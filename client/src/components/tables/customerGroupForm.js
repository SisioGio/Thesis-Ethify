import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

function CustomerGroupForm(props) {
  const feedback = DispatchFeedbackContexts();
  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const addCustomerGroup = async (event) => {
    event.preventDefault();
    try {
      let companyId = apiService.getCompany().id;
      form.companyId = companyId;
      let res = await apiService.createCustomerGroup(form);
      feedback({
        type: "Success",
        message: "Success! New customer group added",
      });

      props.refreshData();

      console.log(res.data);
    } catch (err) {
      feedback({
        type: "Error",
        message: `Ops! Something went wrong while creating the customer group. (${
          err.response.data.message
            ? err.response.data.message
            : "Error from server"
        })`,
      });
      console.log("Error while creating group");
      console.log(err);
    }
  };

  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setForm((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  return (
    <form className="">
      <div class="row">
        <div class="col-5 d-flex">
          <label
            for="inputCustomerGroupCode"
            className="text-nowrap d-flex align-items-center  mx-2"
          >
            Customer Group
          </label>
          <input
            type="text"
            name="code"
            onChange={handleChange}
            value={form.code}
            required
            class="form-control"
            id="inputCustomerGroupCode"
            placeholder="LOCAL/UE/EXTRA-UE"
          ></input>
        </div>

        <div class="col-5 d-flex">
          <label
            for="inputCustomerGroupName"
            className="text-nowrap d-flex align-items-center  mx-2"
          >
            Customer Group Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={form.name}
            required
            class="form-control"
            id="inputCustomerGroupName"
            placeholder="LOCAL/UE/EXTRA-UE"
          ></input>
        </div>
        <button
          onClick={(event) => addCustomerGroup(event)}
          type="submit"
          class="btn btn-primary btn-block  col-2"
        >
          Create
        </button>
      </div>
    </form>
  );
}

export default CustomerGroupForm;
