import React, { useState } from "react";
import apiService from "../services/apiService";
import "./../style/login.css";
import { DispatchFeedbackContexts } from "../App";
import { Link, Navigate } from "react-router-dom";
function Signup() {
  const dispatch = DispatchFeedbackContexts();
  const [isSuccess, setIsSuccess] = useState(false);
  const CreateCompany = async (event) => {
    event.preventDefault();
    try {
      await apiService.signup(data);
      dispatch({
        value: true,
        message: `Success, your account has been created, please login.`,
        type: "Success",
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
    name: "",
    surname: "",
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
      {isSuccess ? <Navigate to="/signin" /> : null}
      <form className="w-50 center rounded border p-5">
        <h5>Create an account</h5>
        <div class="row">
          <div class="col-md-6 py-3">
            <label for="inputName">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              class="form-control"
              id="inputName"
              placeholder="Alessio"
            ></input>
          </div>
          <div class="col-md-6 py-3">
            <label for="inputSurname">Surname</label>
            <input
              type="text"
              required
              class="form-control"
              name="surname"
              onChange={handleChange}
              value={data.surname}
              id="inputCompanyVat"
              placeholder="Giovannini"
            ></input>
          </div>
        </div>

        <div class="row">
          <div class=" col-md-6 py-3 ">
            <label for="inputEmail4" className="text-start">
              Email
            </label>
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
          <div class=" col-md-6 py-3">
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
          onClick={(event) => CreateCompany(event)}
          type="submit"
          class="btn btn-primary btn-lg btn-block mt-3 w-100"
        >
          Sign Up
        </button>
        <Link to="/signin">
          <small>Need an account? Sign In!</small>
        </Link>
      </form>
    </div>
  );
}

export default Signup;
