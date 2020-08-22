import * as actionTypes from '../actions';



const initialState = {
    mindmaps : [],
    currentmap: {},
    folderdata : {},
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_MAP:
            return {
                ...state,
                mindmaps : action.value
            }
        case actionTypes.SELECT_MAP_TO_EDIT:
            return {
                ...state,
                currentmapid : [action.value]
            }
    }
    return state;

}

export default reducer;