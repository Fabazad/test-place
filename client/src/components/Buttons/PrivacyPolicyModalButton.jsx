import React from "react";
import { useHistory } from "react-router-dom";
// reactstrap components
import { withTranslation } from "react-i18next";

const PrivacyPolicyModalButton = ({ t }) => {
  const history = useHistory();

  const toggleModal = (e) => {
    const isOpen = history.location.hash === "#privacyPolicy";
    e.preventDefault();
    history.push(isOpen ? "#" : "#privacyPolicy");
  };

  return (
    <a onClick={toggleModal} className="cursor-pointer font-weight-bold text-primary">
      {t("PRIVACY_POLICY")}
    </a>
  );
};

export default withTranslation()(PrivacyPolicyModalButton);
