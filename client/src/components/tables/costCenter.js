import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { ShowUserContexts } from "../../App";

function CostCenter() {
  const userContext = ShowUserContexts();
  const [costCenters, setCostCenters] = useState([]);
  const getCostCenters = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getCostCenters(companyId);

      setCostCenters(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createCostCenter = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createCostCenter(data);

      getCostCenters();
    } catch (err) {
      console.log(err);
    }
  };
  const [data, setData] = useState({
    code: "",
    name: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getCostCenters();
  }, [userContext]);

  return (
    <div className=" d-flex justify-center flex-column p-0">
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Cost Center Code</th>
              <th scope="col">Cost Center Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {" "}
                <input
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={data.code}
                  required
                  class="form-control"
                  id="inputCostCenterCode"
                  placeholder="100190"
                ></input>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  required
                  class="form-control"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                  id="inputCostCenterName"
                  placeholder="Tools"
                ></input>
              </td>
              <td>
                {" "}
                <button
                  onClick={(event) => createCostCenter(event)}
                  type="submit"
                  class="btn btn-success  btn-block  w-100"
                >
                  Create
                </button>
              </td>
            </tr>

            {costCenters.map((costCenter, i) => {
              return (
                <tr>
                  <td>{costCenter.code}</td>
                  <td>{costCenter.name}</td>
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

export default CostCenter;
