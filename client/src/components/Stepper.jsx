import React from "react"
import PropTypes from 'prop-types';
import {UncontrolledTooltip} from "reactstrap";

const Step = ({reached, label, icon, isCurrent, stepKey, error}) => {
    const random = Math.round(Math.random() * 1000).toString()
    const key = "stepper-step-" + stepKey + '-' + random
    return <div className={`stepper-step ${reached ? 'reached' : ''} ${isCurrent ? 'current' : ''} ${error ? 'error' : ''}`}>
        <div id={key}>
            <i className={icon}/>
        </div>
        <UncontrolledTooltip target={key}>{label}</UncontrolledTooltip>
        <h3 className="d-none d-lg-block">{label}</h3>
    </div>
}

Step.propTypes = {
    label: PropTypes.string.isRequired,
    stepKey: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    reached: PropTypes.bool.isRequired,
    isCurrent: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired
}

const Line = ({reached, isCurrent}) => {
    return <div className={`stepper-line ${reached ? 'reached' : ''} ${isCurrent ? 'current' : ''}`}/>
}

Line.propTypes = {
    reached: PropTypes.bool.isRequired,
    isCurrent: PropTypes.bool.isRequired
}

const Stepper = ({steps, currentStep, endKey}) => {
    const reachedIndex = currentStep.key === endKey ? 100 : steps.findIndex(step => step.key === currentStep.key);

    return <div className="stepper mb-0 mb-lg-5">
        {steps.map((step, i) => <>
            {i !== 0 && <Line key={'line-' + step.key} reached={reachedIndex > i - 1} isCurrent={i === reachedIndex}/>}
            <Step
                key={'step-' + step.key}
                label={step.label}
                icon={step.icon}
                reached={reachedIndex > i}
                isCurrent={i === reachedIndex}
                stepKey={step.key}
                error={i === reachedIndex && currentStep.error}
            />
        </>)}
    </div>
}

Stepper.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
    })).isRequired,
    currentStep: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        error: PropTypes.bool.isRequired
    })).isRequired,
    endKey: PropTypes.string.isRequired
}

export default Stepper