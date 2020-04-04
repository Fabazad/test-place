import React, {useEffect, useState} from "react";
import Header from "../../components/Headers/Header";
import {Container, Row} from "reactstrap";
import TestListWithControls from "../../components/TestListWithControls";
import testsServices from "../../services/test.services";
import {withTranslation} from "react-i18next";
import Col from "reactstrap/es/Col";
import constants from "../../helpers/constants";

const {USER_ROLES, TEST_GLOBAL_STATUSES} = constants;

const MyCurrentTests = (props) => {

    const {t} = props;

    const statusesOptions = ['requested', 'requestCancelled', 'requestDeclined', 'requestAccepted'];

    return (
        <>
            <Header>
                <div className="py-3"></div>
            </Header>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <TestListWithControls title="Mes Tests en Cours" statusesOptions={statusesOptions}
                                              userRole={USER_ROLES.TESTER}
                                              globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

export default withTranslation()(MyCurrentTests);