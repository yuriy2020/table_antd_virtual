const FIELDS_VALUES = 'FIELDS_VALUES'

export const fieldsValuesAC = (payload) => {
  return {
    type: FIELDS_VALUES,
    payload,
  }
}

const initialState = {
  fieldInput: {},
  fieldName: '',
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIELDS_VALUES:
      return { ...state, fieldInput: action.payload }
    default:
      return state
  }
}
