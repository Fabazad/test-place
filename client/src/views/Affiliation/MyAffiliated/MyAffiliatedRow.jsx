import { formatDate } from "helpers/textHelpers";
import React from "react";
import { withTranslation } from "react-i18next";
import { Badge, UncontrolledTooltip } from "reactstrap";

export const MyAffiliatedRow = withTranslation()(({ affiliated, t }) => {
  const ActivationBadge = ({ eventType, text, color, icon, date }) => (
    <>
      <Badge
        className={`text-white badge-circle badge-xl bg-gradient-${
          date ? color : "light"
        } ${eventType === "emailValidation" ? "" : "ml--1 ml-md--3"}`}
        id={`activation-${eventType}-${affiliated.userId}`}
      >
        <i className={`${icon} m-0`} />
      </Badge>
      <UncontrolledTooltip
        delay={0}
        target={`activation-${eventType}-${affiliated.userId}`}
      >
        {text} - {date ? formatDate(date) : t("NOT_ACTIVATED")}
      </UncontrolledTooltip>
    </>
  );

  const badgeMap = (date) => ({
    emailValidation: (
      <ActivationBadge
        eventType="emailValidation"
        text={t("EMAIL_VALIDATION")}
        color="success"
        icon="fa fa-check-circle"
        date={date}
      />
    ),
    firstTestRequest: (
      <ActivationBadge
        eventType="firstTestRequest"
        text={t("FIRST_TEST_REQUEST")}
        color="primary"
        icon="far fa-hand-paper"
        date={date}
      />
    ),
    firstProductOrdered: (
      <ActivationBadge
        eventType="firstProductOrdered"
        text={t("FIRST_PRODUCT_ORDERED")}
        color="info"
        icon="fa fa-truck"
        date={date}
      />
    ),
    firstProductReceived: (
      <ActivationBadge
        eventType="firstProductReceived"
        text={t("FIRST_PRODUCT_RECEIVED")}
        color="info"
        icon="fa-lg fa fa-box-open"
        date={date}
      />
    ),
    firstProductReviewed: (
      <ActivationBadge
        eventType="firstProductReviewed"
        text={t("FIRST_PRODUCT_REVIEWED")}
        color="warning"
        icon="fa fa-star"
        date={date}
      />
    ),
    firstMoneyReceived: (
      <ActivationBadge
        eventType="firstMoneyReceived"
        text={t("FIRST_MONEY_RECEIVED")}
        color="success"
        icon="fa fa-dollar-sign"
        date={date}
      />
    ),
  });

  const Badges = () => (
    <div>
      {Object.keys(badgeMap()).map(
        (eventType) =>
          badgeMap(
            (affiliated.activationEvents || []).find((e) => e.eventType === eventType)
              ?.eventDate
          )[eventType]
      )}
    </div>
  );

  return (
    <tr key={affiliated._id}>
      <td>{affiliated.name}</td>
      <td>
        <Badges />
      </td>
      <td>{affiliated.email}</td>
      <td>{affiliated.rateInPercent}%</td>
    </tr>
  );
});
