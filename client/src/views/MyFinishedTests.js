import React from "react";
import Header from "../components/Headers/Header";
import {Container, Row} from "reactstrap";
import TestListWithControls from "../components/TestListWithControls";
import {withTranslation} from "react-i18next";
import Col from "reactstrap/es/Col";
import constants from "../helpers/constants";

const {USER_ROLES, TEST_GLOBAL_STATUSES} = constants;

const MyFinishedTests = (props) => {

    const {t} = props; // eslint-disable-line no-unused-vars

    const statusesOptions = ['reviewValidated', 'reviewDeclined'];

    return (
        <>
            <Header>
                <div className="py-3"></div>
            </Header>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <TestListWithControls title="Mes Tests Terminés" statusesOptions={statusesOptions}
                                              userRole={USER_ROLES.TESTER}
                                              globalStatus={TEST_GLOBAL_STATUSES.COMPLETED}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

export default withTranslation()(MyFinishedTests);