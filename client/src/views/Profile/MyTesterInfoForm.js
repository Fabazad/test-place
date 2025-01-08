import PropTypes from "prop-types";
import React, { useState } from "react";
import { Trans, withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, FormGroup, Input } from "reactstrap";
import Form from "reactstrap/es/Form";
import InfoPopover from "../../components/InfoPopover";
import Loading from "../../components/Loading";
import userService from "../../services/user.services";

const MyTesterInfoForm = (props) => {
  const { user, t } = props;

  const [loading, setLoading] = useState(false);
  const [testerMessage, setTesterMessage] = useState(user.testerMessage);
  const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
  const [amazonId, setAmazonId] = useState(user.amazonId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    userService
      .updateUserInfo(userService.currentUser._id, {
        testerMessage,
        paypalEmail,
        amazonId: amazonId.replace(/.*(amzn1\.account\.[A-Z0-9]{28}).*/, "$1"),
      })
      .catch(() => setLoading(false))
      .then((val) => {
        setLoading(false);
        if (val.error) {
          if (val.error === "amazon_id_already_used")
            toast.error(t("AMAZON_ID_ALREADY_USED"));
          else toast.error(t("UNKNOWN_ERROR"));
          return;
        }
        toast.success(t("UPDATES_SAVED"));
      });
  };

  const disabledSave =
    user.testerMessage === testerMessage &&
    user.paypalEmail === paypalEmail &&
    user.amazonId === amazonId;

  return (
    <Form onSubmit={handleSubmit} className="position-relative">
      <Loading loading={loading} />
      <div>
        <h6 className="heading-small text-muted mb-4 d-inline-block">
          {t("MY_TESTER_INFO")}
        </h6>
        <Button
          size="sm"
          color="info"
          className="float-right"
          type="submit"
          disabled={disabledSave}
        >
          {t("SAVE")}
        </Button>
      </div>
      <div className="pl-lg-4">
        <FormGroup>
          <label className="form-control-label" htmlFor="input-tester-message">
            {t("TESTER_MESSAGE")}
            <InfoPopover className="ml-3">
              <Trans
                i18nKey={"TESTER_MESSAGE_EXPLAINED"}
                components={{ b: <b />, i: <i /> }}
              />
            </InfoPopover>
          </label>
          <Input
            className="form-control-alternative"
            defaultValue={user.testerMessage}
            id="input-tester-message"
            placeholder={t("TESTER_MESSAGE_PLACEHOLDER") + "\n" + user.name}
            type="textarea"
            onChange={(e) => setTesterMessage(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label className="form-control-label" htmlFor="input-paypal-email">
            {t("PAYPAL_ADDRESS")}
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
            {t("AMAZON_ID")}
            <InfoPopover className="ml-3">
              <Trans
                i18nKey="AMAZON_ID_EXPLAINED"
                components={{ b: <b />, i: <i />, a: <a /> }}
                values={{ url: "www.amazon.fr/gp/profile" }}
              />
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
      </div>
    </Form>
  );
};

MyTesterInfoForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default withTranslation()(MyTesterInfoForm);
