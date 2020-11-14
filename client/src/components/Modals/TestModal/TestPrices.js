import PropTypes from "prop-types";
import Col from "reactstrap/es/Col";
import Label from "reactstrap/lib/Label";
import {Badge} from "reactstrap";
import Row from "reactstrap/es/Row";
import React from "react";
import {withTranslation} from "react-i18next";

const TestPrices = props => {

    const {price, finalPrice, t} = props;

    return (
        <Row className='w-100 m-0'>
            <Col xs={6} className="text-center">
                <Label>{t("INITIAL_PRICE")}</Label>
                <h3>
                    <Badge color='primary'>{price}€</Badge>
                </h3>
            </Col>
            <Col xs={6} className="text-center">
                <Label>{t("FINAL_PRICE")}</Label>
                <h3>
                    <Badge color={finalPrice > 0 ? 'warning' : 'success'}>
                        {finalPrice}€
                    </Badge>
                </h3>
            </Col>
        </Row>
    );
};

TestPrices.propTypes = {
    price: PropTypes.number.isRequired,
    finalPrice: PropTypes.number.isRequired
};

export default withTranslation()(TestPrices);