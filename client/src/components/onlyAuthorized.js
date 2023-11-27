import React, { useEffect, useState } from "react";
import { Navigate, Route, useSearchParams } from "react-router-dom";
import apiService from "./../services/apiService";
import { DispatchUserContexts } from "../App";
function ProtectedRoute({ children, requestedRoute }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userContext = DispatchUserContexts();
  const checkIfIsAuthenticated = async () => {
    if (!apiService.getCurrentUser()) {
      setIsAuthenticated(false);
    }

    await apiService

      .isAuthenticated()
      .then((res) => {
        console.log({ res: res });
        setIsAuthenticated(true);
        userContext({
          data: res.data,
          companies: res.data.companies,
          authenticated: true,
          selectedCompany: "",
        });
      })
      .catch((error) => {
        console.log({ resError: error });
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    checkIfIsAuthenticated();
  }, []);

  if (isAuthenticated != null) {
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to={"/signin?requestedRoute=" + requestedRoute} />
    );
  }
}

export default ProtectedRoute;
