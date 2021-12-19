import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import PopoverBody from "reactstrap/es/PopoverBody";
import {Badge, Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import userServices from "../services/user.services";
import Loading from "./Loading";
import {withTranslation} from "react-i18next";
import IdHelper from "../helpers/IdHelper";
import Popover from "reactstrap/es/Popover";
import Button from "reactstrap/es/Button";
import ProfileStats from "./ProfileStats";
import EmailLink from "./EmailLink";
import CertifiedIcon from "./CertifiedIcon";

const UserProfilePopover = ({userId, t, userName, showMail = true, isCertified}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [target, _] = useState(IdHelper.newId('user-popover').toString());

    useEffect(() => {
        if (isOpen && !user) {
            (async () => {
                setLoading(true);
                try {
                    const {
                        user,
                        processingTestsCount,
                        completedTestsCount,
                        guiltyTestsCount
                    } = await userServices.getOne(userId);
                    user.testsCount = {
                        processing: processingTestsCount,
                        completed: completedTestsCount,
                        guilty: guiltyTestsCount
                    };
                    setUser(user);
                } catch (e) {
                    console.error(e);
                }
                setLoading(false);
            })()
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggle = () => setIsOpen(!isOpen);

    const onClick = e => {
        e.preventDefault()
    };

    return (
        <>
            <UncontrolledTooltip target={target} delay={0}>{t("SEE_STATS")}</UncontrolledTooltip>
            <Button id={target} className="cursor-pointer" color="primary" size="sm" onClick={onClick}>
                {userName}{isCertified && <CertifiedIcon className="ml-2"/>}
            </Button>
            <Popover placement="auto" trigger="legacy" target={target} toggle={toggle} isOpen={isOpen}>
                <PopoverBody className="p-0" style={{width: "200px", height: showMail ? "250px" : "225px"}}>
                    <Loading loading={loading}/>
                    {!loading ?
                        <Card className="card-profile">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <img
                                            alt="..."
                                            className="rounded-circle"
                                            width="130"
                                            style={{maxWith: "130px!important"}}
                                            src={require("assets/img/undraws/" + (user ? user.gender.toLowerCase() : 'male') + "_avatar.svg")}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-7 pt-md-0 pb-0 pb-md-4">
                                <div className="d-flex justify-content-between"></div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row className="mt-0 mt-md-5">
                                    <div className="text-center w-100">
                                        <h3>{user && user.name}{isCertified && <CertifiedIcon className="ml-2"/>}</h3>
                                        {showMail && <div className="h5 font-weight-300">
                                            <i className="ni location_pin mr-2"/>
                                            {user ? <EmailLink email={user.email}
                                                               subject={t("TESTPLACE_EMAIL_SUBJECT")}></EmailLink> : ''}
                                        </div>}
                                    </div>
                                </Row>
                                <Row>
                                    <Col xs={12} className="text-center">
                                        <Badge pill color="primary" className='badge-lg shadow'>
                                            {user && t(user.roles[0])}
                                        </Badge>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col mt-4">
                                        {user && <ProfileStats testsCount={user.testsCount} userId={userId}/>}
                                    </div>
                                </Row>
                            </CardBody>
                        </Card> : null
                    }
                </PopoverBody>
            </Popover>
        </>
    )
};

UserProfilePopover.propTypes = {
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    showMail: PropTypes.bool,
    onClick: PropTypes.func,
    isCertified: PropTypes.bool
};

export default withTranslation()(UserProfilePopover);