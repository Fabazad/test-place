import React, {useEffect, useState} from "react";
import userService from "../../services/user.services";
import testServices from "../../services/test.services";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Container,
    Row,
    Col
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.jsx";
import UpdatePasswordModal from "../../components/Modals/UpdatePasswordModal";
import MySellerInfoForm from "./MySellerInfoForm";
import constants from "../../helpers/constants";
import MyTesterInfoForm from "./MyTesterInfoForm";
import {toast} from "react-toastify";
import {scrollTo} from "../../helpers/scrollHelpers";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";

const {USER_ROLES, GENDERS} = constants;

const Profile = () => {

    const [user, setUser] = useState(userService.currentUser);
    const [firstLogin, setFirstLogin] = useState(!user.lastLogin);

    useEffect(() => {
        const subscriber = userService.currentUserSubject.subscribe(setUser);
        return () => subscriber.unsubscribe();
    }, []);

    if (firstLogin && user.roles.includes(USER_ROLES.TESTER)) {
        toast.info("Commencez par indiquer votre email paypal et votre identifiant Amazon.");
        scrollTo('profile-info-section');
        setFirstLogin(false);
    }

    const isUserSeller = user.roles.includes(USER_ROLES.SELLER);
    const isUserTester = user.roles.includes(USER_ROLES.TESTER);

    const changeGender = async () => {
        const newGender = user.gender === GENDERS.MALE ? GENDERS.FEMALE : GENDERS.MALE;
        await userService.changeGender(newGender);
    };

    const testGlobalStatusesCount = testServices.testGlobalStatusesCount ?? {requested: 0, processing: 0, completed: 0};

    return (
        <>
            <UserHeader/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <img
                                            alt="..."
                                            className="rounded-circle cursor-pointer"
                                            src={require("assets/img/undraws/"+ user.gender.toLowerCase() + "_avatar.svg")}
                                            onClick={changeGender} id="profile-img"
                                        />
                                        <UncontrolledTooltip placement="top" target="profile-img">
                                            Cliquer pour changer
                                        </UncontrolledTooltip>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                <div className="d-flex justify-content-between">
                                </div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading">{testGlobalStatusesCount.completed}</span>
                                                <span className="description">Terminés</span>
                                            </div>
                                            <div>
                                                <span className="heading">#</span>
                                                <span className="description">Annulés</span>
                                            </div>
                                            <div>
                                                <span className="heading">{testGlobalStatusesCount.processing}</span>
                                                <span className="description">En cours</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>{user.name}</h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                        {user.email}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl="8" id="profile-info-section">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Mon Profil</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/*<MyInfoForm user={user}/>*/}
                                {isUserTester ? <MyTesterInfoForm user={user}/> : null}

                                {isUserSeller ? <MySellerInfoForm user={user}/> : null}

                                <hr className="my-4" id='actions-section'/>
                                {/* Actions */}
                                <h6 className="heading-small text-muted mb-4">
                                    Actions
                                </h6>
                                <div className="pl-lg-4">
                                    <Row>
                                        <Col md="6">
                                            <FormGroup className="text-center">
                                                <UpdatePasswordModal/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
