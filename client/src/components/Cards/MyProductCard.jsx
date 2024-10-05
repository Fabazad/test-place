import React from "react";

// reactstrap components
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge, Card, CardBody, Row, UncontrolledTooltip } from "reactstrap";
import constants from "../../helpers/constants";
import { formatDate, textSlice } from "../../helpers/textHelpers";
import productServices from "../../services/product.service";
import DeleteProductButton from "../Buttons/DeleteProductButton";
import PublishProductButton from "../Buttons/PublishProductButton";
import UnpublishProductButton from "../Buttons/UnpublishProductButton";
import EditProductModal from "../Modals/EditProductModal";

const MyProductCard = (props) => {
  const { product, t } = props;

  const published = productServices.isPublished(product);

  return (
    <Card className={"card-lift--hover shadow border-0 cursor-pointer"}>
      <CardBody>
        <div style={{ height: "200px" }} className={"text-center"}>
          <img
            src={product ? product.imageUrls[0] : constants.BASE_PRODUCT_PICTURE_URL}
            alt=""
            className={"mw-100 shadow-lg rounded"}
            style={{ maxHeight: "200px" }}
          />
        </div>
        <div style={{ height: "58px" }}>
          <Link to={"/ad/" + product._id}>
            <h5 className="text-primary mt-4">
              {product ? textSlice(product.title, 80) : ""}
            </h5>
          </Link>
        </div>
        <Row className="mt-3">
          <div className="col-6 text-center">
            <small>{t("AMAZON_PRICE")}</small>
            <h1>
              <Badge color="primary" pill className={"badge-xl"}>
                {product ? product.price : " "} €
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
        <div className="text-center mt-2">
          <small>Options</small>
          <div>
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
        </div>
        <div className="mt-3 row">
          <div className="text-center col-6">
            <small>Publication</small>
            <div>
              <Badge
                color={"success"}
                className={"badge-circle badge-lg text-center p-0"}
                pill
              >
                <i className="ni ni-check-bold m-auto" />
              </Badge>
              <small className="text-muted ml-2">
                {product ? formatDate(product.createdAt) : "  /  /  "}
              </small>
            </div>
          </div>
          <div className="text-center col-6">
            <small>{t("REQUESTS")}</small>
            <h4 className="mt-1">
              {product.maxDemands - product.remainingTestsCount} / {product.maxDemands}
            </h4>
          </div>
        </div>
        <div className="row mt-3 px-3">
          {published ? (
            <>
              <div className="col-6 px-1">
                <UnpublishProductButton productId={product._id} />
              </div>
            </>
          ) : (
            <>
              <div className="col-6 px-1">
                <DeleteProductButton productId={product._id} />
              </div>
              <div className="col-6 px-1">
                <PublishProductButton productId={product._id} />
              </div>
            </>
          )}
          <div className="col-6 px-1">
            <EditProductModal product={product} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

MyProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default withTranslation()(MyProductCard);
