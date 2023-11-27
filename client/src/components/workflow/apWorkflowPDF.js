import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { DispatchUserContexts, ShowUserContexts } from "../../App";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
// Import styles
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

function WorkflowPDF({ invoice }) {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfText, setPdfText] = useState("");
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {}, []);
  return (
    invoice &&
    invoice.url && (
      <div className={invoice ? "col-4 p-0" : "col-0 p-0"}>
        <Document
          file={invoice.url}
          className={"  "}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} scale={1.0} renderTextLayer={false} />
        </Document>
      </div>
    )
  );
}

export default WorkflowPDF;
