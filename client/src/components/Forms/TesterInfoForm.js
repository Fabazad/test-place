import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Button, Input } from "reactstrap";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import constants from "../../helpers/constants";
import userService from "../../services/user.services";
import InfoPopover from "../InfoPopover";
import Loading from "../Loading";
const { USER_ROLES } = constants;

const TesterInfoForm = (props) => {
  const { t } = props;

  const btnText = props.btnText ? props.btnText : t("SAVE");
  const addRole = !!props.addRole;
  const user = userService.currentUser;

  const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
  const [amazonId, setAmazonId] = useState(user.amazonId);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {
      paypalEmail,
      amazonId: amazonId.replace(/.*(amzn1\.account\.[A-Z0-9]{28}).*/, "$1"),
    };
    if (addRole) params.roles = user.roles.concat([USER_ROLES.TESTER]);

    userService
      .updateUserInfo(user._id, params)
      .then(() => {
        props.onSaved();
      })
      .finally(() => setLoading(false));
  };

  const validForm = amazonId && paypalEmail;

  return (
    <Form onSubmit={onSubmit}>
      <Loading loading={loading} />
      <FormGroup>
        <label className="form-control-label" htmlFor="input-paypal-email">
          {t("PAYPAL_EMAIL")} *
          <InfoPopover className="ml-3">{t("PAYPAL_EMAIL_EXPLAINED")}</InfoPopover>
        </label>
        <Input
          className="form-control-alternative"
          placeholder="exemple@email.com"
          defaultValue={user.paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
          id="input-paypal-email"
          type={"email"}
          required
        />
      </FormGroup>
      <FormGroup>
        <label className="form-control-label" htmlFor="input-amazon-id">
          {t("AMAZON_ID")} *
          <InfoPopover className="ml-3 white-space-pre-line">
            {t("AMAZON_ID_EXPLAINED_1")}
            <br />
            <a
              href="https://www.amazon.fr/gp/profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.amazon.fr/gp/profile
            </a>
            .<br />
            <br />
            {t("AMAZON_ID_EXPLAINED_2")}
            amzn1.account.XXXXXXXXXXXXXXXXXXXXXXXXXXXX.
          </InfoPopover>
        </label>
        <Input
          className="form-control-alternative"
          placeholder="amzn1.account.AHANP57CG4WHEOPW64THE75XXXXX"
          defaultValue={user.amazonId}
          onChange={(e) => setAmazonId(e.target.value)}
          id="input-amazon-id"
          required
        />
      </FormGroup>
      <FormGroup className="text-center mb-0">
        <Button type="submit" color="primary" disabled={!validForm}>
          {btnText}
        </Button>
      </FormGroup>
    </Form>
  );
};

TesterInfoForm.propTypes = {
  onSaved: PropTypes.func.isRequired,
  btnText: PropTypes.string,
  addRole: PropTypes.bool,
};

export default withTranslation()(TesterInfoForm);
