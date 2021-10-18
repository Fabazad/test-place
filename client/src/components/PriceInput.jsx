// reactstrap components
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import ToggleNav from "./ToggleNav";
import { Input, InputGroup, Col, FormGroup } from "reactstrap";

const PriceInput = (props) => {
  const { t, price } = props;

  const [tabOptions, setTabOptions] = useState([
    {
      id: "freeProduct",
      label: t("FREE"),
    },
    {
      id: "paidProduct",
      label: t("PRICED"),
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("freeProduct");

  return (
    <>
      <Col xs={6} className="mt-2 p-0">
        <ToggleNav
          id="toggleNavForm"
          onChange
          onChange={(tab) => {
            setSelectedTab(tab);
            if (tab === "freeProduct") {
              props.onChange(0);
            }
          }}
          selectedTab={selectedTab}
          tabOptions={tabOptions}
        />
      </Col>
      {selectedTab !== "freeProduct" ? (
        <Col xs={6}>
          <Input
            aria-hidden={selectedTab === "freeProduct"}
            placeholder={t("FINAL_PRICE")}
            required
            id="inputPrice"
            type="number"
            value={price}
            step="0.01"
            min="0"
            name="finalPrice"
            onChange={(e) => props.onChange(e.target.value)}
          />
        </Col>
      ) : null}
    </>
  );
};

PriceInput.propTypes = {};

export default withTranslation()(PriceInput);
