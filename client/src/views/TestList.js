import React from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import Col from "reactstrap/es/Col";
import TestListWithControls from "../components/TestListWithControls";
import PropTypes from "prop-types";

const TestList = ({title, statuses, globalStatus, userRole}) => {

    return (
        <>
            <Header>
                <div className="py-3"></div>
            </Header>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col xs={12}>
                        <TestListWithControls title={title}
                                              statusesOptions={statuses}
                                              globalStatus={globalStatus}
                                              userRole={userRole}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

TestList.propTypes = {
    title: PropTypes.string.isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    globalStatus: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired
};

export default TestList;
