import React, { useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import { Link, Navigate, useLocation } from "react-router-dom";
import { DispatchUserContexts } from "../App";

import apiService from "../services/apiService";
function Signin() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const requestedUrl = params.get("requestedRoute");
  const dispatch = DispatchFeedbackContexts();
  const UserDispatcher = DispatchUserContexts();
  const [isSuccess, setIsSuccess] = useState(false);
  const Login = async (event) => {
    event.preventDefault();
    try {
      let res = await apiService.signin(data);

      dispatch({
        value: true,
        message: `Success, you're logged in!`,
        type: "Success",
      });
      console.log(res);
      UserDispatcher({
        authenticated: true,
        data: res.data,
        companies: res.data.companies,
      });

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
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  return (
    <div id="signin" className="full-screen bg-1">
      {isSuccess ? (
        requestedUrl ? (
          <Navigate to={"/" + requestedUrl} />
        ) : (
          <Navigate to="/" />
        )
      ) : null}
      <form className="w-25 center  p-5">
        <h5 className="text-bold">Sign In to Ethify</h5>
        <div class="row">
          <div class=" col-12 py-3">
            <label for="inputEmail4">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              class="form-control"
              id="inputEmail4"
              placeholder="Email"
            ></input>
          </div>
          <div class=" col-12 py-3">
            <label for="inputPassword4">Password</label>
            <input
              type="password"
              required
              name="password"
              onChange={handleChange}
              value={data.password}
              class="form-control"
              id="inputPassword4"
              placeholder="Password"
            ></input>
          </div>
        </div>

        <button
          onClick={(event) => Login(event)}
          type="submit"
          class="btn btn-primary btn-lg btn-block mt-3 mb-1 w-100"
        >
          Sign In
        </button>

        <Link to="/signup">
          <small>Need an account? Sign Up!</small>
        </Link>
      </form>
    </div>
  );
}

export default Signin;
