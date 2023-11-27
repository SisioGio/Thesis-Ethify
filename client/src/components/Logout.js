import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import apiService from "../services/apiService";
import { DispatchUserContexts } from "../App";

function Logout() {
  const userAuthDispatcher = DispatchUserContexts();
  const logoutUser = (e) => {
    apiService.logout();
    userAuthDispatcher({
      authenticated: false,
      data:{},
      companies:[],
    });
  };
  useEffect(() => {
    logoutUser();
  }, []);
  return <Navigate to="/" />;
}

export default Logout;
