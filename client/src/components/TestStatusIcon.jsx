import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Badge, UncontrolledTooltip} from "reactstrap";
import {withTranslation} from "react-i18next";
import testServices from "../services/test.services";

const TestStatusIcon = (props) => {
    const {status, t} = props;

    const [statuses, setStatuses] = useState({});

    testServices.getTestStatuses().then(statusesRes => setStatuses(statusesRes));

    const getStatusColor = () => {
        if (!Object.keys(statuses).length) return '';
        if (statuses['requested'] === status) return 'warning';
        if (statuses['requestCancelled'] === status) return 'default';
        if (statuses['requestDeclined'] === status) return 'danger';
        return 'success';
    };

    const getIconClass = () => {
        if (!Object.keys(statuses).length) return '';
        if (statuses['requested'] === status) return 'fa-hourglass';
        if (statuses['requestCancelled'] === status) return 'fa-times';
        if (statuses['requestDeclined'] === status) return 'fa-hand-paper';
        return 'fa-check';
    };

    const tooltipId = Math.ceil(Math.random() * 10000);

    return (
        <>
            <Badge pill className="badge-circle" color={getStatusColor()} id={'status-' + tooltipId}>
                <i className={"fa m-auto " + getIconClass()}/>
            </Badge>
            <UncontrolledTooltip delay={0} target={"status-" + tooltipId}>{t(status)}</UncontrolledTooltip>
        </>
    );
};

TestStatusIcon.propTypes = {
    status: PropTypes.string.isRequired
};

export default withTranslation()(TestStatusIcon);