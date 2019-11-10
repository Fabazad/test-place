import { 
    FETCH_STEP_REQUEST, 
    FETCH_STEP_FAILURE, 
    FETCH_STEP_SUCCESS
} from "../actions/steps";

const step = (state = {}, action) => {
    switch (action.type) {
        case FETCH_STEP_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_STEP_FAILURE:
            return {
                error: action.error
            }
        case FETCH_STEP_SUCCESS:
            return {
                ...action.step
            }
        default:
            return state
    }
}

export default step;