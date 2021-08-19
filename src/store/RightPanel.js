import { openEditType, fetchFieldsType } from './Incidents'
import { openRightPanelType } from './Grid'

const switchPanelType = 'SWITCH_PANEL'
const changeRightChangedType = 'CHANGE_RIGHT_CHANGED'
const setDiaType = 'SET_DIA'

const initialState = {
  open: false,
  closeDia: null,
  changed: false,
  incidentInfo: null,
}

export const actionCreators = {
  switch: () => ({ type: switchPanelType }),
  change: (isChange) => ({ type: changeRightChangedType, isChange }),
  openEdit: () => ({ type: openEditType }),
  setDia: (dia) => ({ type: setDiaType, dia: dia || null }),
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case setDiaType:
      return Object.assign({}, state, {
        closeDia: action.dia,
        changed: false,
      })
    case changeRightChangedType:
      return Object.assign({}, state, {
        changed: action.isChange,
      })
    case switchPanelType:
      return Object.assign({}, state, {
        open: !state.open,
      })
    case openRightPanelType:
      return Object.assign({}, state, {
        open: true,
        incident: action.incident,
      })
    case fetchFieldsType:
      return Object.assign({}, state, {
        fields: action.fields,
      })
    default:
      return state
  }
}
