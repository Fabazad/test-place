import React from "react";
import PropTypes from "prop-types";
import constants from "../../helpers/constants";
import SentDemandRow from "./SentDemandRow";
import ReceivedDemandRow from "./ReceivedDemandRow";
import ProcessingTestRow from "./ProcessingTestRow";

const {USER_ROLES, TEST_GLOBAL_STATUSES, TEST_ROW_CLICK_ACTIONS} = constants;

const TestRow = props => {

    const {test, userRole, globalStatus, onClick} = props;

    if (!test || !userRole || !globalStatus) return null;

    const handleClick = (testId, action) => {
        if (onClick) {
            onClick(testId, action);
        }
    };

    return (
        <>
            {userRole === USER_ROLES.TESTER && globalStatus === TEST_GLOBAL_STATUSES.REQUESTED ? (
                <SentDemandRow test={test}
                               onShowButtonClick={testId => handleClick(testId, TEST_ROW_CLICK_ACTIONS.SHOW_TEST_REQUEST)}/>
            ) : null}

            {userRole === USER_ROLES.SELLER && globalStatus === TEST_GLOBAL_STATUSES.REQUESTED ? (
                <ReceivedDemandRow test={test}
                               onShowButtonClick={testId => handleClick(testId, TEST_ROW_CLICK_ACTIONS.SHOW_TEST_REQUEST)}/>
            ) : null}

            {userRole === USER_ROLES.TESTER && globalStatus === TEST_GLOBAL_STATUSES.PROCESSING ? (
                <ProcessingTestRow userRole={USER_ROLES.TESTER} test={test}/>
            ) : null}
        </>
    );
};

TestRow.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    globalStatus: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default TestRow;