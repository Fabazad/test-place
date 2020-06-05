import React, {useEffect, useState} from "react";
import userService from "../../services/user.services";

// reactstrap components
import {
    Button,
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

const {USER_ROLES} = constants;

const Profile = () => {

    const [user, setUser] = useState(userService.currentUser);
    const [firstLogin, setFirstLogin] = useState(!user.lastLogin);

    useEffect(() => {
        const subscriber = userService.currentUserSubject.subscribe(setUser);
        return subscriber.unsubscribe();
    }, []);

    if (firstLogin && user.roles.includes(USER_ROLES.TESTER)) {
        toast.info("Commencez par indiquer votre email paypal et votre identifiant Amazon.");
        scrollTo('profile-info-section');
        setFirstLogin(false);
    }

    const isUserSeller = user.roles.includes(USER_ROLES.SELLER);
    const isUserTester = user.roles.includes(USER_ROLES.TESTER);

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
                                        <a href="#pablo" onClick={e => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={require("assets/img/theme/team-4-800x800.jpg")}
                                            />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                <div className="d-flex justify-content-between">
                                    <Button className="float-right" color="default" href="#pablo"
                                            onClick={e => e.preventDefault()}
                                            size="sm">
                                        Message
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading">22</span>
                                                <span className="description">Friends</span>
                                            </div>
                                            <div>
                                                <span className="heading">10</span>
                                                <span className="description">Photos</span>
                                            </div>
                                            <div>
                                                <span className="heading">89</span>
                                                <span className="description">Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>{user.name}</h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                        Bucharest, Romania
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="ni business_briefcase-24 mr-2"/>
                                        Solution Manager - Creative Tim Officer
                                    </div>
                                    <div>
                                        <i className="ni education_hat mr-2"/>
                                        University of Computer Science
                                    </div>
                                    <hr className="my-4"/>
                                    <p>
                                        Ryan — the name taken by Melbourne-raised, Brooklyn-based
                                        Nick Murphy — writes, performs and records all of his own
                                        music.
                                    </p>
                                    <a href="#pablo" onClick={e => e.preventDefault()}>
                                        Show more
                                    </a>
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
                                {isUserTester ? <MyTesterInfoForm user={user}/>  : null}

                                {isUserSeller ?  <MySellerInfoForm user={user}/> : null}

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
