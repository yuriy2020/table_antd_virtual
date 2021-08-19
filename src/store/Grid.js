import HttpUtil from '../util/HttpUtil'
import { BASE_URL } from '../const/api'
import { changeHeightType } from './BottomPanel'
import { rightPading } from '../components/_Grid1'
import { showToastType } from './Incidents'
import { actionCreators as RightPanel } from './RightPanel'

const startFetchType = 'START_FETCH_INCIDENTS'
const getGridFields = 'GET_GRID_FIELDS'
const changeWidthsType = 'CHANGE_WIDTHS_TYPE'
const sortColumnsType = 'SORT_COLUMNS'
export const fetchType = 'FETCH_INCIDENTS'
export const setRefreshTimerType = 'SET_REFRESH_TIMER'
export const fetchRowType = 'FETCH_INCIDENTS_ROW'
export const openRightPanelType = 'OPEN_RIGHT_PANEL_FROM_GRID'
export const selecteRowType = 'SELECT_ROW'
export const unSelecteRowType = 'UNSELECT_ROW'
const changeCurrentPageType = 'CHANGE_CURRENT_PAGE'
const changeColumnVisibilityType = 'CHANGE_COLUMN_VISIBILITY'
const changeMenuColumnsCountType = 'CHANGE_MENU_COLUMNS_COUNT'
const setSortType = 'SET_SORT'
const setCount = 'SET_COUNT'
const FETCH_DATA = 'FETCH_DATA'

export const ROW_PER_PAGE = 25

const initialState = {
  heightOffset: 0,
  data: [],
  dataInverse: [],
  perPage: ROW_PER_PAGE,
  rowEnd: 0,
  sortBy: 'dateCreated',
  sortDir: 'desc',
  rowStart: 0,
  columns: [
    {
      // name: 'Наименование', // Old Grid class
      // dataKey: 'name',
      title: 'Наименование',
      key: 'name',
      dataIndex: 'name',
      visible: true,
      hard: true,
      sorter: (a, b) => a.name.length - b.name.length,
      // width:200
    },
    {
      title: 'Описание',
      key: 'description',
      dataIndex: 'description',
      visible: true,
      hard: true,
      // width:200
    },
    {
      title: 'Дата создания',
      key: 'dateCreated',
      dataIndex: 'dateCreated',
      dataType: 'date',
      visible: true,
      hard: true,
      // width:200
    },
    {
      title: 'Правило',
      key: 'correlationRuleName',
      dataIndex: 'correlationRuleName',
      visible: false,
      hard: true,
      // width:200
    },
    {
      title: 'Статус',
      key: 'incidentStatus',
      dataIndex: 'incidentStatus',
      dataType: 'dict',
      visible: true,
      hard: true,
      // width:200
    },
    {
      title: 'Важность',
      key: 'incidentRelevance',
      dataIndex: 'incidentRelevance',
      dataType: 'dict',
      visible: true,
      hard: true,
      // width:200
    },
    {
      title: 'Автор',
      key: 'author',
      dataIndex: 'author',
      visible: true,
      hard: true,
      // width:200
    },
  ],
  widths: {},
  menuColumnCount: 3,
  refreshTimer: null,
  isLoading: true,
  selectedInc: [],
  total: 0,
  count: 0,
}

let firstTimeReq = true

export const actionCreators = {
  showIncident: (incident) => async (dispatch, getState) => {
    if (getState().rightPanel.changed && getState().rightPanel.open) {
      dispatch(
        RightPanel.setDia(() => {
          dispatch({
            type: openRightPanelType,
            incident,
          })
        })
      )
    } else {
      dispatch({
        type: openRightPanelType,
        incident,
      })
    }
  },
  selectRow: (id) => async (dispatch, getState) => {
    dispatch({
      type: selecteRowType,
      id,
    })
  },
  delete: (id) => async (dispatch, getState) => {
    HttpUtil.fetchEdit(`${BASE_URL}/delincs`, JSON.stringify([id]), 'POST', false, (data) => {
      if (data.error !== null) {
        dispatch({
          type: showToastType,
          header: 'УДАЛЕНИЕ',
          text: data.error,
        })
      } else {
        dispatch({
          type: showToastType,
          header: 'УДАЛЕНИЕ',
          text: 'Инцидент успешно удалён',
        })
      }
      dispatch({
        type: unSelecteRowType,
        id,
      })

      dispatch(actionCreators.refreshGrid(false))
    })
    dispatch({
      type: selecteRowType,
      id,
    })
  },
  changeColumnVisible: (key) => async (dispatch, getState) => {
    dispatch({
      type: changeColumnVisibilityType,
      key,
    })
  },
  changeColumnsCount: (count) => async (dispatch, getState) => {
    dispatch({
      type: changeMenuColumnsCountType,
      count,
    })
  },
  fetch: () => async (dispatch, getState) => {
    let url = `${BASE_URL}/newinc/get`
    let params = {
      take: 1,
      skip: 0,
      sortDir: getState().grid.sortDir,
      sortBy: getState().grid.sortBy,
      passportType:
        // process.env.REACT_APP_PARAMS.toLowerCase() === 'postmodern' ? 'Full' : process.env.REACT_APP_PARAMS || '',
        process.env.REACT_APP_PARAMS || '',
    }
    console.log('fetch', params)

    if (window.location.search.indexOf('method') > -1) {
      let p = HttpUtil.serializeGetStringToObject(window.location.search.substr(1))
      url = `${BASE_URL}/newinc/${p.method}`

      delete p.method
      p.sortDir = getState().grid.sortDir
      p.sortBy = getState().grid.sortBy

      params = p
    }
    HttpUtil.fetchGet(url, params, false, (data) => {
      dispatch({
        type: fetchType,
        total: data.total,
      })
    })

    HttpUtil.fetchGet(`${BASE_URL}/vizfields`, null, true, (data) => {
      const columns = data.value.map((f) => ({
        name: f.fieldNameRus,
        dataKey: f.fieldPath,
        visible: f.checked,
        dataType: f.dataType,
      }))
      dispatch({
        type: getGridFields,
        columns,
      })
    })
  },
  refreshGrid: (timer) => async (dispatch, getState) => {
    console.log('Grid.refreshGrid')
    firstTimeReq = true
    dispatch(actionCreators.getRows(0, getState().grid.rowEnd - getState().grid.rowStart, false, 0, timer))
    // dispatch(actionCreators.getRows(0, getState().grid.rowEnd, false, 0, timer))
  },
  onSort: (dataKey) => async (dispatch, getState) => {
    dispatch({
      type: setSortType,
      sortBy: dataKey,
    })
    dispatch(actionCreators.refreshGrid(true))
  },

  fetchInterval: (url, params, dispatch, inverse, visiblePerPage, startOver, stopOver, visiblePage) => {
    HttpUtil.fetchGet(url, params, false, (data) => {
      window.rows = data
      dispatch({
        type: fetchRowType,
        rows: data.value,
        inverse,
        totalPages: Math.ceil(data.total / visiblePerPage),
        total: data.total,
        startOver,
        stopOver,
        page: visiblePage,
      })
    })
  },

  getRows: (startOver, stopOver, inverse, start, setTimer) => async (dispatch, getState) => {
    let timer = null
    // console.log(startOver, stopOver);
    const take = stopOver - startOver + 1
    const visiblePerPage = getState().grid.perPage
    const visiblePage = Math.floor(start / visiblePerPage) + 1

    let params = {
      take,
      skip: startOver,
      sortDir: getState().grid.sortDir,
      sortBy: getState().grid.sortBy,
      passportType:
        // process.env.REACT_APP_PARAMS.toLowerCase() === 'postmodern' ? 'Full' : process.env.REACT_APP_PARAMS || '',
        process.env.REACT_APP_PARAMS || '',
    }

    let url = `${BASE_URL}/newinc/get`

    if (window.location.search.indexOf('method') > -1) {
      let p = HttpUtil.serializeGetStringToObject(window.location.search.substr(1))
      url = `${BASE_URL}/newinc/${p.method}`

      delete p.method
      p.sortDir = getState().grid.sortDir
      p.sortBy = getState().grid.sortBy
      p.take = take

      params = p
    }

    const topState = getState().topPanel
    if (topState.group !== 0) {
      params.onMy = topState.group
    }
    if (topState.applySearch !== '') {
      params.search = topState.applySearch
    }
    if (topState.refreshInterval.value !== null && topState.refreshInterval.value !== -1) {
      params.d1 = new Date(Date.now() - topState.refreshInterval.value).toISOString()
      params.d2 = new Date().toISOString()
    } else if (topState.refreshInterval.value === -1 && topState.d1 !== null && topState.d2 !== null) {
      params.d1 = topState.d1.toISOString()
      params.d2 = topState.d2.toISOString()
    }

    HttpUtil.fetchGet(
      `${BASE_URL}/newinc/CountByUser/?passportType=${process.env.REACT_APP_PARAMS}`,
      null,
      true,
      (data) => {
        dispatch({
          type: setCount,
          count: data.value,
        })
      }
    )

    actionCreators.fetchInterval(url, params, dispatch, inverse, visiblePerPage, startOver, stopOver, visiblePage)

    clearInterval(getState().grid.refreshTimer)
    if (getState().topPanel.autoRefresh) {
      timer = setInterval(() => {
        actionCreators.fetchInterval(url, params, dispatch, inverse, visiblePerPage, startOver, stopOver, visiblePage)
        firstTimeReq = false

        console.count('autoUpdate')
      }, /* getState().topPanel.refreshInterval.value * 60 */ (window.sessionStorage.getItem('autoUpdateInterval') || 5) * 1000)
      dispatch({
        type: setRefreshTimerType,
        timer,
      })
    }
  },
  changePage: (event) => async (dispatch, getState) => {
    dispatch({
      type: changeCurrentPageType,
      page: event.currentTarget.value,
    })
  },
  changeWidths: (index, deltaX, inverse) => async (dispatch, getState) => {
    dispatch({
      type: changeWidthsType,
      index,
      deltaX,
      inverse,
    })
  },
  sortColumns: (columns) => async (dispatch, getState) => {
    dispatch({
      type: sortColumnsType,
      columns,
    })
  },
  fetchData: async (params) => {
    return {
      type: FETCH_DATA,
    }
  },
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case setSortType:
      return {
        ...state,
        sortBy: action.sortBy,
        sortDir: action.sortBy !== state.sortBy ? 'asc' : state.sortDir === 'asc' ? 'desc' : 'asc',
      }
    case unSelecteRowType:
      var selectedInc
      if (action.id === 'all') {
        selectedInc = []
      } else {
        selectedInc = state.selectedInc.filter((i) => i.id !== action.id.id)
      }
      return {
        ...state,
        selectedInc,
      }
    case selecteRowType:
      var selectedInc
      if (!state.selectedInc.find((si) => si.id === action.id.id)) {
        selectedInc = [...state.selectedInc, action.id]
      } else {
        selectedInc = state.selectedInc.filter((i) => i.id !== action.id.id)
      }
      return {
        ...state,
        selectedInc,
      }
    case changeMenuColumnsCountType:
      return {
        ...state,
        menuColumnCount: action.count,
      }
    case changeColumnVisibilityType:
      var columns = state.columns.map((c) => {
        if (c.dataKey === action.key) {
          return {
            ...c,
            visible: !c.visible,
          }
        }
        return c
      })

      var widths = {}
      var visibleColumns = columns.filter((c) => c.visible)
      visibleColumns.forEach((c) => {
        widths[c.dataKey] = Math.round(100 / visibleColumns.length) / 100
      })

      return {
        ...state,
        columns,
        widths,
      }
    case sortColumnsType:
      return {
        ...state,
        columns: action.columns,
      }
    case changeWidthsType:
      const { deltaX, index } = action
      const percentDelta = deltaX / (window.innerWidth - (action.inverse ? 0 : rightPading))

      const dataKey = state.columns[index - 1].dataKey
      const nextDataKey = state.columns[index].dataKey

      var widths = {
        ...state.widths,
        [dataKey]: state.widths[dataKey] + percentDelta,
        [nextDataKey]: state.widths[nextDataKey] - percentDelta,
      }

      return {
        ...state,
        widths,
      }
    case setRefreshTimerType:
      return {
        ...state,
        refreshTimer: action.timer,
      }
    case getGridFields:
      var columns = [...state.columns, ...action.columns]
      var widths = {}
      var visibleColumns = columns.filter((c) => c.visible)
      visibleColumns.forEach((c) => {
        widths[c.dataKey] = Math.round(100 / visibleColumns.length) / 100
      })

      return {
        ...state,
        columns,
        widths,
      }
    case changeHeightType:
      return {
        ...state,
        heightOffset: action.height,
      }
    case startFetchType:
      return {
        ...state,
        data: [],
        dataInverse: [],
        isLoading: true,
      }
    case changeCurrentPageType:
      return {
        ...state,
        currentPage: action.page,
      }
    case fetchRowType:
      // console.log('action', action)
      var data = []
      for (let i = 0; i <= action.stopOver - action.startOver; i++) {
        const index = i + action.startOver
        if (!data[index]) {
          data[index] = action.rows[i]
        }
      }

      return {
        ...state,
        [action.inverse ? 'dataInverse' : 'data']: data,
        currentPage: action.page,
        totalPages: action.totalPages,
        rowEnd: action.stopOver,
        rowStart: action.startOver,
        total: action.total,
      }
    case fetchType:
      return {
        ...state,
        total: action.total,
      }
    case setCount:
      return {
        ...state,
        count: action.count,
      }

    default:
      return state
  }
}
