import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import "./../../style/dashboard.css";
import "./../../style/companies.css";
import BusinessLine from "./businessLine";
import Factory from "./factory";
import CostCenter from "./costCenter";
import TaxCodes from "./taxCodes";

import { ShowUserContexts } from "../../App";
function GenericDimensions() {
  const userContext = ShowUserContexts();

  return (
    <div className="dimensions row">
      <div className="col-4 p-0">
        <h5>Business Lines</h5>
        <BusinessLine />
      </div>
      <div className="col-4 p-0">
        <h5>Factories</h5>
        <Factory />
      </div>

      <div className="col-4 p-0">
        <h5>Cost Centers</h5>
        <CostCenter />
      </div>

      {/* <div className="col-3">
        Tax Codes
        <TaxCodes />
      </div> */}
    </div>
  );
}

export default GenericDimensions;
