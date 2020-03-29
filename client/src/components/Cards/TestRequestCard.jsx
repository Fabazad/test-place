import React, {useState} from "react";
import {Badge, Card, CardBody, Row} from "reactstrap";
import constants from "../../helpers/constants";
import {formatDate, textSlice} from "../../helpers/textHelpers";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import TestStatusIcon from "../TestStatusIcon";
import {withTranslation} from "react-i18next";
import ShowTestRequestButton from "../Buttons/ShowTestRequestButton";
import CancelTestRequestButton from "../Buttons/CancelTestRequestButton";
import testServices from "../../services/test.services";
const {USER_ROLES} = constants;

const TestRequestCard = (props) => {
    const {test, t, userType, onShowButtonClick} = props;
    const {product, seller, tester} = test;

    const [statuses, setStatuses] = useState({});
    testServices.getTestStatuses().then(statuses => setStatuses(statuses));

    if (!product || !seller || !tester) return '';

    const handleShowButtonClick = () => {
        onShowButtonClick(test._id);
    };

    return (
        <Card className={"card-lift--hover shadow border-0"}>
            <CardBody>
                <div style={{'height': '200px'}} className={"text-center"}>
                    <Link to={'/ad/' + product._id}>
                        <img
                            src={product.imageUrls.length ? product.imageUrls[0] : constants.BASE_PRODUCT_PICTURE_URL}
                            alt=""
                            className={"mw-100 shadow-lg rounded"}
                            style={{'maxHeight': '200px'}}/>
                    </Link>
                </div>
                <div style={{height: '58px'}}>
                    <Link to={'/ad/' + product._id}>
                        <h5 className="text-primary mt-4">
                            {product.title ? textSlice(product.title, 80) : ''}
                        </h5>
                    </Link>
                </div>
                <Row className='mt-3'>
                    <div className="col-6 text-center">
                        <small>Prix Amazon</small>
                        <h1>
                            <Badge color="primary" pill className={'badge-xl'}>
                                {product.price ? product.price : ' '} €
                            </Badge>
                        </h1>
                    </div>
                    <div className="col-6 text-center">
                        <small>Coût Final</small>
                        <h1>
                            <Badge color={product && product.finalPrice > 0 ? "warning" : "success"} pill
                                   size={'xl'}>
                                {'finalPrice' in product ? product.finalPrice : ' '} €
                            </Badge>
                        </h1>
                    </div>
                </Row>
                <Row className='mt-3'>
                    {userType === USER_ROLES.TESTER ?
                        <div className="col-6 text-center">
                        <small>Vendeur</small>
                        <Link to={'#'}>
                            <h4 className='mt-2'>
                                {seller.name ? seller.name : '-'}
                            </h4>
                        </Link>
                    </div> : null}
                    {userType === USER_ROLES.SELLER ?
                        <div className="col-6 text-center">
                            <small>Testeur</small>
                            <Link to={'#'}>
                                <h4 className='mt-2'>
                                    {tester.name ? tester.name : '-'}
                                </h4>
                            </Link>
                        </div> : null}
                    <div className="col-6 text-center">
                        <small>Date</small>
                        <h1>
                            <Badge color={"info"} pill
                                   size={'xl'}>
                                {test.createdAt ? formatDate(test.createdAt) : '-'}
                            </Badge>
                        </h1>
                    </div>
                </Row>
                <div className="mt-3 row">
                    <div className="text-center col-12">
                        <small>Status</small>
                        <div>
                            <TestStatusIcon status={test.status}/>
                            <small className="text-muted ml-2">
                                {test.status ? t(test.status) : '-'}
                            </small>
                        </div>
                    </div>

                </div>
                <div className="row mt-3">
                    {userType === USER_ROLES.TESTER && test.status === statuses['requested'] ? (
                        <CancelTestRequestButton testId={test._id}/>) : null}
                    <ShowTestRequestButton onClick={handleShowButtonClick} testId={test._id}/>
                </div>
            </CardBody>
        </Card>
    )
};

TestRequestCard.propTypes = {
    test: PropTypes.object.isRequired,
    userType: PropTypes.string.isRequired,
    onShowButtonClick: PropTypes.func.isRequired
};

export default withTranslation()(TestRequestCard);