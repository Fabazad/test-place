import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Badge, UncontrolledTooltip} from "reactstrap";
import {withTranslation} from "react-i18next";
import testServices from "../services/test.services";
import constants from "../helpers/constants";

const {TEST_GLOBAL_STATUSES} = constants;

const TestStatusIcon = (props) => {
    const {status, globalStatus, t} = props;

    const [statuses, setStatuses] = useState({});

    const isRequested = globalStatus === TEST_GLOBAL_STATUSES.REQUESTED;
    const isProcessing = globalStatus === TEST_GLOBAL_STATUSES.PROCESSING;
    const isCompleted = globalStatus === TEST_GLOBAL_STATUSES.COMPLETED;

    testServices.getTestStatuses().then(statusesRes => setStatuses(statusesRes));

    const getStatusColor = () => {
        if (!Object.keys(statuses).length) return '';

        if (isRequested) {
            if (statuses['requested'] === status) return 'warning';
            if (statuses['requestCancelled'] === status) return 'default';
            if (statuses['requestDeclined'] === status) return 'danger';
            if (statuses['requestAccepted'] === status) return 'success';
        }

        if (isProcessing) {

        }

        if (isCompleted) {

        }

        return '';

    };

    const getIconClass = () => {
        if (!Object.keys(statuses).length) return '';

        if (isRequested) {
            if (statuses['requested'] === status) return 'fa-hourglass';
            if (statuses['requestCancelled'] === status) return 'fa-times';
            if (statuses['requestDeclined'] === status) return 'fa-hand-paper';
            if (statuses['requestAccepted'] === status) return 'fa-check';
        }

        if (isProcessing) {

        }

        if (isCompleted) {

        }

        return '';
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
    status: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired
};

export default withTranslation()(TestStatusIcon);