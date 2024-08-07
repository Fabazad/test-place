import React, { useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";

// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import Loading from "components/Loading";
import PasswordStrength from "components/PasswordStrength";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import userServices from "services/user.services";

const ResetPassword = (props) => {
  const { match, t } = props;

  const history = useHistory();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loadingPromise, setLoadingPromise] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t("PASSWORD_SHOULD_MIN_CHARS"));
      return;
    }
    if (password !== password2) {
      toast.error(t("DIFFERENT_PASSWORDS"));
      return;
    }
    const loadingPromise = userServices
      .resetPassword(password, match.params.resetPasswordToken)
      .then(() => {
        toast.success(t("PASSWORD_UPDATED"));
        history.push("/login");
      })
      .catch((err) => toast.error(t("PASSWORD_NOT_UPDATED")));
    setLoadingPromise(loadingPromise);
  };

  return (
    <>
      <main>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-md">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <Loading promise={loadingPromise} />
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>{t("CHOOSE_NEW_PASSWORD")}</small>
                    </div>
                    <Form role="form" onSubmit={onSubmit}>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder={t("PASSWORD")}
                            type="password"
                            autoComplete="off"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder={t("PASSWORD")}
                            type="password"
                            autoComplete="off"
                            name="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                          />
                        </InputGroup>
                      </FormGroup>
                      <PasswordStrength min={8} password={password} />
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                          disabled={!password || !password2}
                        >
                          {t("VALIDATE")}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default withTranslation()(ResetPassword);
