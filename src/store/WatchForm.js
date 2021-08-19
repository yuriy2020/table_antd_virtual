import {
  fetchRelevanceDictType,
  fetchStatusDictType,
  fetchWGType,
  showToastType,
  fetchNodesType,
  fetchGeoType,
  fetchUsersType,
  fetchIncTypesType,
} from './Incidents'
import { actionCreators as Grid } from './Grid'
import { BASE_URL } from '../const/api'
import { fetchRowType } from './Grid'
import HttpUtil from '../util/HttpUtil'

const initialState = {
  statuses: [],
  geoLocations: [],
  relevances: [],
  workingGroups: [],
  users: [],
  incTypes: [],
  nodes: [],
}

export const actionCreators = {
  refreshGrid: () => async (dispatch, getState) => {
    dispatch(Grid.refreshGrid(true))
  },
  showToast: (type) => async (dispatch, getState) => {
    console.log('toast type: ' + type)
    if (type === 'edit') {
      dispatch({
        type: showToastType,
        header: 'СОХРАНЕНО',
        text: 'Изменения инцидента успешно сохранены',
      })
      dispatch(Grid.refreshGrid(true))
    } else if (type === 'editError') {
      dispatch({
        type: showToastType,
        header: 'НЕ СОХРАНЕНО',
        text: 'Изменения не были сохранены!',
        warning: true,
      })
    } else if (type === 'save' || type === 'create') {
      dispatch({
        type: showToastType,
        header: 'СОХРАНЕНО',
        text: 'Создан новый инцидент',
      })
    } else if (type === 'createError') {
      dispatch({
        type: showToastType,
        header: 'ОШИБКА',
        text: 'Инцидент не был создан!',
        warning: true,
      })
    } else if (type === 'createByArchivedEvents') {
      dispatch({
        type: showToastType,
        header: 'ОШИБКА ПРИ СОЗДАНИИ',
        text: 'К инциденту нельзя привязывать архивные события!',
        warning: true,
      })
    } else if (type === 'delete') {
      dispatch({
        type: showToastType,
        header: 'УДАЛЕНИЕ',
        text: 'Инцидент успешно удалён',
      })
    }
  },
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case fetchStatusDictType:
      return Object.assign({}, state, {
        statuses: action.data,
      })
    case fetchIncTypesType:
      return Object.assign({}, state, {
        incTypes: action.data,
      })
    case fetchRelevanceDictType:
      return Object.assign({}, state, {
        relevances: action.data,
      })
    case fetchGeoType:
      return Object.assign({}, state, {
        geoLocations: action.data,
      })
    case fetchWGType:
      return Object.assign({}, state, {
        workingGroups: action.data,
      })
    case fetchUsersType:
      return Object.assign({}, state, {
        users: action.data,
      })
    case fetchNodesType:
      return Object.assign({}, state, {
        nodes: action.data,
      })
    default:
      return state
  }
}
