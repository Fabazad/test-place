import PropTypes from "prop-types";

const ProcessingTestRow = props => {

    const {test, userRole} = props;

    return null;

};

ProcessingTestRow.propTypes = {
    test: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired
};

export default ProcessingTestRow;