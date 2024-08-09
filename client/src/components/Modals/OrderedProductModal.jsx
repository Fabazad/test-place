import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Modal, UncontrolledTooltip } from "reactstrap";
import Alert from "reactstrap/es/Alert";
import Form from "reactstrap/es/Form";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import constants, { TestStatus } from "../../helpers/constants";
import s3Services from "../../services/s3.services";
import testServices from "../../services/test.services";
import ImageUploader from "../ImageUploader";
import InfoPopover from "../InfoPopover";
import Loading from "../Loading";

const OrderedProductModal = (props) => {
  const { isOpen, onToggle, testId, t } = props;

  const [test, setTest] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderScreenshotUrl, setOrderScreenshotUrl] = useState(null);
  const [orderScreenshot, setOrderScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testServices.getOne(testId).then(setTest);
  }, [testId]);

  if (!test) return null;

  const handleConfirm = async () => {
    if (!orderScreenshot) {
      toast.error(t("ADD_SCREENSHOT"));
      return;
    }

    setLoading(true);

    try {
      const finalScreenshotUrl = await s3Services.upload(orderScreenshot);

      await testServices.updateStatus(test._id, TestStatus.PRODUCT_ORDERED, {
        orderId,
        orderScreenshotUrl: finalScreenshotUrl,
      });

      testServices.testsSubject.next();
      onToggle();
      toast.success(t("PRODUCT_SAVED_AS_ORDERED"));
    } catch (err) {
      console.log(err);
      toast.error(err.toString);
    }

    setLoading(false);
  };

  const retrieveAndSetScreenshotUrl = (file) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      setOrderScreenshot(file);
      setOrderScreenshotUrl(fileUrl);
    } catch (err) {
      console.log(err);
      toast.error(t("COULD_NOT_IMPORT_PICTURE"));
    }
  };

  const disabled = !orderId || !orderId.match(/^\w{3}-\w{7}-\w{7}$/) || !orderScreenshot;

  return (
    <Modal className="modal-dialog-centered" isOpen={isOpen} toggle={onToggle}>
      <Loading loading={loading} />
      <div className="modal-header">
        <h2 className="modal-title">{t("PRODUCT_ORDERED")}</h2>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={onToggle}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <div className="modal-body text-center pb-0">
        <div className="text-left w-100">
          {test.sellerMessage ? (
            <div className="mb-3">
              <Label>
                {t("SELLER_MESSAGE")} - <b>{test.seller.name}</b>
              </Label>
              <Alert color="success">{test.sellerMessage}</Alert>
            </div>
          ) : null}
        </div>
        <div className="mt-3 mb-0 white-space-pre-line">{t("ORDER_PRODUCT_FIRST")}</div>
        <div className="mt-3">
          <a href={test.product.amazonUrl}>
            <Button color="default">
              <i className="fab fa-amazon mr-3" />
              {t("GO_TO_AMAZON_PRODUCT")}
            </Button>
          </a>
        </div>

        <hr />

        <Form className="mt-4 px-0 px-md-5 mx-0 mx-md-4 bg-secondary rounded py-3 shadow">
          <FormGroup>
            <Label>
              {t("ORDER_SCREENSHOT")} *
              <InfoPopover className="ml-3">
                {t("TAKE_ORDER_PICTURE")}{" "}
                <a
                  href="https://www.amazon.fr/gp/css/order-history"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("YOUR_ORDERS_PAGE")}
                </a>
                .<br />
                Exemple :
                <a
                  className="bg-secondary rounded p-2 d-block"
                  href={require("assets/img/amazonOrder.png")}
                  target="_blank"
                  id={"order-example-" + testId}
                >
                  <img
                    src={require("assets/img/amazonOrder.png")}
                    alt=""
                    className="w-100"
                  />
                </a>
                <UncontrolledTooltip
                  delay={0}
                  placement="auto"
                  target={"order-example-" + testId}
                >
                  Cliquer pour agrandir
                </UncontrolledTooltip>
              </InfoPopover>
            </Label>
            <ImageUploader
              onChange={(file) => retrieveAndSetScreenshotUrl(file)}
              baseUrl={constants.BASE_PRODUCT_PICTURE_URL}
              src={orderScreenshotUrl}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              {t("ORDER_NUMBER")} *
              <InfoPopover className="ml-3">
                {t("CAN_FIND_ORDER_NUMBER_ON")}{" "}
                <a
                  href="https://www.amazon.fr/gp/css/order-history"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("YOUR_ORDERS_PAGE")}
                </a>
                .<br />
                {t("ON_TITLE")} <b>{t("ORDER_NUMBER_AMAZON_TITLE")}</b>.
              </InfoPopover>
            </Label>
            <Input
              type="text"
              name="orderId"
              className="form-control-alternative"
              placeholder="405-9455016-XXXXXXX"
              onChange={(e) => setOrderId(e.target.value)}
            />
          </FormGroup>
        </Form>
      </div>
      <div className="modal-footer">
        <Button color="secondary" data-dismiss="modal" type="button" onClick={onToggle}>
          {t("CLOSE")}
        </Button>
        <Button color="primary" disabled={disabled} onClick={handleConfirm}>
          {t("CONFIRM")}
        </Button>
      </div>
    </Modal>
  );
};

OrderedProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
};

export default withTranslation()(OrderedProductModal);

// https://www.amazon.fr/MAURANE-BOB-EST-UNE-AVENTURI%C3%88RE/dp/2493290097/ref=sr_1_5?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=8UAO6ZLHO9UV&dib=eyJ2IjoiMSJ9.WvbcPI_r6IGZa0K3pIdkOb3_imEhMs5WxiVxJi0DaSLWTuqc9xQ6WBwlABfZAnbuQ58TR6RmRR_FzKzkd-5HnaJit21z77_dQYB5hbPmwOOZqBEX-KrjnkwPB9udjm59dQ8ne_PViVUC4trc9G58SLdmAD1a_h9seu6cI-3ubEa15KbNRwTM3Aq2Te8vRDGQbxXyfsmeupnxV5sarjH7rwpH6ucJozWcHRlD_w6L_7bx9w14aPeNAk2v_tiZ8lT4e9egIv2kS3zXtBAqhYUqKIA9sGbnteU3_04CyNZqRb8.SRZ5b7CDz80-H2m3R-nSdHaqQLZxoyKvqDOmgQmoJvw&dib_tag=se&keywords=bidule&qid=1723222359&sprefix=bidu%2Caps%2C462&sr=8-5
