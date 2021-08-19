import React, { useState, useEffect, useRef } from 'react'
import { actionCreators } from '../store/TopPanel'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles, useTheme } from 'react-jss-10'

import Select from './common/Select'
import Text from './common/Text'
import Checkbox from './common/Checkbox'
import Pager from './common/Pager'
import Menu, { MenuItem } from './common/Menu'
import Input from './common/Input'
import CreateDialog from './CreateDialog'
// import ComplexEditDialog from './ComplexEditDialog'
import { DATE_TIME_FORMAT } from '../const/common'
import DateTimePicker from 'react-datetime-picker'
import Dialog from './common/Dialog'
import Uploader from './common/Uploader'
import { BASE_URL } from '../const/api'
import HttpUtil from '../util/HttpUtil'
import Button from './common/Button'
import { rowHeight } from './Grid'
import { ROW_PER_PAGE } from '../store/Grid'
import { menu } from '../const/common'

import { ReactComponent as EditIcon } from '../icons/button_edit_basic.svg'
import { ReactComponent as EditIconActive } from '../icons/button_edit.svg'
import { ReactComponent as DownloadIcon } from '../icons/button_download_basic.svg'
import { ReactComponent as DeleteIcon } from '../icons/button_delete_basic.svg'
import { ReactComponent as DeleteIconActive } from '../icons/button_delete.svg'
import { ReactComponent as SearchIcon } from '../icons/button_magnifer_basic.svg'
import { ReactComponent as SettingIcon } from '../icons/button_pref_basic.svg'
import { ReactComponent as AssignIcon } from '../icons/add_assign.svg'
import { ReactComponent as CloseIcon } from '../icons/close_icon.svg'

function _TopPanel({ fields, table }) {
  const theme = useTheme()
  const classes = useStyles(theme)
  const dispatch = useDispatch()

  let _topBar = useRef(null)
  let _groupSelector = useRef(null)
  let _dateStart = useRef(null)
  let _dateEnd = useRef(null)

  const [archive, setArchive] = useState({
    hasArchive: false,
    name: '',
    checked: false,
  })

  // ===== from Redux  =======
  const {
    currentPage,
    totalPages,
    statuses,
    selectedInc,
    workingGroups,
    users,
    relevances,
    nodes,
    geoLocations,
    group,
    autoRefresh,
    refreshInterval,
    d1,
    d2,
    customRange,
    rights,
    createDialogOpen,
    groupSelectorOpen,
    isComplexEdit,
    deleteConfirmOpen,
    showDownload,
    uploaderOpen,
    searchOpen,
    searchText,
    dateStartOpen,
    dateEndOpen,
    autoUpdateInterval,
  } = useSelector((state) => state.topPanel)

  const {
    setDate,
    changeRefresh,
    changeGroup,
    _delete,
    download,
    toggleCustomForm,
    setTimer,
    searchInc,
    complexEditFinish,
    createDialogOpen_AC,
    groupSelectorOpen_AC,
    showDownload_AC,
    dateStartOpen_AC,
    dateEndOpen_AC,
    uploaderOpen_AC,
    complexEditWarning,
    isComplexEdit_AC,
    deleteConfirmOpen_AC,
    upload,
    searchOpen_AC,
    searchText_AC,
    autoUpdateInterval_AC,
  } = actionCreators

  const _uploadInc = () => {
    let files = document.getElementById('form-uploader')[0].files

    HttpUtil.fetchPostFile(`${BASE_URL}/inc/upload`, 'POST', files, (data) => {
      console.log(data)
    })
  }

  const _getArchiveData = () => {
    HttpUtil.fetchGet(`${BASE_URL}/archive/getactive/`, null, true, (data) => {
      setArchive({
        ...archive,
        hasArchive: data.value.id > 0,
        name: data.value.name,
      })
    })
    HttpUtil.fetchGet(`${BASE_URL}/archive/checksearchinarchive/`, null, true, (data) => {
      setArchive({ ...archive, checked: data.value })
    })
  }
  const _setupArchiveCheckers = () => {
    setInterval(() => _getArchiveData(), 3000)
  }

  const _saveAutoUpdateInterval = (val) => {
    if (Number(val) !== val || autoUpdateInterval === val) {
      return
    }
    window.sessionStorage.setItem('autoUpdateInterval', val)
  }

  const _archiveToggled = (val) => {
    setArchive({ ...archive, checked: val })

    HttpUtil.fetchEdit(`${BASE_URL}/archive/searchinarchive/` + val, {}, 'POST', false, (response) => {
      console.log(response)
    })
  }

  const _setAutoUpdate = (val) => {
    if (val > 0) {
      dispatch(autoUpdateInterval_AC(val))
      window.sessionStorage.setItem('autoUpdateInterval', val)
      dispatch(changeRefresh(true))
    }
  }

  const _filter = (group) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(changeGroup(group))
    dispatch(groupSelectorOpen_AC(false))
  }

  useEffect(() => {
    // _setupArchiveCheckers()
    window.sessionStorage.setItem('autoUpdateInterval', autoUpdateInterval)
  }, [])

  // useEffect(() => {
  //   console.log(state.createDialogOpen)
  // },   [state.createDialogOpen])

  return (
    <div style={{ overflow: 'visible', paddingRight: 20 }}>
      <div className={classes.topBar} ref={_topBar}>
        {!searchOpen ? (
          <>
            <Button
              key='addInc'
              color='primary'
              title='Создать'
              disabled={rights && !rights.find((r) => r.actionName === 'CreateEdit')}
              style={{ fontFamily: 'Arial' }}
              onClick={() => dispatch(createDialogOpen_AC(true))}
            >
              +
            </Button>
            <div key='actionsInc' className={classes.flexGroup}>
              <Button
                disabled={rights && !rights.find((r) => r.actionName === 'CreateEdit')}
                onClick={() => {
                  selectedInc.length > 1 ? dispatch(isComplexEdit_AC(true)) : dispatch(complexEditWarning())
                }}
              >
                {selectedInc.length > 1 ? (
                  <EditIconActive tooltip='Редактировать' />
                ) : (
                  <EditIcon tooltip='Редактировать' />
                )}
              </Button>

              <Button
                key={'btn-download'}
                id={'download-top'}
                disabled={rights && !rights.find((r) => r.actionName === 'Download')}
                onClick={() => dispatch(showDownload_AC(true))}
              >
                <DownloadIcon />
              </Button>

              <Menu
                key={'menu-download'}
                anchor={document.getElementById('download-top')}
                open={showDownload}
                onClose={() => dispatch(showDownload_AC(false))}
              >
                {selectedInc.length > 0 ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        dispatch(uploaderOpen_AC(true))
                        dispatch(showDownload_AC(false))
                      }}
                    >
                      Загрузить из JSON файла
                    </MenuItem>
                    {menu.map(({ label, value }) => (
                      <MenuItem
                        key={label}
                        onClick={() => {
                          dispatch(download(value))
                          dispatch(showDownload_AC(false))
                        }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <MenuItem
                    onClick={() => {
                      dispatch(uploaderOpen_AC(true))
                      dispatch(showDownload_AC(false))
                    }}
                  >
                    Загрузить из JSON файла
                  </MenuItem>
                )}
              </Menu>

              <Button
                disabled={rights && !rights.find((r) => r.actionName === 'Delete')}
                onClick={() => {
                  if (selectedInc.length > 0) {
                    dispatch(deleteConfirmOpen_AC(true))
                  }
                }}
              >
                {selectedInc.length === 0 ? <DeleteIcon /> : <DeleteIconActive />}
              </Button>
            </div>
            <div key='setInt' className={classes.flexGroup}>
              <Button onClick={() => dispatch(searchOpen_AC(true))}>
                <SearchIcon />
              </Button>
              <Button
                onClick={() => {
                  //this.setState({ settingsOpen: true })
                  window.location.href = '/extfield'
                }}
              >
                <SettingIcon />
              </Button>
            </div>

            <div key={'time-update'} className={classes.flexGroup}>
              <Select
                value={refreshInterval}
                onChange={(e) => {
                  dispatch(setTimer(e))
                  dispatch(toggleCustomForm(e.value === -1))
                }}
                options={[
                  { value: null, label: 'Все инциденты' },
                  { value: 1000 * 60 * 5, label: 'За последние 5 мин' },
                  { value: 1000 * 60 * 60, label: 'За последний час' },
                  { value: 1000 * 60 * 60 * 24, label: 'За последние 24 часа' },
                  { value: 1000 * 60 * 60 * 24 * 7, label: 'За последнюю неделю' },
                  { value: 1000 * 60 * 60 * 24 * 31, label: 'За последний месяц' },
                  { value: (1000 * 60 * 60 * 24 * 365) / 4, label: 'За последние 3 месяца' },
                  { value: 1000 * 60 * 60 * 24 * 182.5, label: 'За последние полгода' },
                  { value: 1000 * 60 * 60 * 24 * 365, label: 'За последний год' },
                  { value: -1, label: 'Настроить период' },
                ]}
              ></Select>

              {customRange && (
                <>
                  <div
                    key={'date-start'}
                    className={classes.menuLink}
                    ref={_dateStart}
                    onClick={() => dispatch(dateStartOpen_AC(true))}
                  >
                    {d1 ? d1.toLocaleDateString('ru-RU', DATE_TIME_FORMAT) : 'Выбрать дату'}
                  </div>

                  <Menu
                    key={'menu-start'}
                    anchor={_dateStart?.current}
                    open={dateStartOpen}
                    onClose={() => dispatch(dateStartOpen_AC(false))}
                  >
                    <DateTimePicker
                      onChange={(date) => dispatch(setDate('d1', date))}
                      value={d1 || new Date()}
                      format={'dd.MM.yyyy H:mm:ss'}
                      maxDetail={'second'}
                    />
                  </Menu>
                  <div key={'menu-text'} style={{ marginLeft: 16 }}>
                    до
                  </div>
                  <div
                    key={'date-end'}
                    className={classes.menuLink}
                    ref={_dateEnd}
                    onClick={() => dispatch(dateEndOpen_AC(true))}
                  >
                    {d2 ? d2.toLocaleDateString('ru-RU', DATE_TIME_FORMAT) : 'Выбрать дату'}
                  </div>
                  <Menu
                    key={'menu-end'}
                    anchor={_dateEnd?.current}
                    open={dateEndOpen}
                    onClose={() => dispatch(dateEndOpen_AC(false))}
                  >
                    <DateTimePicker
                      onChange={(date) => dispatch(setDate('d2', date))}
                      value={d2 || new Date()}
                      format={'dd.MM.yyyy H:mm:ss'}
                      maxDetail={'second'}
                    />
                  </Menu>
                </>
              )}
            </div>

            <div key='refreshInt' className={classes.flexGroup}>
              <div
                style={{ width: 200 }}
                className={classes.groupFlex}
                ref={_groupSelector}
                // onClick={() => setState({ ...state, groupSelectorOpen: true })}
                onClick={() => dispatch(groupSelectorOpen_AC(true))}
              >
                <AssignIcon />
                <Text color='primary'>
                  {group === 1
                    ? 'На мне'
                    : group === 2
                    ? 'На моей группе'
                    : group === 3
                    ? 'Инциденты на всех'
                    : 'Не выбрано'}
                </Text>
              </div>
              <Menu
                anchor={_groupSelector?.current}
                open={groupSelectorOpen}
                // onClose={() => setState({ ...state, groupSelectorOpen: false })}
                onClose={() => dispatch(groupSelectorOpen_AC(false))}
              >
                <div className={classes.menuLayer}>
                  <MenuItem onClick={_filter(1)}>
                    <Checkbox text='Инциденты на мне' checked={group === 1} />
                  </MenuItem>
                  <MenuItem onClick={_filter(2)}>
                    <Checkbox text='Инциденты на моей группе' checked={group === 2} />
                  </MenuItem>
                  <MenuItem onClick={_filter(3)}>
                    <Checkbox text='Инциденты на всех' checked={group === 3} />
                  </MenuItem>
                </div>
              </Menu>
            </div>

            {archive.hasArchive && (
              <Checkbox
                key='sendToArchive'
                text={archive.name}
                checked={archive.checked}
                onChange={() => _archiveToggled(!archive.checked)}
              />
            )}
            <Checkbox
              key='isRefreshInc'
              text='Автообновление'
              checked={autoRefresh}
              onChange={() => dispatch(changeRefresh(!autoRefresh))}
            />
            {autoRefresh && (
              <div key='autoupdatInput'>
                <input
                  type='number'
                  className={classes.autoUpdateInterval}
                  onChange={(e) => _setAutoUpdate(e.currentTarget.value)}
                  value={autoUpdateInterval}
                  onKeyPress={(e) => {
                    _saveAutoUpdateInterval(autoUpdateInterval)
                  }}
                />
                <span>сек</span>
              </div>
            )}
          </>
        ) : null}
        <div className={classes.searchLayer} style={{ width: searchOpen ? '80%' : 0, opacity: searchOpen ? 1 : 0 }}>
          <SearchIcon className={classes.searchIcon} />
          <Input
            className={classes.search}
            value={searchText}
            onChange={(e) => dispatch(searchText_AC(e.currentTarget.value))}
            placeholder='Введите поисковый запрос'
            onEnter={() => dispatch(searchInc())}
          />
          <CloseIcon
            onClick={() => {
              // setState({ ...state, search: 0 })
              dispatch(searchOpen_AC(false))
              dispatch(searchText_AC(''))
              // setSearchText('')
              dispatch(searchInc())
            }}
            className={classes.searchCloseIcon}
          />
        </div>
        <Pager
          onPrev={() => {
            var row = (currentPage - 2) * ROW_PER_PAGE * rowHeight
            table.scrollToPosition(row)
          }}
          onNext={() => {
            var row = currentPage * ROW_PER_PAGE * rowHeight
            table.scrollToPosition(row)
          }}
          onEnter={() => {
            var row = (currentPage - 1) * ROW_PER_PAGE * rowHeight
            table.scrollToPosition(row)
          }}
          onEnd={() => {
            var allRows = (totalPages - 1) * ROW_PER_PAGE * rowHeight
            table.scrollToPosition(allRows)
          }}
          onStart={() => {
            table.scrollToPosition(0)
          }}
          // onChange={changePage}
          current={currentPage}
          total={totalPages}
        />

      </div>
      <CreateDialog
        open={createDialogOpen}
        workingGroups={workingGroups}
        users={users}
        onClose={() => dispatch(createDialogOpen_AC(false))}
        fields={fields}
      />
      {/* {isComplexEdit && (
        <ComplexEditDialog
          open={isComplexEdit}
          workingGroups={workingGroups}
          users={users}
          relevances={relevances}
          statuses={statuses}
          nodes={nodes}
          geoLocations={geoLocations}
          onClose={() => dispatch(isComplexEdit_AC(false))}
          onFinish={() => dispatch(complexEditFinish('РЕДАКТИРОВАНИЕ', 'Инциденты успешно отредактированы', false))}
          ids={selectedInc}
          onDelete={() => {
            dispatch(deleteConfirmOpen_AC(true))
          }}
        />
      )} */}
      <Dialog
        open={deleteConfirmOpen}
        header='ПОДТВЕРЖДЕНИЕ'
        text={'Вы действительно хотите безвозвратно удалить ницидент(-ы)?'}
        onOk={() => {
          dispatch(_delete())
          dispatch(deleteConfirmOpen_AC(false))
        }}
        onClose={() => dispatch(deleteConfirmOpen_AC(false))}
      />
      <Uploader
        open={uploaderOpen}
        onOk={() => {
          _uploadInc()
          dispatch(uploaderOpen_AC(false))
        }}
        onClose={() => dispatch(uploaderOpen_AC(false))}
      />
    </div>
  )
}

export default _TopPanel

const useStyles = createUseStyles({
  flexGroup: {
    display: 'flex',
    alignItems: 'center',
    '& *:not(:first-child)': {
      marginLeft: 16,
    },
  },
  menuLink: {
    color: (theme) => theme.primary.main,
    cursor: 'pointer',
  },
  groupFlex: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '& *:not(:first-child)': {
      marginLeft: 5,
    },
  },
  search: {
    marginTop: 10,
    paddingLeft: 40,
    paddingRight: 35,
    '&::placeholder': {
      color: '#ddd',
    },
  },
  setting: {
    display: 'flex',
    alignItems: 'center',
    '&>*:not(:first-child)': {
      marginLeft: 5,
    },
  },
  searchIcon: {
    position: 'relative',
    height: 35,
    marginRight: -40,
    top: 6,
  },
  searchCloseIcon: {
    position: 'relative',
    height: 35,
    marginLeft: -35,
    top: 6,
    cursor: 'pointer',
  },
  searchLayer: {
    transition: 'width 0.6s',
    display: 'flex',
  },
  topBar: {
    margin: -10,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& >*': {
      margin: 10,
    },
  },
  autoUpdateInterval: {
    width: 50,
    border: '1px solid #a9a9a9',
    display: 'inline-block',
    textAlign: 'center',
    height: 30,
    marginRight: 10,
  },
})
