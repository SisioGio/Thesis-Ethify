import React, { useEffect, useState } from "react";
import WorkflowInvoiceLine from "../old/apWorkflowInvoiceLine";
import "./../../style/workflow.css";
import apiService from "../../services/apiService";
import moment from "moment";
import { useParams } from "react-router-dom";
import LoadingScreen from "../loadingScreen";
import InvoiceHeader from "./apWorkflowInvoiceHeader";
import InvoiceLineItems from "../old/apWorkflowInvoiceLineItems";
import WorkflowPDF from "./apWorkflowPDF";

import { useNavigate } from "react-router-dom";
import WorkflowInvoiceLine2 from "./apWorkflowInvoiceLine2";
import InvoiceLineItem2 from "./apWorkflowInvoiceLineItems2";

function WorkflowAccounting() {
  const { id } = useParams();
  // const id = 6;
  const [invoice, setInvoice] = useState(null);
  const [ids, setIds] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveDocumentLines = async () => {
    setLoading(true);

    const products = await apiService.getInvoiceLines(invoice.id);
    const companyId = await apiService.getCompany().id;
    try {
      let res = await apiService.parkInvoice({
        products: products,
        companyId: companyId,
        invoiceId: invoice.id,
      });

      getInvoiceDetails();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getInvoiceDetails = async () => {
    try {
      let res = await apiService.getPurchaseInvoiceDetails(id);

      let invoiceUrl = res.data.squinvoiceUrl;
      let squinvoiceRes = await apiService.getSquinvoiceData(invoiceUrl, id);
      let invoiceData = squinvoiceRes.data;
      invoiceData.url = res.data.url;
      invoiceData.customer = res.data.customer;
      invoiceData.id = res.data.id;
      invoiceData.status = res.data.status;

      setInvoice(invoiceData);
    } catch (err) {
      console.log(err);
    }
  };

  const getInvoicesId = async () => {
    try {
      let res = await apiService.getPurchaseInvoicesIds();
      // console.log(res);
      setIds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getInvoiceIndex = () => {
    return ids.indexOf(parseInt(id));
  };
  const getNextInvoice = () => {
    let nextInvoiceIndex = getInvoiceIndex() + 1;
    navigate(`/ap-workflow/${ids[nextInvoiceIndex]}`);
  };
  const getPrevInvoice = () => {
    let prevInvoiceIndex = getInvoiceIndex() - 1;
    navigate(`/ap-workflow/${ids[prevInvoiceIndex]}`);
  };
  useEffect(() => {
    getInvoiceDetails(id);
    getInvoicesId();
  }, [id]);
  return !invoice ? (
    <LoadingScreen />
  ) : (
    <div id="workflow-window" className="">
      {loading && <LoadingScreen />}

      <div className="row d-flex justify-content-center gap-5  p-2 workflow-header">
        <button
          className="btn btn-success col-auto"
          onClick={() => getPrevInvoice()}
          disabled={getInvoiceIndex() === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
          </svg>
        </button>
        <button
          className="btn btn-success col-auto"
          onClick={() => getNextInvoice()}
          disabled={getInvoiceIndex() === ids.length - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
          </svg>
        </button>
        <button href={invoice.url} className="btn btn-success col-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 21l-8-9h6v-12h4v12h6l-8 9zm9-1v2h-18v-2h-2v4h22v-4h-2z" />
          </svg>
        </button>

        <button
          className="btn btn-success col-auto"
          disabled={invoice.status === "Saved"}
          onClick={() => saveDocumentLines()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z" />
          </svg>
        </button>

        <button
          className="btn btn-danger col-auto"
          onClick={() => navigate(`/ap-workflow`)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M20 7.093l-3-3v-2.093h3v5.093zm4 5.907h-3v10h-18v-10h-3l12-12 12 12zm-10 2h-4v6h4v-6z" />
          </svg>
        </button>
      </div>

      <div className="row h-100  ">
        <div className="col-8 d-flex flex-column gap-5    " id="">
          <InvoiceHeader invoice={invoice} />
          <InvoiceLineItem2 invoice={invoice} />
        </div>

        <WorkflowPDF invoice={invoice} />
      </div>
    </div>
  );
}

export default WorkflowAccounting;
