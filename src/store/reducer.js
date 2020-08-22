import * as actionTypes from './actions.js';


const initialState = {
    isLogged: false,
    userData : { },
    mindmaps : { }
}

const reducer = (state = initialState, action) => {
    console.log(action.value);
    switch (action.type) {
        case actionTypes.LOGIN_STATUS:
            return {
                ...state,
                isLogged : action.value
            }
    }
    return state;
}
// state.mindmaps.concat(arg) .. updating an array by adding an item, it return a new array

export default reducer;