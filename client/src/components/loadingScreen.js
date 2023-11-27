import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
function LoadingScreen({ done }) {
  return (
    <div id="loading-screen">
      <ReactLoading type={"bars"} color={"white"} height={100} width={100} />
    </div>
  );
}

export default LoadingScreen;
