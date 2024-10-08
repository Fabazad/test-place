import React, { useState } from "react";
// reactstrap components
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
} from "reactstrap";
import userServices from "../../services/user.services";
import Loading from "../Loading";

const ResendValidationMailModal = ({ t }) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    userServices
      .resendValidationMail(email)
      .then((res) => {
        if (res?.error) {
          if (res.error === "user_not_found") toast.error(t("EMAIL_HAS_NOT_BEEN_SENT"));
          else if (res.error === "already_validated") {
            toast.info(t("EMAIL_ALREADY_VALIDATED"));
            setEmail("");
            toggleModal();
          }
          return;
        }
        toast.success(t("EMAIL_HAS_BEEN_SENT"));
        setEmail("");
        toggleModal();
      })
      .catch(() => toast.error(t("EMAIL_HAS_NOT_BEEN_SENT")))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* Button trigger modal */}
      <span className="text-primary cursor-pointer" onClick={toggleModal}>
        <small>{t("RESEND_VALIDATION_MAIL")}</small>
      </span>
      {/* Modal */}
      <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={toggleModal}>
        <Loading loading={loading} />
        <Form role="form" onSubmit={onSubmit}>
          <div className="modal-header bg-secondary">
            <h5 className="modal-title">{t("RESEND_VALIDATION_MAIL")}</h5>
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
          <div className="modal-body white-space-pre-line bg-secondary">
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("ACCOUNT_EMAIL")}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
          </div>
          <div className="modal-footer bg-secondary ">
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={toggleModal}
            >
              {t("CLOSE")}
            </Button>
            <Button disabled={!email} color="primary" data-dismiss="modal" type="submit">
              {t("SEND")}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default withTranslation()(ResendValidationMailModal);
