import React from "react";
import loadingCss from "./loading.module.css";
function LoaddingComponent() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ padding: "100px 0" }}
    >
      <span className={loadingCss.loader}></span>
    </div>
  );
}

export default LoaddingComponent;