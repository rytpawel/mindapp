import * as actionTypes from '../actions';



const initialState = {
    isLogged: false,
    methodOfLogged : "",
    userData : { },
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_STATUS:
            return {
                ...state,
                isLogged : action.value
            }
        case actionTypes.LOGGED_METHOD:
            return {
                ...state,
                methodOfLogged : action.value
            }
        case actionTypes.USER_DATA:
            return {
                ...state,
                userData : action.value
            }
        case actionTypes.USER_STATUS:
            return {
                ...state,
                isLogged: action.value.isLogged,
                methodOfLogged : action.value.loggedMethod,
                userData : action.value.userData
            }
        default :
            return {
                ...state,
            }
    }
}

export default reducer;