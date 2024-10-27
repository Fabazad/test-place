import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Badge, Button, Modal } from "reactstrap";

export const AffiliationExplanationModal = withTranslation()(({ t }) => {
  const [isOpen, setIsOpen] = useState(false);

  const history = useHistory();

  const modalUrlName = "#affiliationExplanation";

  const toggleModal = (e) => {
    const isOpen = history.location.hash === modalUrlName;
    e.preventDefault();
    history.push(isOpen ? "#" : modalUrlName);
  };

  useEffect(
    () => setIsOpen(history.location.hash === modalUrlName),
    [history.location.hash]
  );

  return (
    <>
      <Button color="warning" onClick={toggleModal} className="w-100">
        {t("WHAT_IS_AFFILIATION")}
      </Button>
      <Modal
        size={"lg"}
        className="modal-dialog-centered"
        isOpen={isOpen}
        toggle={toggleModal}
      >
        <div className="modal-header p-4">
          <h2 className="modal-title">{t("AFFILIATE_PROGRAM_TITLE")}</h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body white-space-pre-line px-lg-5">
          <p className="mt-4 font-weight-light">{t("AFFILIATE_PROGRAM_DESCRIPTION")}</p>
          <ul>
            <li className="mt-3">
              <strong>{t("AFFILIATE_LINK_TITLE")}:</strong>{" "}
              {t("AFFILIATE_LINK_DESCRIPTION")}
            </li>
            <li className="mt-3">
              <strong>{t("COMMISSION_TITLE")}:</strong> {t("COMMISSION_DESCRIPTION")}
            </li>
            <li className="mt-3">
              <strong>{t("PAYMENT_TITLE")}:</strong> {t("PAYMENT_DESCRIPTION")}
            </li>
          </ul>
          <h3 className="mt-5">{t("AFFILIATE_BADGES_INTRO")}</h3>
          <ul>
            <li className="mt-3">
              <Badge color="light" pill className="badge-lg">
                {t("ACTIVE_AFFILIATES_TITLE")}
              </Badge>{" "}
              : {t("ACTIVE_AFFILIATES_DESCRIPTION")}
            </li>
            <li className="mt-3">
              <Badge color="success" pill className="badge-lg">
                {t("TOTAL_EARNINGS_TITLE")}
              </Badge>{" "}
              : {t("TOTAL_EARNINGS_DESCRIPTION")}
            </li>
            <li className="mt-3">
              <Badge color="primary" pill className="badge-lg">
                {t("PENDING_BALANCE_TITLE")}
              </Badge>{" "}
              : {t("PENDING_BALANCE_DESCRIPTION")}
            </li>
          </ul>
          <p className="font-weight-light mt-5">{t("INVITATION_MESSAGE")}</p>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            {t("CLOSE")}
          </Button>
        </div>
      </Modal>
    </>
  );
});
