import {
  fetchRowType,
  fetchType,
  selecteRowType,
  deleteIncidentType,
  unSelecteRowType,
  actionCreators as Grid,
} from './Grid'
import HttpUtil from '../util/HttpUtil'
import { BASE_URL } from '../const/api'
import {
  fetchRightsType,
  showToastType,
  fetchStatusDictType,
  fetchRelevanceDictType,
  fetchNodesType,
  fetchWGType,
  fetchUsersType,
  fetchGeoType,
} from './Incidents'

const checkRefreshType = 'CHECK_REFRESH'
const changeGroupType = 'CHANGE_GROUP'
const changeSearchType = 'CHANGE_SEARCH'
const setRefreshTimerValueType = 'SET_REFRESH_TIMER_VALUE'
const changeSearchTextType = 'CHANGE_SEARCH_TEXT'
const toggleCustomFormType = 'TOGGLE_CUSTOM_FORM'
const setCustomDateType = 'SET_CUSTOM_DATE'
const changeCurrentPageType = 'CHANGE_CURRENT_PAGE'
export const changeSettingsType = 'CHANGE_SETTINGS'

const CREATE_DIALOG_OPEN = 'CREATE_DIALOG_OPEN'
const GROUP_SELECTOR_OPEN = 'GROUP_SELECTOR_OPEN'
const SETTINS_OPEN = 'SETTINS_OPEN'
const SHOW_DOWNLOAD = 'SHOW_DOWNLOAD'
const DATE_START_OPEN = 'DATE_START_OPEN'
const DATE_END_OPEN = 'DATE_END_OPEN'
const ACCOMPLISH_OPEN = 'ACCOMPLISH_OPEN'
const UPLOADER_OPEN = 'UPLOADER_OPEN'
const COMPLEX_EDIT = 'COMPLEX_EDIT'
const AUTO_UPDATE_INTERVAL = 'AUTO_UPDATE_INTERVAL'
const HAS_ARCHIVE = 'HAS_ARCHIVE'
const DELETE_CONFIRM = 'DELETE_CONFIRM'
const SEARCH_OPEN = 'SEARCH_OPEN'
const SEARCH_TEXT = 'SEARCH_TEXT'


const initialState = {
  currentPage: 1,
  totalPages: 0,
  rights: [],
  statuses: [],
  workingGroups: [],
  users: [],
  relevances: [],
  nodes: [],
  geoLocations: [],
  group: 3,
  autoRefresh: true,
  hasArchive: false,
  archiveChecked: false,
  pushSearchEnter: false,
  applySearch: '',
  selectedInc: [],
  refreshInterval: {
    value: null,
    label: 'Все инциденты',
  },
  d1: null,
  d2: null,
  customRange: false,
  settings: {
    viewType: 'grid',
    open: false
  },

  // ==  перенесено со стейта компонента
  createDialogOpen: false,
  groupSelectorOpen: false,
  //search ?
  settingsOpen: false,
  showDownload: false,
  accomplishOpen: false,
  uploaderOpen: false,
  isComplexEdit: false,
  autoUpdateInterval: window.sessionStorage.getItem('autoUpdateInterval') || 30,
  hasArchive: false,
  archiveChecked: false,
  deleteConfirmOpen: false,
  searchOpen: false,
  searchText: '',
  dateStartOpen: false,
  dateEndOpen: false,
}

export const actionCreators = {
  setDate: (dtype, date) => async (dispatch, getState) => {
    dispatch({
      type: setCustomDateType,
      dtype,
      date,
    })
    if (getState().topPanel.d1 !== null && getState().topPanel.d2 !== null) {
      dispatch(Grid.refreshGrid(true))
    }
  },
  toggleCustomForm: (isShow) => ({
    type: toggleCustomFormType,
    isShow,
  }),
  setSearchText: (text) => ({
    type: changeSearchTextType,
    text,
  }),
  changeSettings: (settings) => ({
    type: changeSettingsType,
    settings,
  }),
  complexEditFinish: (header, text, isWarning) => async (dispatch, getState) => {
    dispatch({
      type: showToastType,
      header,
      text,
      warning: isWarning,
    })
  },
  complexEditWarning: () => async (dispatch, getState) => {
    const state = getState().topPanel
    if (state.selectedInc.length < 2) {
      dispatch({
        type: showToastType,
        header: 'РЕДАКТИРОВАНИЕ',
        text: 'Выберите два или более инцидентов для редактирования',
        warning: true,
      })
    }
  },
  download: (fileType) => async (dispatch, getState) => {
    const state = getState().topPanel
    if (state.selectedInc.length === 0) {
      dispatch({
        type: showToastType,
        header: 'ВЫГРУЗКА',
        text: 'Не выбран инцидент(ы) для выгрузки',
        warning: true,
      })
      return
    }
    state.selectedInc
      .map((s) => s.id || s)
      .forEach((id) => {
        let url = `${BASE_URL}/inc/json/${id}`

        if (fileType !== undefined) {
          url = `${BASE_URL}/inc/file/${id}/${fileType}`
        }

        HttpUtil.fetchIncDownload(
          url,
          null,
          true,
          (data) => {
            let filename = `Инцидент ${id}.${fileType}`
            let a = document.createElement('a')

            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            setTimeout(function () {
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }, 0)
            return
          },
          () => {
            dispatch({
              type: showToastType,
              header: 'ВЫГРУЗКА',
              text: 'Отказано в доступе',
              warning: true,
            })
            return
          }
        )
      })
  },
  upload: () => async (dispatch, getState) => {
    const state = getState().topPanel
    if (state.selectedInc.length === 0) {
      dispatch({
        type: showToastType,
        header: 'ВЫГРУЗКА',
        text: 'Не выбран инцидент(ы) для выгрузки',
        warning: true,
      })
      return
    }
    state.selectedInc
      .map((s) => s.id)
      .forEach((id) => {
        HttpUtil.fetchGet(`${BASE_URL}/inc/json/${id}`, null, true, (data) => {
          const file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
          const filename = `Инцидент ${id}.json`

          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, filename)
          } else {
            const a = document.createElement('a')
            const url = URL.createObjectURL(file)
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            setTimeout(() => {
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }, 0)
          }
        })
      })
  },
  _delete: () => async (dispatch, getState) => {
    const state = getState().topPanel
    if (state.selectedInc.length === 0) {
      dispatch({
        type: showToastType,
        header: 'УДАЛЕНИЕ',
        text: 'Не выбран инцидент(ы) для удаления',
        warning: true,
      })
      return
    }

    HttpUtil.fetchEdit(
      `${BASE_URL}/delincs`,
      JSON.stringify(state.selectedInc.map((s) => s.id)),
      'POST',
      false,
      (data) => {
        if (data.error !== null) {
          dispatch({
            type: showToastType,
            header: 'УДАЛЕНИЕ',
            text: data.error,
            warning: true,
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
          id: 'all',
        })

        dispatch(Grid.refreshGrid(false))
      }
    )
  },
  searchInc: () => async (dispatch, getState) => {
    dispatch({
      type: changeSearchType,
      text: getState().topPanel.searchText,
    })

    window.clearInterval(getState().grid.refreshTimer)

    dispatch(Grid.refreshGrid(true))
  },
  setTimer: (time) => async (dispatch, getState) => {
    dispatch({
      type: setRefreshTimerValueType,
      time,
    })
    dispatch(Grid.refreshGrid(true))
  },
  changeGroup: (group) => async (dispatch, getState) => {
    dispatch({
      type: changeGroupType,
      group,
    })
    dispatch(Grid.refreshGrid(true))
  },
  changeRefresh: (isRefresh) => async (dispatch, getState) => {
    dispatch({
      type: checkRefreshType,
      autoRefresh: isRefresh,
    })
    dispatch(Grid.refreshGrid(true))
  },
  changePage: (value) => ({
    type: changeCurrentPageType,
    value,
  }),
  createDialogOpen_AC: (value) => ({
    type: CREATE_DIALOG_OPEN,
    value,
  }),
  groupSelectorOpen_AC: (value) => ({
    type: GROUP_SELECTOR_OPEN,
    value,
  }),
  settingsOpen_AC: (value) => ({
    type: SETTINS_OPEN,
    value,
  }),
  showDownload_AC: (value) => ({
    type: SHOW_DOWNLOAD,
    value,
  }),
  dateStartOpen_AC: (value) => ({
    type: DATE_START_OPEN,
    value,
  }),
  dateEndOpen_AC: (value) => ({
    type: DATE_END_OPEN,
    value,
  }),
  accomplishOpen_AC: (value) => ({
    type: ACCOMPLISH_OPEN,
    value,
  }),
  uploaderOpen_AC: (value) => ({
    type: UPLOADER_OPEN,
    value,
  }),
  isComplexEdit_AC: (value) => ({
    type: COMPLEX_EDIT,
    value,
  }),
  deleteConfirmOpen_AC: (value) => ({
    type: DELETE_CONFIRM,
    value,
  }),
  searchOpen_AC: (value) => ({
    type: SEARCH_OPEN,
    value,
  }),
  searchText_AC: (value) => ({
    type: SEARCH_TEXT,
    value,
  }),
  autoUpdateInterval_AC: (value) => ({
    type: AUTO_UPDATE_INTERVAL,
    value
  }),
  hasArchive_AC: (value) => ({
    type: HAS_ARCHIVE,
    value
  }),
  // archiveChecked_AC,
}

export const reducer = (state, action) => {
  state = state || initialState
  switch (action.type) {
    case HAS_ARCHIVE:
      return {
        ...state,
        hasArchive: action.value
      }
    case AUTO_UPDATE_INTERVAL:
      return {
        ...state,
        autoUpdateInterval: action.value
      }
    case GROUP_SELECTOR_OPEN:
      return {
        ...state,
        groupSelectorOpen: action.value
      }
    case DATE_START_OPEN:
      return {
        ...state,
        dateStartOpen: action.value,
      }
    case DATE_END_OPEN:
      return {
        ...state,
        dateEndOpen: action.value,
      }
    case SEARCH_TEXT:
      return {
        ...state,
        searchText: action.value,
      }
    case SEARCH_OPEN:
      return {
        ...state,
        searchOpen: action.value,
      }
    case UPLOADER_OPEN:
      return {
        ...state,
        uploaderOpen: action.value,
      }
    case SHOW_DOWNLOAD:
      return {
        ...state,
        showDownload: action.value,
      }
    case DELETE_CONFIRM:
      return {
        ...state,
        deleteConfirmOpen: action.value,
      }
    case COMPLEX_EDIT:
      return {
        ...state,
        isComplexEdit: action.value,
      }
    case CREATE_DIALOG_OPEN:
      return {
        ...state,
        createDialogOpen: action.value,
      }
    case changeCurrentPageType:
      return {
        ...state,
        currentPage: action.value,
      }
    case setCustomDateType:
      return {
        ...state,
        [action.dtype]: action.date,
      }
    case toggleCustomFormType:
      return {
        ...state,
        customRange: action.isShow,
      }
    case changeSearchType:
      return {
        ...state,
        applySearch: action.text,
      }
    case changeSearchTextType:
      return {
        ...state,
        search: action.text,
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
    case changeGroupType:
      return {
        ...state,
        group: action.group,
      }
    case changeSettingsType:
      return {
        ...state,
        settings: action.settings,
      }
    case fetchRightsType:
      return {
        ...state,
        rights: action.rights.actions,
      }
    case checkRefreshType:
      return {
        ...state,
        autoRefresh: action.autoRefresh,
      }
    case setRefreshTimerValueType:
      return {
        ...state,
        refreshInterval: action.time,
      }
    case fetchRowType:
      return {
        ...state,
        currentPage: action.page,
        totalPages: action.totalPages,
      }
    case fetchStatusDictType:
      return {
        ...state,
        statuses: action.data,
      }
    case fetchRelevanceDictType:
      return {
        ...state,
        relevances: action.data,
      }
    case fetchWGType:
      return {
        ...state,
        workingGroups: action.data,
      }
    case fetchGeoType:
      return {
        ...state,
        geoLocations: action.data,
      }
    case fetchUsersType:
      return {
        ...state,
        users: action.data,
      }
    case fetchNodesType:
      return {
        ...state,
        nodes: action.data,
      }
    default:
      return state
  }
}
