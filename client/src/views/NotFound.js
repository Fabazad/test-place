import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "reactstrap/es/Button";
import SimpleFooter from "../components/Footers/SimpleFooter";

const NotFound = (props) => {
  const { t } = props;

  return (
    <>
      <main>
        <div className="position-relative">
          {/* shape Hero */}
          <section className="section section-lg section-shaped pb-5">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="w-100 p-5 text-center">
              <img
                src={require("assets/img/undraws/page_not_found.svg").default}
                alt=""
                className="w-100"
                style={{ maxWidth: "600px" }}
              />
              <div className="text-white display-4 mt-5 mb-md-5">
                {t("PAGE_DOES_NOT_EXIST")}
              </div>
              <Button color="secondary" className="mt-3" tag={Link} to="/">
                {t("GO_BACK_HOME")}
              </Button>
            </div>
            <div className="separator separator-bottom separator-skew mt-md-5">
              <svg
                className="w-100"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon className="fill-secondary" points="2560 0 2560 100 0 100" />
              </svg>
            </div>
          </section>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
};

export default withTranslation()(NotFound);
