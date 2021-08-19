import HttpUtil from '../util/HttpUtil'
import { BASE_URL } from '../const/api'
import { setRefreshTimerType, openRightPanelType } from './Grid'

const startFetchType = 'START_FETCH_INCIDENTS_KANBAN'
export const fetchType = 'FETCH_INCIDENTS_KANBAN'
const changeStatusType = 'CHANGE_STATUS'

const initialState = {
  data: [],
  refreshTimer: null,
  isLoading: true,
  perPage: 30,
}

export const actionCreators = {
  showIncident: (id) => async (dispatch, getState) => {
    dispatch({ type: openRightPanelType, id })
  },
  changeStatus: (id, status) => async (dispatch, getState) => {
    dispatch({
      type: changeStatusType,
      id,
      status,
    })
  },
  fetch: () => async (dispatch, getState) => {
    let state = getState().kanban
    let perPage = state.perPage

    let fetchFunction = () => {
      HttpUtil.fetchGet(
        `${BASE_URL}/newinc/get`,
        {
          perPage,
          page: 1,
          sortDir: 'desc',
          sortBy: 'dateCreated',
        },
        true,
        (data) => {
          dispatch({
            type: fetchType,
            data: data.value,
          })
        }
      )
    }

    HttpUtil.fetchGet(`${BASE_URL}/vizfields`, null, true, (data) => {})

    fetchFunction()
    var timer = setInterval(() => {
      fetchFunction()
    }, 5 * 60 * 1000)
    dispatch({
      type: setRefreshTimerType,
      timer,
    })
  },
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case changeStatusType:
      let data = state.data.map((d) => {
        if (d.id === action.id) {
          let fields = d.fields.map((f) => {
            if (f.path === 'status') {
              return { ...f, value: action.status }
            }
            return f
          })
          return { ...d, fields }
        }
        return d
      })

      return Object.assign({}, state, {
        data,
      })
    case setRefreshTimerType:
      return Object.assign({}, state, {
        refreshTimer: action.timer,
      })
    case startFetchType:
      return Object.assign({}, state, {
        data: [],
        isLoading: true,
      })
    case fetchType:
      return Object.assign({}, state, {
        data: action.data,
      })
    default:
      return state
  }
}
