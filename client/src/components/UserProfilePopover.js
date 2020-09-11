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

const UserProfilePopover = ({userId, t, userName, showMail = true}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [target, _] = useState(IdHelper.newId('user-popover').toString());

    useEffect(() => {
        if (isOpen && !user) {
            (async () => {
                setLoading(true);
                try {
                    const {user, processingTestsCount, completedTestsCount, guiltyTestsCount} = await userServices.getOne(userId);
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

    return (
        <>
            <span id={target}  className="cursor-pointer text-primary">{userName}</span>
            <Popover placement="auto" trigger="legacy" target={target} toggle={toggle} isOpen={isOpen}>
                <PopoverBody className="p-0" style={{width: "200px", height: showMail ? "300px" : "200px"}}>
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
                                    <Col xs={12} className="text-center">
                                        <Badge pill color="info" className='badge-lg shadow'>
                                            {user ? t(user.roles[0]) : ""}
                                        </Badge>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="col">
                                        <Row className="card-profile-stats">
                                            <Col xs={4} className="m-0">
                                                <Badge color="primary" pill className="badge-lg"
                                                       id={'prcessing-tests-' + userId}>
                                                    <span
                                                        className="heading">{user ? user.testsCount.processing : 0}</span>
                                                </Badge>
                                                <UncontrolledTooltip target={'prcessing-tests-' + userId}>
                                                    En cours
                                                </UncontrolledTooltip>
                                            </Col>
                                            <Col xs={4} className="m-0">
                                                <Badge color="success" pill className="badge-lg"
                                                       id={'completed-tests-' + userId}>
                                                    <span
                                                        className="heading">{user ? user.testsCount.completed : 0}</span>
                                                </Badge>
                                                <UncontrolledTooltip target={'completed-tests-' + userId}>
                                                    Terminés
                                                </UncontrolledTooltip>
                                            </Col>
                                            <Col xs={4} className="m-0">
                                                <Badge color="danger" pill className="badge-lg"
                                                       id={'guilty-tests-' + userId}>
                                                    <span
                                                        className="heading">{user ? user.testsCount.guilty : 0}</span>
                                                </Badge>
                                                <UncontrolledTooltip target={'guilty-tests-' + userId}>
                                                    Annulés ou en Reclamation
                                                </UncontrolledTooltip>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>{user ? user.name : ''}</h3>
                                    { showMail ? <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                         {user ? user.email : ''}
                                    </div> : null }
                                </div>
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
    showMail: PropTypes.bool
};

export default withTranslation()(UserProfilePopover);