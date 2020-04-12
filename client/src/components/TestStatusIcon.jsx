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
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        testServices.getTestStatuses().then(statuses => {
            const statusMapping = {
                [TEST_GLOBAL_STATUSES.REQUESTED]: {
                    [statuses['requested']]: { color: 'warning', icon: 'fa-hourglass' },
                    [statuses['requestCancelled']]: { color: 'default', icon: 'fa-times' },
                    [statuses['requestDeclined']]: { color: 'danger', icon: 'fa-hand-paper' },
                    [statuses['requestAccepted']]: { color: 'success', icon: 'fa-check' }
                },
                [TEST_GLOBAL_STATUSES.PROCESSING]: {
                    [statuses['requestAccepted']]: { color: 'warning', icon: 'fa-shopping-cart' },
                    [statuses['productOrdered']]: { color: 'warning', icon: 'fa-truck' },
                    [statuses['productReceived']]: { color: 'warning', icon: 'fa-box-open' }
                }
            };
            setStatuses(statuses);
            setStatusMapping(statusMapping);
        });
    }, []);

    const getStatusColor = () => {
        if (Object.keys(statusMapping).length && statusMapping[globalStatus]) {
            if (statusMapping[globalStatus][status] && statusMapping[globalStatus][status].color) {
                return statusMapping[globalStatus][status].color;
            }
            return 'success';
        }
        return '';
    };

    const getIconClass = () => {
        if (Object.keys(statusMapping).length && statusMapping[globalStatus]) {
            if (statusMapping[globalStatus][status] && statusMapping[globalStatus][status].icon) {
                return statusMapping[globalStatus][status].icon;
            }
            return 'fa-check';
        }
        return '';
    };

    const tooltipId = Math.ceil(Math.random() * 10000);

    return (
        <>
            <Badge pill className="badge-circle" color={getStatusColor()} id={'status-' + tooltipId}>
                <i className={"fa m-auto " + getIconClass()}/>
            </Badge>
            <UncontrolledTooltip delay={0} target={"status-" + tooltipId} placement="auto">
                {t(status)}
                {globalStatus === TEST_GLOBAL_STATUSES.PROCESSING && status === statuses['requestAccepted'] ? (
                    <span>,<br/>En attente de Commande</span>
                ) : null}
            </UncontrolledTooltip>
        </>
    );
};

TestStatusIcon.propTypes = {
    status: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired
};

export default withTranslation()(TestStatusIcon);