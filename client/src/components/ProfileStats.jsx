import {withTranslation} from "react-i18next";
import {Badge} from "reactstrap";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import React from "react";
import PropTypes from "prop-types";

const ProfileStats = ({userId, testsCount, t}) => {
    return <div className="card-profile-stats">
        <div>
            <Badge color="primary" pill className="badge-lg" id={'prcessing-tests-' + userId}>
                <span className="heading">{testsCount.processing}</span>
            </Badge>
            <UncontrolledTooltip target={'prcessing-tests-' + userId}>
                {t("PROCESSING_TESTS")}
            </UncontrolledTooltip>
        </div>
        <div>
            <Badge color="success" pill className="badge-lg" id={'completed-tests-' + userId}>
                <span className="heading">{testsCount.completed}</span>
            </Badge>
            <UncontrolledTooltip target={'completed-tests-' + userId}>
                {t("COMPLETED_TESTS")}
            </UncontrolledTooltip>
        </div>
        <div>
            <Badge color="danger" pill className="badge-lg" id={'guilty-tests-' + userId}>
                <span className="heading">{testsCount.guilty}</span>
            </Badge>
            <UncontrolledTooltip target={'guilty-tests-' + userId}>
                {t("CANCELLED_TESTS")}
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