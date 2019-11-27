import stepService from "services/product.service"

export const FETCH_STEP_REQUEST = "FETCH_STEP_REQUEST";
export const FETCH_STEP_FAILURE = "FETCH_STEP_FAILURE";
export const FETCH_STEP_SUCCESS = "FETCH_STEP_SUCCESS";

export const fetchStep = _id => {
    const request = () => ({
        type: FETCH_STEP_REQUEST
    });
    
    const failure = error => ({
        type: FETCH_STEP_FAILURE,
        error
    });
    
    const success = step => ({
        type: FETCH_STEP_SUCCESS,
        step
    });

    return dispatch => {
        dispatch(request());
        stepService.getOne(_id).then(
            step => dispatch(success(step)),
            error => dispatch(failure(error))
        )

    }
}

export const FETCH_STEPS_REQUEST = "FETCH_STEPS_REQUEST";
export const FETCH_STEPS_FAILURE = "FETCH_STEPS_FAILURE";
export const FETCH_STEPS_SUCCESS = "FETCH_STEPS_SUCCESS";

export const fetchSteps = query => {
    const request = () => ({
        type: FETCH_STEPS_REQUEST
    });
    
    const failure = error => ({
        type: FETCH_STEPS_FAILURE,
        error
    });
    
    const success = steps => ({
        type: FETCH_STEPS_SUCCESS,
        steps
    });

    return dispatch => {
        dispatch(request());
        stepService.find(query).then(
            steps => dispatch(success(steps)),
            error => dispatch(failure(error))
        )

    }
}
