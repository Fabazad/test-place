import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { FormGroup, Input, Label } from "reactstrap";

const SendRequestForm = (props) => {
  const { value, onChange, t } = props;

  return (
    <FormGroup className="text-left">
      {/* It's all good case */}
      <Label for="sellerMessage">{t("MESSAGE_TO_SELLER")}</Label>
      <Input
        className="form-control-alternative"
        id="testerMessage"
        defaultValue={value}
        required
        placeholder={t("TESTER_MESSAGE_PLACEHOLDER")}
        type="textarea"
        name="testerMessage"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormGroup>
  );
};

SendRequestForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withTranslation()(SendRequestForm);
