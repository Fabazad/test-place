import { 
    FETCH_STEPS_REQUEST, 
    FETCH_STEPS_FAILURE, 
    FETCH_STEPS_SUCCESS 
} from "../actions/steps";

const steps = (state = {items: []}, action) => {
    switch (action.type) {
        case FETCH_STEPS_REQUEST:
            return {
                items: [...state.items],
                loading: true
            }
        case FETCH_STEPS_FAILURE:
            return {
                items: [],
                error: action.error
            }
        case FETCH_STEPS_SUCCESS:
            return {
                items: [...action.steps]
            }
        default:
            return state
    }
}

export default steps;