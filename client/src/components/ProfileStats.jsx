import {withTranslation} from "react-i18next";
import {Badge, Col, Row} from "reactstrap";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import React from "react";
import PropTypes from "prop-types";

const ProfileStats = ({userId, testsCount}) => {
    return <div className="card-profile-stats">
        <div>
            <Badge color="primary" pill className="badge-lg" id={'prcessing-tests-' + userId}>
                <span className="heading">{testsCount.processing}</span>
            </Badge>
            <UncontrolledTooltip target={'prcessing-tests-' + userId}>
                Tests en cours
            </UncontrolledTooltip>
        </div>
        <div>
            <Badge color="success" pill className="badge-lg" id={'completed-tests-' + userId}>
                <span className="heading">{testsCount.completed}</span>
            </Badge>
            <UncontrolledTooltip target={'completed-tests-' + userId}>
                Tests terminés
            </UncontrolledTooltip>
        </div>
        <div>
            <Badge color="danger" pill className="badge-lg" id={'guilty-tests-' + userId}>
                <span className="heading">{testsCount.guilty}</span>
            </Badge>
            <UncontrolledTooltip target={'guilty-tests-' + userId}>
                Tests annulés ou en réclamation
            </UncontrolledTooltip>
        </div>
    </div>
}

ProfileStats.propTypes = {
    userId: PropTypes.string.isRequired,
    testsCount: PropTypes.shape({
        processing: PropTypes.number.isRequired,
        completed: PropTypes.number.isRequired,
        guilty: PropTypes.number.isRequired,
    }).isRequired
};

export default withTranslation()(ProfileStats)