// reactstrap components
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";

const ToggleNav = (props) => {
  const { t, tabOptions, selectedTab } = props;

  return (
    <>
      <div>
        <div className="tabs-menu">
          {tabOptions &&
            tabOptions.length &&
            tabOptions.map((tab) => (
              <a
                onClick={() => props.onChange(tab.id)}
                key={tab.id}
                className={
                  "tabs-menu-option" +
                  (tab.id === selectedTab ? " tabs-menu-option--current" : "")
                }
              >
                <span>{tab.label}</span>
              </a>
            ))}
        </div>
      </div>
    </>
  );
};

ToggleNav.propTypes = {
  tabOptions: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string,
      selected: PropTypes.bool,
    })
  ).isRequired,
};

export default withTranslation()(ToggleNav);
