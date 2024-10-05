import React, { useEffect, useState } from "react";

// reactstrap components
import { Badge, Card, CardBody, Container, Label, Row } from "reactstrap";

// core components
import { Trans, withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import NewTestButton from "../components/Buttons/NewTestButton";
import Carousel from "../components/Carousel";
import CertifiedIcon from "../components/CertifiedIcon";
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import Loading from "../components/Loading";
import NewTestRequestModal from "../components/Modals/NewTestRequestModal/NewTestRequestModal";
import ProfileStats from "../components/ProfileStats";
import constants from "../helpers/constants";
import { formatDate } from "../helpers/textHelpers";
import productServices from "../services/product.service";
import userServices from "../services/user.services";

const ProductDetail = (props) => {
  const { match, t } = props;

  const history = useHistory();

  const [product, setProduct] = useState(undefined);
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    const { productId } = match.params;
    productServices
      .getOne(productId)
      .then((product) => {
        setProduct(product);
        userServices
          .getOne(product.seller._id)
          .then(
            ({ user, processingTestsCount, completedTestsCount, guiltyTestsCount }) => {
              user.testsCount = {
                processing: processingTestsCount,
                completed: completedTestsCount,
                guilty: guiltyTestsCount,
              };
              setSellerData(user);
            }
          );
      })
      .catch(() => history.replace("/not-found"));
  }, []);

  const currentUser = userServices.currentUser;
  if (!product) {
    return <Loading />;
  }

  const newTestRequestButtonDisabled =
    (currentUser && currentUser.roles.includes(constants.USER_ROLES.SELLER)) ||
    product.remainingRequests < 1;

  const newTestButtonDisabled = !(
    !newTestRequestButtonDisabled &&
    currentUser &&
    currentUser.amazonId &&
    currentUser.paypalEmail
  );

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
          <Container className="pt-lg-md mb-5">
            <img src="" alt="" />
          </Container>
          <div className="separator separator-bottom separator-skew">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
              className={"w-100"}
            >
              <polygon className="fill-secondary" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-0 mt--100">
          <Container>
            <Row>
              <div className="col-12 col-md-6">
                {product ? (
                  <Carousel imageUrls={product.imageUrls} />
                ) : (
                  <img
                    src={constants.BASE_PRODUCT_PICTURE_URL}
                    alt="product base"
                    className="rounded shadow w-100"
                  />
                )}
              </div>
              <div className="col-12 col-md-6 mt-3 mt-md-0">
                <div className="text-center mt-4 d-flex justify-content-around">
                  <div>
                    <small className="text-muted d-block mb-1">
                      {t("INITIAL_PRICE")}
                    </small>
                    <h1 className="d-inline-block">
                      <Badge
                        pill
                        color={"primary"}
                        className="badge-lg bg-secondary shadow text-decoration-line-through"
                      >
                        {product.price.toFixed(2)} €
                      </Badge>
                    </h1>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-1">{t("FINAL_PRICE")}</small>
                    <h1 className="d-inline-block">
                      <Badge
                        pill
                        className="badge-lg bg-secondary shadow"
                        color={product.finalPrice === 0 ? "success" : "warning"}
                      >
                        {product.finalPrice} €
                      </Badge>
                    </h1>
                  </div>
                  {/* Desktop view */}
                  {product._id && (
                    <div className={"d-none d-md-block mb-5"}>
                      <NewTestRequestModal
                        productId={product._id}
                        disabled={newTestRequestButtonDisabled}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile view */}
                {product._id && (
                  <div className={"d-block d-md-none mb-5"}>
                    <NewTestRequestModal
                      productId={product._id}
                      disabled={newTestRequestButtonDisabled}
                    />
                  </div>
                )}

                {product && product.category && (
                  <div className="mb-2">
                    <Label>
                      {t("CATEGORY")} : {t("PRODUCT_CATEGORIES." + product.category)}
                    </Label>
                  </div>
                )}

                <div>
                  <h1>{product ? product.title : ""}</h1>
                </div>

                {product.automaticAcceptance || product.isPrime ? (
                  <div className="mt-5 w-100">
                    <div className="row">
                      {product.automaticAcceptance ? (
                        <div className="col text-center">
                          <NewTestButton
                            productId={product._id}
                            disabled={newTestButtonDisabled}
                          />
                        </div>
                      ) : null}
                      {product.isPrime ? (
                        <div className="col text-right d-flex mt-sm-0 mt-2">
                          <h2 className="d-inline-block m-auto">
                            <Badge pill color={"info"} className="badge-lg">
                              <img
                                src={require("assets/img/icons/prime.png")}
                                alt="prime"
                                style={{ height: "18px" }}
                              />
                            </Badge>
                          </h2>
                        </div>
                      ) : null}
                      {product.automaticAcceptance && (
                        <div className="text-left mt-4 col-12">
                          <small className="row">
                            <div className="col-1 text-center">
                              <i className="fa fa-bolt text-yellow" />
                            </div>
                            <div className="col">
                              <Trans
                                i18nKey="AUTOMATIC_ACCEPTANCE_EXPLAINED"
                                components={{ b: <b /> }}
                              />
                            </div>
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3">
                  <Card>
                    <CardBody>
                      <h2 className="text-center">{t("SELLER")}</h2>
                      <Row>
                        <div className="col text-center">
                          <Label className="d-block">Test Place</Label>
                          <div>
                            {product.seller.name}
                            {product.seller.isCertified && (
                              <CertifiedIcon className="ml-3" />
                            )}
                          </div>
                          {product && sellerData !== null && (
                            <div className="mt-3">
                              <ProfileStats
                                userId={product.seller._id}
                                testsCount={sellerData.testsCount}
                              />
                            </div>
                          )}
                        </div>
                        {product && product.amazonSeller && (
                          <div className="col-6 text-center">
                            <Label className="d-block">Amazon</Label>
                            <a
                              href={product.amazonSeller.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {product.amazonSeller.name}
                            </a>
                          </div>
                        )}
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Row>
            <Row>
              <div className="col-12 mt-5">
                <div className="bg-white rounded border p-4">
                  <Badge
                    color={"primary"}
                    pill
                    className="badge-lg float-right mb-3"
                    id="publication-badge"
                  >
                    {product ? formatDate(product.createdAt) : ""}
                  </Badge>
                  <UncontrolledTooltip placement="top" target="publication-badge">
                    {t("PUBLISH_DATE")}
                  </UncontrolledTooltip>
                  <h2>{t("DESCRIPTION")}</h2>
                  <p className="text-left mb-0">
                    <small style={{ whiteSpace: "pre-line" }}>
                      {product ? product.description : ""}
                    </small>
                  </p>
                </div>
              </div>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default withTranslation()(ProductDetail);
