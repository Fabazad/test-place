import React from "react";

// reactstrap components
import {
    Container,
    Row
} from "reactstrap";
// core components
import Header from "../components/Headers/Header.jsx";
import constants from "../helpers/constants";
import Col from "reactstrap/es/Col";
import TestListWithControls from "../components/TestListWithControls";

const {USER_ROLES, TEST_GLOBAL_STATUSES} = constants;

class ReceivedDemands extends React.Component {

    constructor(props) {
        super(props);
        this.statusesFilterOptions = ['requested', 'requestCancelled', 'requestDeclined', 'requestAccepted'];
    }

    render() {
        return (
            <>
                <Header>
                    <div className="py-3"></div>
                </Header>
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xs={12}>
                            <TestListWithControls title="Mes Demandes de Test Reçues"
                                                  statusesOptions={this.statusesFilterOptions}
                                                  globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}
                                                  userRole={USER_ROLES.SELLER}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default ReceivedDemands;
