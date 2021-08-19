import { changeSettingsType } from '../store/TopPanel'
import HttpUtil from '../util/HttpUtil'
import { BASE_URL } from '../const/api'

export const fetchFieldsType = 'FETCH_ALL_FIELDS'
export const fetchRightsType = 'FETCH_RIGHTS'
export const fetchWGType = 'FETCH_WORKING_GROUPS'
export const fetchUsersType = 'FETCH_USERS'
export const fetchStatusDictType = 'FETCH_STATUS_DICT'
export const fetchGeoType = 'FETCH_GEO'
export const fetchRelevanceDictType = 'FETCH_RELEVANCE_DICT'
export const fetchNodesType = 'FETCH_NODES'
export const openEditType = 'OPEN_EDIT'
export const showToastType = 'SHOW_TOAST'
export const fetchIncTypesType = 'FETCH_INCIDENT_TYPE'
const hideToastType = 'HIDE_TOAST'
export const fieldInputsValue = 'FIELDS_INPUTS_VALUE'

const initialState = {
  viewType: 'board',
  toast: null,
  workingGroups: [],
  editOpen: false,
  fields: [],
}

export const actionCreators = {
  fetchFields: () => async (dispatch, getState) => {
    HttpUtil.fetchGet(`${BASE_URL}/ExtFields?typeName=Incident`, null, false, (data) => {
      dispatch({
        type: fetchFieldsType,
        fields: data.value,
      })
    })
  },
  hideToast: () => ({ type: hideToastType }),
  fetchRights: () => async (dispatch, getState) => {
    HttpUtil.fetchGet(`${BASE_URL}/incgrants/getmygrants`, null, true, (data) => {
      dispatch({
        type: fetchRightsType,
        rights: data.value,
      })
    })
  },
  fetchDicts: () => async (dispatch, getState) => {
    HttpUtil.fetchGet(`${BASE_URL}/incgrants/usersforappoint`, null, true, (data) => {
      dispatch({
        type: fetchUsersType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/ExtFieldEnums/Incident/type`, null, false, (data) => {
      dispatch({
        type: fetchIncTypesType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/incgrants/groupsforappoint`, null, true, (data) => {
      dispatch({
        type: fetchWGType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/val/incstatus`, null, true, (data) => {
      dispatch({
        type: fetchStatusDictType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/val/increlevance`, null, true, (data) => {
      dispatch({
        type: fetchRelevanceDictType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/inc/incnodes`, null, true, (data) => {
      dispatch({
        type: fetchNodesType,
        data: data.value,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/val/geo`, null, true, (data) => {
      dispatch({
        type: fetchGeoType,
        data: data.value,
      })
    })
  },
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case showToastType:
      return Object.assign({}, state, {
        toast: {
          header: action.header,
          text: action.text,
          warning: action.warning,
        },
      })
    case hideToastType:
      return Object.assign({}, state, {
        toast: null,
      })
    case openEditType:
      return Object.assign({}, state, {
        editOpen: true,
      })
    /*case fetchWGType:
        return Object.assign({}, state, {
            workingGroups: action.workingGroups,
        });*/
    case changeSettingsType:
      return Object.assign({}, state, {
        viewType: action.settings.viewType,
      })
    case fetchFieldsType:
      return Object.assign({}, state, {
        fields: action.fields,
      })
    default:
      return state
  }
}
