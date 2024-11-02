import React from "react";
import { withTranslation } from "react-i18next";
import { Badge, UncontrolledTooltip } from "reactstrap";

export const MyAffiliatedRow = withTranslation()(({ affiliated, t }) => {
  console.log({ affiliated });

  const ActivationBadge = ({ eventType, text, color, icon }) => (
    <>
      <Badge
        className={`text-white badge-circle badge-xl bg-gradient-${color} ${
          eventType === "emailValidation" ? "" : "ml--3"
        }`}
        id={`activation-${eventType}-${affiliated.userId}`}
      >
        <i className={`${icon} m-0`} />
      </Badge>
      <UncontrolledTooltip
        delay={0}
        target={`activation-${eventType}-${affiliated.userId}`}
      >
        {text}
      </UncontrolledTooltip>
    </>
  );

  const badgeMap = {
    emailValidation: (
      <ActivationBadge
        eventType="emailValidation"
        text={t("EMAIL_VALIDATION")}
        color="success"
        icon="fa fa-check-circle"
      />
    ),
    firstTestRequest: (
      <ActivationBadge
        eventType="firstTestRequest"
        text={t("FIRST_TEST_REQUEST")}
        color="primary"
        icon="far fa-hand-paper"
      />
    ),
    firstProductOrdered: (
      <ActivationBadge
        eventType="firstProductOrdered"
        text={t("FIRST_PRODUCT_ORDERED")}
        color="info"
        icon="fa fa-truck"
      />
    ),
    firstProductReceived: (
      <ActivationBadge
        eventType="firstProductReceived"
        text={t("FIRST_PRODUCT_RECEIVED")}
        color="info"
        icon="fa-lg fa fa-box-open"
      />
    ),
    firstProductReviewed: (
      <ActivationBadge
        eventType="firstProductReviewed"
        text={t("FIRST_PRODUCT_REVIEWED")}
        color="warning"
        icon="fa fa-star"
      />
    ),
    firstMoneyReceived: (
      <ActivationBadge
        eventType="firstMoneyReceived"
        text={t("FIRST_MONEY_RECEIVED")}
        color="success"
        icon="fa fa-dollar-sign"
      />
    ),
  };

  const Badges = () => (
    <div>
      {(affiliated.activationEvents || []).map((event) => badgeMap[event.eventType])}
    </div>
  );

  return (
    <tr key={affiliated._id}>
      <td>{affiliated.name}</td>
      <td>{affiliated.email}</td>
      <td>{affiliated.rateInPercent}%</td>
      <td>
        <Badges />
      </td>
    </tr>
  );
});
