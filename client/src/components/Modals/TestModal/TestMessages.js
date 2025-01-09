import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Form, Label } from "reactstrap";
import Alert from "reactstrap/es/Alert";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import Container from "reactstrap/lib/Container";
import Input from "reactstrap/lib/Input";
import testServices from "../../../services/test.services";
import userServices from "../../../services/user.services";

const TestMessages = (props) => {
  const { t, testId, seller, tester } = props;

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(props.messages);

  const currentUser = userServices.currentUser;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    testServices
      .sendMessage({ message, testId })
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
          return;
        }

        setMessages([
          ...messages,
          { message, date: new Date(), sender: { userId: currentUser._id } },
        ]);
        setMessage("");
        toast.success(t("MESSAGE_SENT"));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const getSenderName = (sender) => {
    if (sender.userId === seller._id) return seller.name;
    if (sender.userId === tester._id) return tester.name;
    return t("UNKNOWN");
  };

  const sortedMessages = messages.sort((a, b) =>
    dayjs(a.date).isBefore(b.date) ? 1 : -1
  );

  return (
    <Row
      className="bg-secondary p-3 rounded border"
      style={{ borderColor: "#eee!important" }}
    >
      <Col className="p-0">
        <h3>{t("TEST_MESSAGES")}</h3>
        <Container
          className="mb-3 d-flex"
          style={{
            overflowY: "scroll",
            maxHeight: "20rem",
            flexDirection: "column-reverse",
          }}
        >
          {sortedMessages.map(({ message, sender, date }, index) => (
            <Alert
              key={index}
              className={
                "white-space-pre-line " +
                (currentUser._id === sender.userId ? "ml-5" : "mr-5")
              }
              color={currentUser._id === sender.userId ? "primary" : "default"}
            >
              <Label>
                {getSenderName(sender)} - {dayjs(date).format("DD/MM/YYYY HH:mm")}
              </Label>
              <br />
              {message}
            </Alert>
          ))}
          {messages.length === 0 && <p>{t("NO_MESSAGES")}</p>}
        </Container>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col xs={12}>
                <Input
                  type="textarea"
                  rows={2}
                  placeholder={t("WRITE_A_MESSAGE")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                />
              </Col>
            </Row>
            <Row className="mt-1">
              <Col xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={!message || isLoading}
                  className="w-100 cursor-pointer"
                >
                  {t("SEND")}
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Col>
    </Row>
  );
};

TestMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  testId: PropTypes.string.isRequired,
  seller: PropTypes.object.isRequired,
  tester: PropTypes.object.isRequired,
};

export default withTranslation()(TestMessages);
