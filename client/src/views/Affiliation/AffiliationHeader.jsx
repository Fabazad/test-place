import React from "react";

// reactstrap components

export const AffiliationHeader = () => {
  return (
    <div
      className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
      style={{
        minHeight: "300px",
        backgroundImage: "url(" + require("assets/img/theme/img-2-1200x1000.jpg") + ")",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Mask */}
      <span className="mask bg-gradient-warning opacity-8" />
    </div>
  );
};
