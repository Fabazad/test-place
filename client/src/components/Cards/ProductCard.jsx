import React from "react";

// reactstrap components
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, Row, UncontrolledTooltip } from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import Col from "reactstrap/es/Col";
import constants from "../../helpers/constants";
import { textSlice } from "../../helpers/textHelpers";
import UserProfilePopover from "../UserProfilePopover";

const ProductCard = (props) => {
  const { product, t } = props;

  return (
    <Card
      className={"card-lift--hover shadow border-0 cursor-pointer"}
      to={product ? "ad/" + product._id : "#"}
      tag={Link}
    >
      <CardHeader className="p-1">
        <div className="w-100 text-center" style={{ height: "250px" }}>
          <img
            src={product ? product.imageUrls[0] : constants.BASE_PRODUCT_PICTURE_URL}
            alt=""
            className="shadow rounded mw-100"
            style={{ maxHeight: "250px" }}
          />
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ height: "50px" }}>
          <h5 className="text-primary">{product ? textSlice(product.title, 55) : ""}</h5>
        </div>
        <Row>
          <div className="col-6 text-center">
            <small>{t("AMAZON_PRICE")}</small>
            <h1>
              <Badge
                color="primary"
                pill
                className="badge-xl  text-decoration-line-through"
              >
                {product ? product.price.toFixed(2) : " "} €
              </Badge>
            </h1>
          </div>
          <div className="col-6 text-center">
            <small>{t("FINAL_PRICE")}</small>
            <h1>
              <Badge
                color={product && product.finalPrice > 0 ? "warning" : "success"}
                pill
                size={"xl"}
              >
                {product ? product.finalPrice : " "} €
              </Badge>
            </h1>
          </div>
        </Row>
        <div className="text-center mt-3" style={{ height: "30px" }}>
          {product && product.isPrime ? (
            <Badge color="info" pill className="mr-1 badge-lg">
              <img
                src={require("assets/img/icons/prime.png")}
                alt="prime"
                style={{ height: "11px" }}
              />
            </Badge>
          ) : null}
          {product && product.automaticAcceptance ? (
            <>
              <Badge
                color="info"
                pill
                className="mr-1 badge-lg"
                id={"automaticAcceptance" + product._id}
              >
                {t("AUTOMATIC")}
              </Badge>
              <UncontrolledTooltip
                delay={0}
                placement="top"
                target={"automaticAcceptance" + product._id}
              >
                {t("AUTOMATIC_ACCEPTANCE")}
              </UncontrolledTooltip>
            </>
          ) : null}
        </div>
        <Row className="mt-3">
          <Col xs={12} className="text-center">
            <small>
              <UserProfilePopover
                userId={product.seller._id}
                userName={product.seller.name}
                isCertified={product.seller.isCertified}
                showMail={false}
              />
            </small>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default withTranslation()(ProductCard);
