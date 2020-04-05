import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {Badge, UncontrolledTooltip} from "reactstrap";
import {withTranslation} from "react-i18next";
import testServices from "../services/test.services";
import constants from "../helpers/constants";

const {TEST_GLOBAL_STATUSES} = constants;

const TestStatusIcon = (props) => {
    const {status, globalStatus, t} = props;

    const [statusMapping, setStatusMapping] = useState({});

    useEffect(() => {
        testServices.getTestStatuses().then(statuses => {
            const statusMapping = {
                [TEST_GLOBAL_STATUSES.REQUESTED]: {
                    [statuses['requested']]: { color: 'warning', icon: 'fa-hourglass' },
                    [statuses['requestCancelled']]: { color: 'default', icon: 'fa-times' },
                    [statuses['requestDeclined']]: { color: 'danger', icon: 'fa-hand-paper' },
                    [statuses['requestAccepted']]: { color: 'success', icon: 'fa-check' },
                }
            };
            setStatusMapping(statusMapping);
        });
    }, []);

    const getStatusColor = () => {
        return Object.keys(statusMapping).length && statusMapping[globalStatus] && statusMapping[globalStatus][status]
            && statusMapping[globalStatus][status].color ?
            statusMapping[globalStatus][status].color : '';
    };

    const getIconClass = () => {
        return Object.keys(statusMapping).length && statusMapping[globalStatus] && statusMapping[globalStatus][status]
        && statusMapping[globalStatus][status].icon ?
            statusMapping[globalStatus][status].icon : '';
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