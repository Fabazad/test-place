import React, {useEffect, useState} from "react";
import Header from "../../components/Headers/Header";
import {Container, Row} from "reactstrap";
import TestListWithControls from "../../components/TestListWithControls";
import testsServices from "../../services/test.services";
import {withTranslation} from "react-i18next";

const MyCurrentTests = (props) => {

    const {t} = props;

    const [statusesOptions, setStatusesOptions] = useState([]);

    useEffect(() => {
        testsServices.getTestStatuses().then(statuses => {
            const statusesOptions = ['requested', 'requestCancelled', 'requestDeclined', 'requestAccepted']
                .map(status => ({value: statuses[status], text: t(statuses[status])}));
            setStatusesOptions(statusesOptions);
        });
    }, []);

    return (
        <>
            <Header>
                <div className="py-3"></div>
            </Header>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <TestListWithControls title="Mes Tests en Cours" statusesOptions={statusesOptions}/>
                    </div>
                </Row>
            </Container>
        </>
    )
};

export default withTranslation()(MyCurrentTests);