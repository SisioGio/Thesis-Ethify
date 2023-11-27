import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/dashboard.css";
import "./../../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../../App";

function Account() {
  const UserContext = ShowUserContexts();
  const [accounts, setAccounts] = useState([]);
  const getAccounts = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getAccounts(companyId);

      setAccounts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createAccount = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createAccount(data);

      getAccounts();
    } catch (err) {
      console.log(err);
    }
  };
  const [data, setData] = useState({
    code: "",
    name: "",
    isNode: false,
    type: "Asset",
  });

  function handleChange(event) {
    var { value, name } = event.target;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }
    console.log(value);
    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getAccounts();
  }, [UserContext]);

  return (
    <div className=" d-flex justify-center flex-column">
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Account Code</th>
              <th scope="col">Account Name</th>
              <th scope="col">IsNode</th>
              <th scope="col">Type</th>
              <th scope="col">Balance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>

              <td>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="code"
                  onChange={handleChange}
                  value={data.code}
                />
              </td>
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="isNode"
                  onChange={handleChange}
                  checked={data.isNode}
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="type"
                  disabled
                  onChange={handleChange}
                  value={data.type}
                />
              </td>
              <td>
                <input type="number" class="form-control" disabled value={0} />
              </td>
              <td>
                <a
                  href="#"
                  type="btn"
                  className="btn btn-success"
                  onClick={(event) => createAccount(event)}
                >
                  Save
                </a>
              </td>
            </tr>
            {accounts.map((account, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{account.code}</td>
                  <td>{account.name}</td>
                  <td>
                    <input type="checkbox" checked={account.isNode} disabled />
                  </td>
                  <td>{account.type}</td>
                  <td>{account.balance}</td>
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

export default Account;
