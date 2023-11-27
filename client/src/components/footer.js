import React, { useEffect } from "react";
import "./../style/footer.css";
function Footer() {
  return (
    <div id="footer">
      <div className="w-50 m-auto">
        <h3>Ethify</h3>

        <div className="footer-info row d-flex justify-content-around">
          <div className="col-6 text-start">
            <p>@Alessio Giovannini</p>
            <p>Italy, Via S. Agostino 42</p>
            <p>2023/10/23</p>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <div
              className="text-start
            "
            >
              <p>Project Thesis</p>
              <p>Streamline AP processes</p>
              <p>S21285</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
