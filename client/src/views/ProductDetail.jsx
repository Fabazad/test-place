import React, {useEffect, useState} from "react";

// reactstrap components
import {
    Container, Row, Badge, Card, CardBody, Label
} from "reactstrap";

// core components
import SimpleFooter from "../components/Footers/SimpleFooter.jsx";
import productServices from '../services/product.service';
import userServices from '../services/user.services';
import constants from "../helpers/constants";
import {formatDate} from "../helpers/textHelpers";
import Carousel from "../components/Carousel";
import NewTestRequestModal from "../components/Modals/NewTestRequestModal/NewTestRequestModal";
import Loading from "../components/Loading";
import NewTestButton from "../components/Buttons/NewTestButton";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import UserProfilePopover from "../components/UserProfilePopover";
import {withTranslation, Trans} from "react-i18next";

const ProductDetail = props => {

    const {match, history, t} = props;

    const [product, setProduct] = useState(undefined);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const {productId} = match.params;
        productServices.getOne(productId)
            .then(setProduct)
            .catch(() => history.replace("/not-found"));
        productServices.getProductCategories().then(setCategories);
    }, []);

    const getProduct = (productValue) => {
        const product = categories.find(category => category.value === productValue);
        if (product) {
            return product.text;
        }
        return null;
    };

    const currentUser = userServices.currentUser;
    if (!product) {
        return <Loading/>;
    }

    const newTestRequestButtonDisabled = (currentUser && currentUser.roles.includes(constants.USER_ROLES.SELLER)) || product.remainingRequests < 1;

    const newTestButtonDisabled = !(!newTestRequestButtonDisabled && currentUser && currentUser.amazonId && currentUser.paypalEmail);

    return (
        <>
            <main>
                <section className="section section-shaped section-lg">
                    <div className="shape shape-style-1 bg-gradient-default">
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                    <Container className="pt-lg-md mb-5"><img src="" alt=""/></Container>
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
                            <polygon className="fill-secondary" points="2560 0 2560 100 0 100"/>
                        </svg>
                    </div>
                </section>
                <section className="section section-lg pt-0 mt--100">
                    <Container>
                        <Row>
                            <div className="col-12 col-md-6">
                                {product ? (
                                    <Carousel imageUrls={product.imageUrls}/>
                                ) : (
                                    <img src={constants.BASE_PRODUCT_PICTURE_URL}
                                         alt="product base" className="rounded shadow w-100"/>
                                )}
                            </div>
                            <div className="col-12 col-md-6 mt-3 mt-md-0">
                                <div className="text-center mt-4 d-flex justify-content-around">
                                    <div>
                                        <small className="text-muted d-block mb-1">{t("INITIAL_PRICE")}</small>
                                        <h1 className="d-inline-block">
                                            <Badge pill color={'primary'} className='badge-lg bg-secondary shadow'>
                                                {product.price} €
                                            </Badge>
                                        </h1>
                                    </div>
                                    <div>
                                        <small className='text-muted d-block mb-1'>{t("FINAL_PRICE")}</small>
                                        <h1 className="d-inline-block">
                                            <Badge pill className='badge-lg bg-secondary shadow'
                                                   color={product.finalPrice === 0 ? 'success' : 'warning'}>
                                                {product.finalPrice} €
                                            </Badge>
                                        </h1>
                                    </div>
                                    {/* Desktop view */}
                                    {product._id ? (
                                        <div className={"d-none d-md-block"}>
                                            <NewTestRequestModal productId={product._id}
                                                                 disabled={newTestRequestButtonDisabled}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                                {/* Mobile view */}
                                {product._id ? (
                                    <div className={"d-block d-md-none"}>
                                        <NewTestRequestModal productId={product._id}
                                                             disabled={newTestRequestButtonDisabled}
                                        />
                                    </div>
                                ) : null}

                                <div className="mt-5">
                                    <Label>
                                        Catégorie : {product ? getProduct(product.category) : null}
                                    </Label>
                                </div>
                                <div className="mt-2">
                                    <h1>{product ? product.title : ''}</h1>
                                </div>

                                {product.automaticAcceptance || product.isPrime ?
                                    <div className="mt-5 w-100">
                                        <div className="row">
                                            {product.automaticAcceptance ?
                                                <div className="col text-center">
                                                    <NewTestButton productId={product._id}
                                                                   disabled={newTestButtonDisabled}
                                                    />
                                                </div> : null}
                                            {product.isPrime ?
                                                <div className="col text-right d-flex mt-sm-0 mt-2">
                                                    <h2 className="d-inline-block m-auto">
                                                        <Badge pill color={'info'} className='badge-lg'>
                                                            <img src={require("assets/img/icons/prime.png")}
                                                                 alt="prime"
                                                                 style={{"height": "18px"}}/>
                                                        </Badge>
                                                    </h2>
                                                </div> : null}
                                            {product.automaticAcceptance ?
                                                <div className="text-left mt-4 col-12">
                                                    <small className="row">
                                                        <div className="col-1 text-center">
                                                            <i className="fa fa-bolt text-yellow"/>
                                                        </div>
                                                        <div className="col">
                                                            <Trans i18nKey="AUTOMATIC_ACCEPTANCE_EXPLAINED" components={{ b: <b /> }}/>
                                                        </div>
                                                    </small>
                                                </div> : null}
                                        </div>
                                    </div> : null}

                                <div className="mt-3">
                                    <Card>
                                        <CardBody>
                                            <h2 className="text-center">{t("SELLER")}</h2>
                                            <Row>
                                                <div className="col text-center">
                                                    <Label className='d-block'>Test Place</Label>
                                                    {product ?
                                                        <UserProfilePopover userName={product.seller.name}
                                                                            userId={product.seller._id}
                                                                            showMail={false}/> : null
                                                    }
                                                </div>
                                                {product && product.amazonSeller ? (
                                                    <div className="col-6 text-center">
                                                        <Label className='d-block'>Amazon</Label>
                                                        <a href={product.amazonSeller.url} target='_blank'
                                                           rel="noopener noreferrer">
                                                            {product.amazonSeller.name}
                                                        </a>
                                                    </div>
                                                ) : null}
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div className="col-12 mt-5">
                                <div className="bg-white rounded border p-4">
                                    <Badge color={'primary'} pill className='badge-lg float-right mb-3'
                                           id='publication-badge'>
                                        {product ? formatDate(product.createdAt) : ''}
                                    </Badge>
                                    <UncontrolledTooltip placement="top" target="publication-badge">
                                        {t("PUBLISH_DATE")}
                                    </UncontrolledTooltip>
                                    <h2>Description</h2>
                                    <p className="text-left mb-0">
                                        <small
                                            style={{whiteSpace: 'pre-line'}}>{product ? product.description : ''}</small>
                                    </p>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </section>
            </main>
            <SimpleFooter/>
        </>
    );
};

export default withTranslation()(ProductDetail);
