import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Form from "reactstrap/es/Form";
import Loading from "../Loading";

const ContactForm = (props) => {
  const { onSubmit, defaultValues, loading, t } = props;

  const initialValues = { name: "", email: "", message: "" };

  const [values, setValues] = useState(defaultValues || initialValues);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    setValues(defaultValues || initialValues);
  }, [defaultValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await onSubmit(values);
    if (res) setValues(initialValues);
  };

  const { name, email, message } = values;

  return (
    <Form onSubmit={handleSubmit}>
      <Loading loading={loading} />
      <FormGroup className={classnames({ focused: nameFocused })}>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-user-run" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder={t("YOUR_NAME") + " *"}
            type="text"
            value={name}
            required
            onFocus={() => setNameFocused(true)}
            name="name"
            onBlur={() => setNameFocused(false)}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup className={classnames({ focused: emailFocused })}>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-email-83" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder={t("YOUR_MAIL_ADDRESS") + " *"}
            type="email"
            value={email}
            onFocus={() => setEmailFocused(true)}
            required
            onBlur={() => setEmailFocused(false)}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            name="email"
          />
        </InputGroup>
      </FormGroup>
      <FormGroup className="mb-4">
        <Input
          className="form-control-alternative"
          cols="80"
          value={message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          required
          name="message"
          placeholder={t("TELL_US_EVERYTHING") + " *"}
          rows="4"
          type="textarea"
        />
      </FormGroup>
      <div className="text-center">
        <Button color="default" type="submit" disabled={!name || !email || !message}>
          {t("SEND_YOUR_MESSAGE")}
        </Button>
      </div>
    </Form>
  );
};

ContactForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withTranslation()(ContactForm);
