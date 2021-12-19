import PropTypes from "prop-types";
import Col from "reactstrap/es/Col";
import Label from "reactstrap/lib/Label";
import {getAmazonProfileUrl} from "../../../helpers/urlHelpers";
import Row from "reactstrap/es/Row";
import React from "react";
import constants from "../../../helpers/constants";
import UserProfilePopover from "../../UserProfilePopover";
import {withTranslation} from "react-i18next";

const {USER_ROLES} = constants;

const SellerTesterInfo = props => {

    const {userRole, tester, seller, amazonSeller, t} = props;

    const user = userRole === USER_ROLES.SELLER ? tester
        : (userRole === USER_ROLES.TESTER ? seller
            : null);

    const userLabel = userRole === USER_ROLES.SELLER ? t("TESTER")
        : (userRole === USER_ROLES.TESTER ? t("SELLER")
            : null);

    const amazonProfileUrl = userRole === USER_ROLES.SELLER ? getAmazonProfileUrl(tester.amazonId)
        : (userRole === USER_ROLES.TESTER && amazonSeller ? amazonSeller.url
            : '#');

    const amazonTitle = userRole === USER_ROLES.SELLER ? t("PROFILE")
        : (userRole === USER_ROLES.TESTER && amazonSeller ? amazonSeller.name
            : '-');

    if (!user) return null;

    return (
        <Row className="w-100 m-0">
            <Col xs={6} className="text-center">
                <Label>{userLabel}</Label>
                <div>
                    <UserProfilePopover userId={user._id} userName={user.name} isCertified={user.isCertified}/>
                </div>
            </Col>
            <Col xs={6} className="text-center">
                <Label>Amazon</Label>
                <div>
                    <a href={amazonProfileUrl} target='_blank' rel="noopener noreferrer">
                        {amazonTitle}
                    </a>
                </div>
            </Col>
        </Row>
    )
};

SellerTesterInfo.propTypes = {
    userRole: PropTypes.string.isRequired,
    tester: PropTypes.object.isRequired,
    seller: PropTypes.object.isRequired,
    amazonSeller: PropTypes.object
};

export default withTranslation()(SellerTesterInfo);