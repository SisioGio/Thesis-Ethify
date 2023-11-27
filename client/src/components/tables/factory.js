import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

import { ShowCartContexts } from "../../App";

function Factory() {
  const userContext = ShowCartContexts();
  const [factories, setFactories] = useState([]);
  const getFactories = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getFactories(companyId);

      setFactories(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createFactory = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createFactory(data);

      getFactories();
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
    getFactories();
  }, [userContext]);

  return (
    <div className=" d-flex justify-center flex-column p-0">
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Factory Code</th>
              <th scope="col">Factory Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={data.code}
                  required
                  class="form-control"
                  id="inputFactoryCode"
                  placeholder="LMN"
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
                  id="inputFactoryName"
                  placeholder="Limena"
                ></input>
              </td>
              <td>
                {" "}
                <button
                  onClick={(event) => createFactory(event)}
                  type="submit"
                  class="btn btn-success  btn-block w-100"
                >
                  Create
                </button>
              </td>
            </tr>

            {factories.map((factory, i) => {
              return (
                <tr>
                  <td>{factory.code}</td>
                  <td>{factory.name}</td>
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

export default Factory;
