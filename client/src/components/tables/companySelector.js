import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { DispatchCartContexts, ShowCartContexts } from "../../App";
import {
  DispatchFeedbackContexts,
  DispatchUserContexts,
  ShowUserContexts,
} from "../../App";
function CompanySelector() {
  const [expand, setExpand] = useState(false);
  const [items, setItems] = useState([]);
  const [company, setCompany] = useState(null);
  const dispatchUserContexts = DispatchUserContexts();
  const UserContext = ShowUserContexts();
  const cartDispatch = DispatchCartContexts();
  const [selected, setSelected] = useState(items ? items[0] : null);

  const setSelectedCompany = (company) => {
    apiService.setCompany(company.id);
    setCompany(company);
    dispatchUserContexts({
      data: UserContext.data,
      authenticated: UserContext.authenticated,
      companies: UserContext.companies,
      selectedCompany: company,
    });
    cartDispatch({
      cart: apiService.getCompanyCart(),
    });

    setCompany(company);
  };

  const getCompanies = () => {
    const user = apiService.getUser();
    var items;
    if (user && user.companies) {
      items = user.companies;
    } else {
      items = [];
    }

    if (!company) {
      var newCompany = apiService.getCompany();
      if (!newCompany) {
        if (user.companies.length > 0) {
          newCompany = items[0];
        } else {
          newCompany = null;
        }
      }
    }
    setSelectedCompany(newCompany);
    setItems(items);

    // getCurrentCompany();
  };

  const getCurrentCompany = () => {
    if (!company) {
      var company = apiService.getCompany();
      if (!company & (items.length > 0)) {
        company = items[0];
      }
      setCompany(company);
      dispatchUserContexts({
        data: UserContext.data,
        authenticated: UserContext.authenticated,
        companies: UserContext.companies,
        selectedCompany: company,
      });
      cartDispatch({
        cart: apiService.getCompanyCart(),
      });
    }
  };
  useEffect(() => {}, [expand]);
  useEffect(() => {
    getCompanies();
    // getCurrentCompany();
  }, []);

  return (
    <li className="company-selector nav-item vertical-alig">
      <a className="nav-link" href="#" onClick={() => setExpand(!expand)}>
        {company && company.name}
      </a>
      <div className="options">
        {expand &&
          items.map((item) => {
            return (
              <div
                className={`selector-option ${
                  company.id === item.id && "link-active"
                }`}
                onClick={() => (setSelectedCompany(item), setExpand(false))}
              >
                {item.name}
              </div>
            );
          })}
      </div>
    </li>
  );
}

export default CompanySelector;
