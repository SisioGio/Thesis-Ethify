import React, { useEffect, useState } from "react";

import apiService from "../../services/apiService";

import { ShowUserContexts } from "../../App";

function BusinessLine() {
  const userContext = ShowUserContexts();
  const [businessLines, setBusinessLines] = useState([]);
  const getBusinessLines = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getBusinessLines(companyId);

      setBusinessLines(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createBusinessLine = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createBusinessLine(data);

      getBusinessLines();
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
    console.log("State changed from dimension cmponents");
    getBusinessLines();
  }, [userContext]);

  return (
    <div className=" d-flex justify-center flex-column p-0">
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Business Line Code</th>
              <th scope="col">Business Line Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>
                {" "}
                <input
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={data.code}
                  required
                  class="form-control form-control-sm"
                  id="inputBusinessLineCode"
                  placeholder="BL18"
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  required
                  class="form-control form-control-sm m-0"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                  id="inputBusinessLineName"
                  placeholder="Tools"
                ></input>
              </td>

              <td>
                <button
                  onClick={(event) => createBusinessLine(event)}
                  type="submit"
                  class="form-control-sm btn btn-success  btn-block w-100 "
                >
                  Create
                </button>
              </td>
            </tr>

            {businessLines.map((businessLine, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{businessLine.code}</td>
                  <td>{businessLine.name}</td>
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

export default BusinessLine;
