import React, { useEffect, useState } from "react";
import testServices from "../../services/test.services";
import userService from "../../services/user.services";

// reactstrap components
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Row,
} from "reactstrap";
// core components
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import UserHeader from "../../components/Headers/UserHeader.jsx";
import UpdatePasswordModal from "../../components/Modals/UpdatePasswordModal";
import constants from "../../helpers/constants";
import { scrollTo } from "../../helpers/scrollHelpers";
import MySellerInfoForm from "./MySellerInfoForm";
import MyTesterInfoForm from "./MyTesterInfoForm";
import MyUserInfoForm from "./MyUserInfoForm";

const { USER_ROLES, GENDERS } = constants;

const Profile = (props) => {
  const { t } = props;

  const [user, setUser] = useState(userService.currentUser);
  const [firstLogin, setFirstLogin] = useState(!user.lastLogin);

  useEffect(() => {
    const subscriber = userService.currentUserSubject.subscribe(setUser);
    return () => subscriber.unsubscribe();
  }, []);

  if (firstLogin && user.roles.includes(USER_ROLES.TESTER)) {
    toast.info(t("GIVE_PAYPAL_AND_AMAZON_ID"));
    scrollTo("profile-info-section");
    setFirstLogin(false);
  }

  const isUserSeller = user.roles.includes(USER_ROLES.SELLER);
  const isUserTester = user.roles.includes(USER_ROLES.TESTER);

  const changeGender = async () => {
    const newGender = user.gender === GENDERS.MALE ? GENDERS.FEMALE : GENDERS.MALE;
    await userService.changeGender(newGender);
  };

  const testGlobalStatusesCount = testServices.testGlobalStatusesCount ?? {
    guilty: 0,
    processing: 0,
    completed: 0,
  };

  return (
    <>
      <UserHeader />
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
                      className="rounded-circle"
                      src={require("assets/img/undraws/male_avatar.svg").default}
                      id="profile-img"
                    />
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between"></div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row className="mt-4">
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <Badge color="primary" pill className="badge-lg d-block">
                          <span className="heading">
                            {testGlobalStatusesCount.processing || 0}
                          </span>
                        </Badge>
                        <span className="description">{t("PROCESSING")}</span>
                      </div>
                      <div>
                        <Badge color="success" pill className="badge-lg d-block">
                          <span className="heading">
                            {testGlobalStatusesCount.completed || 0}
                          </span>
                        </Badge>
                        <span className="description">{t("COMPLETED")}</span>
                      </div>
                      <div>
                        <Badge color="danger" pill className="badge-lg d-block">
                          <span className="heading">
                            {testGlobalStatusesCount.guilty || 0}
                          </span>
                        </Badge>
                        <span className="description">{t("CANCELLED")}</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center mt-3">
                  <h3>{user.name}</h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
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
                    <h3 className="mb-0">{t("MY_PROFILE")}</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <MyUserInfoForm />

                {isUserTester ? <MyTesterInfoForm user={user} /> : null}

                {isUserSeller ? <MySellerInfoForm user={user} /> : null}

                <hr className="my-4" id="actions-section" />
                {/* Actions */}
                <h6 className="heading-small text-muted mb-4">{t("ACTIONS")}</h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="6">
                      <FormGroup className="text-center">
                        <UpdatePasswordModal />
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

export default withTranslation()(Profile);
