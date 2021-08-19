export const changeHeightType = 'CHANGE_HEIGHT'

const initialState = {
  height: 0,
}

export const actionCreators = {
  changeHeight: (height) => async (dispatch, getState) => {
    dispatch({
      type: changeHeightType,
      height,
    })
  },
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case changeHeightType:
      return Object.assign({}, state, {
        height: action.height,
      })
    default:
      return state
  }
}
