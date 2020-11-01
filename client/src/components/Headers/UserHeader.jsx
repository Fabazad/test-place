import React from "react";

// reactstrap components

const UserHeader = () => {
    return (
        <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
                minHeight: "300px",
                backgroundImage:
                    "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
                backgroundSize: "cover",
                backgroundPosition: "center top"
            }}
        >
            {/* Mask */}
            <span className="mask bg-gradient-default opacity-8"/>
        </div>
    );
};

export default UserHeader;
