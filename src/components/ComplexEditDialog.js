import React, { Component } from 'react'
import Modal from './common/Modal'
import Button from './common/Button'
import injectSheet from 'react-jss'
import HttpUtil from '../util/HttpUtil' 
import Text from './common/Text'

import { ReactComponent as SaveIcon } from '../icons/save_icon.svg'
import { ReactComponent as DownloadIcon } from '../icons/button_download_basic.svg'
import { ReactComponent as DeleteIcon } from '../icons/button_delete_basic.svg'
import { ReactComponent as SortIcon } from '../icons/table_sort.svg'
import { BASE_URL } from '../const/api'
import Loader from './common/Loader'
import TextField from './common/TextField'
import Select from './common/Select'
import classNames from 'classnames'

class ComplexEditDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      description: '',
      diffProps: [],
      nodes: [],
      geoLocations: '',
      incidentStatus: { id: 1, name: 'Новый' },
      incidentRelevance: { id: 1, name: 'Низкая' },
      workingGroup: { id: 0, name: 'Без группы' },
      responsibleUser: { id: 0, name: 'Без пользователя' },
    }

    this.originData = null
  }

  componentDidMount() {
    HttpUtil.fetchEdit(
      `${BASE_URL}/inc/diffs`,
      JSON.stringify({
        ids: this.props.ids.map((s) => s.id),
        passportType: 4,
      }),
      'POST',
      false,
      (data) => {
        this.originData = data.value
        this.setState(Object.assign({}, this.state, data.value, { loading: false }))
      }
    )
  }

  _renderEditHeader() {
    let { classes, ids, onDelete } = this.props

    return (
      <div className={classes.editheader}>
        <Text bold>{'КОМПЛЕКСНОЕ РЕДАКТИРОВАНИЕ ' + ids.length + ' ИНЦИДЕНТОВ'}</Text>
        <div className={classes.editheaderActions}>
          <Button
            onClick={() => {
              ids.forEach((id) => {
                HttpUtil.fetchGet(`${BASE_URL}/inc/json/${id}`, null, true, (data) => {
                  let file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
                  let filename = `Инцидент ${id}.json`

                  if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename)
                  else {
                    var a = document.createElement('a'),
                      url = URL.createObjectURL(file)
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    setTimeout(function () {
                      document.body.removeChild(a)
                      window.URL.revokeObjectURL(url)
                    }, 0)
                  }
                })
              })
            }}
          >
            <DownloadIcon />
          </Button>
          <Button
            onClick={() => {
              let obj = Object.assign({}, this.state, { ids: this.props.ids.map((i) => i.id) })
              delete obj.loading
              console.log(obj)
              obj = JSON.stringify([this.originData, obj])


              HttpUtil.fetchEdit(`${BASE_URL}/inc/groupedit`, obj, 'POST', false, (data) => {
                this.props.onFinish()
                //this.props.onClose();
              })
            }}
          >
            <SaveIcon
              stroke={/*this.state.changed ? this.props.theme.primary.main : */ this.props.theme.textSecondary}
            />
          </Button>
          <Button onClick={onDelete}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
    )
  }

  render() {
    let { open, classes, onClose } = this.props
    let { data } = this.state

    return (
      <Modal
        escClose={true}
        backdropClose={false}
        open={open}
        onClose={onClose}
        header={this._renderEditHeader()}
        width={1600}
      >
        <div style={{ maxHeight: 150, overflowY: 'auto' }}>
          <table className={classes.table}>
            <thead>
              <tr>
                <td>Статус</td>
                <th>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    Дата <SortIcon />
                  </div>
                </th>
                <td>Важность</td>
                <td>Название</td>
                <td>IP-адрес</td>
                <td>Гео-расположение</td>
                <td>Источники</td>
              </tr>
            </thead>
            <tbody>
              {this.props.ids.map((d) => (
                <tr key={'cr-' + d.id}>
                  <td>{d.incidentStatus.name}</td>
                  <td>{new Date(d.dateCreated).toLocaleString()}</td>
                  <td>{d.incidentRelevance.name}</td>
                  <td>{d.name}</td>
                  <td>{d.nodes.map((n) => n.networkInterfaces.map((ni) => ni.ip).join(', ')).join(', ')}</td>
                  <td>{d.geoLocations.map((g) => g.name)}</td>
                  <td>{/*d.sources*/}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {this.state.loading ? (
          <Loader />
        ) : (
          <div>
            <Text bold style={{ marginTop: 16 }}>
              ОБЩИЕ ПОЛЯ
            </Text>
            <div className={classes.twoColumns} style={{ marginTop: 16 }}>
              <div>
                <TextField
                  resize
                  text='ОПИСАНИЕ'
                  className={classNames({
                    [classes.diffValue]: this.state.diffProps.indexOf('Description') > -1,
                  })}
                  value={this.state.description}
                  onChange={(e) => this.setState({ description: e.currentTarget.value })}
                  rowCount={6}
                />
                <div className={classes.twoColumns} style={{ marginTop: 16 }}>
                  <Select
                    fullWidth={true}
                    value={
                      this.state.incidentRelevance && {
                        value: this.state.incidentRelevance.id,
                        label: this.state.incidentRelevance.name,
                      }
                    }
                    className={classNames({
                      [classes.diffValue]: this.state.diffProps.indexOf('IncidentRelevance') > -1,
                    })}
                    text='ВАЖНОСТЬ'
                    onChange={(e) => {
                      let incidentRelevance = {
                        id: e.value,
                        name: e.label,
                      }
                      this.setState({ incidentRelevance })
                    }}
                    options={this.props.relevances.map((r) => ({ value: r.id, label: r.name }))}
                  />
                  <Select
                    fullWidth={true}
                    value={
                      this.state.incidentStatus && {
                        value: this.state.incidentStatus.id,
                        label: this.state.incidentStatus.name,
                      }
                    }
                    className={classNames({
                      [classes.diffValue]: this.state.diffProps.indexOf('IncidentStatus') > -1,
                    })}
                    text='СТАТУС'
                    onChange={(e) => {
                      let incidentStatus = {
                        id: e.value,
                        name: e.label,
                      }
                      this.setState({ incidentStatus })
                    }}
                    options={this.props.statuses.map((r) => ({ value: r.id, label: r.name }))}
                  />
                </div>
              </div>
              <div>
                <div className={classes.twoColumns}>
                  <Select
                    menuPlacement='top'
                    fullWidth={true}
                    value={
                      this.state.workingGroup && {
                        value: this.state.workingGroup.id,
                        label: this.state.workingGroup.name,
                      }
                    }
                    text='НАЗНАЧЕН НА РАБОЧУЮ ГРУППУ'
                    onChange={(e) => {
                      var workingGroup = {
                        id: e.value,
                        name: e.label,
                      }
                      var responsibleUser = { id: 0, name: 'Без пользователя' }
                      this.setState({ workingGroup, responsibleUser })
                    }}
                    className={classNames({
                      [classes.diffValue]: this.state.diffProps.indexOf('WorkGroup') > -1,
                    })}
                    options={[
                      { value: 0, label: 'Без группы' },
                      ...this.props.workingGroups.map((u) => ({ value: u.group.id, label: u.group.name })),
                    ]}
                  />
                  <Select
                    fullWidth={true}
                    menuPlacement='top'
                    value={
                      this.state.responsibleUser
                        ? { value: this.state.responsibleUser.id, label: this.state.responsibleUser.name }
                        : { value: 0, label: 'Без пользователя' }
                    }
                    text='НАЗНАЧЕН НА ПОЛЬЗОВАТЕЛЯ'
                    className={classNames({
                      [classes.diffValue]: this.state.diffProps.indexOf('ResponsibleUser') > -1,
                    })}
                    onChange={(e) => {
                      let group = this.props.users.find((g) => g.users.find((u) => u.id === e.value) !== null).group
                      var responsibleUser = {
                        id: e.value,
                        name: e.label,
                      }
                      var workingGroup = {
                        id: group.id,
                        name: group.name,
                      }
                      this.setState({ workingGroup, responsibleUser })
                    }}
                    options={[
                      { value: 0, label: 'Без пользователя' },
                      ...[].concat.apply(
                        [],
                        this.props.users.map((wg) =>
                          wg.users.map((u) => ({
                            value: u.id,
                            label: u.name,
                          }))
                        )
                      ),
                    ]}
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <Select
                    fullWidth={true}
                    isSearchable
                    multiple
                    placeholder='Начните вводить гелокацию...'
                    text='ГЕОЛОКАЦИЯ'
                    value={
                      this.state.geoLocations && this.state.geoLocations.map((n) => ({ value: n.id, label: n.name }))
                    }
                    onChange={(e) => {
                      this.setState({
                        geoLocations: e.map((n) => ({ id: n.value, name: n.label })),
                      })
                    }}
                    options={
                      this.props.geoLocations &&
                      this.props.geoLocations.map((r) => ({
                        value: r.id,
                        label: r.name,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    )
  }
}

const rowHeight = 30
const border = '1px solid '

const styles = (theme) => ({
  editheader: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    borderBottom: '1px solid ' + theme.borderColor,
    paddingBottom: 16,
  },
  editheaderActions: {
    marginLeft: 16,
    alignItems: 'center',
    display: 'flex',
  },
  diffValue: {
    border: '1px solid red',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& td,th': {
      border: border + theme.borderColor,
      padding: '8px 16px',
    },
    '& thead tr td,th': {
      color: theme.textSecondary,
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
    },
    '& thead td,th': {
      borderTop: 0,
    },
    '& td:first-child': {
      borderLeft: 0,
    },
    '& td:last-child': {
      borderRight: 0,
    },
  },
  twoColumns: {
    display: 'flex',
    '& >*': {
      flex: 0.5,
    },
    '& >*:first-child': {
      marginRight: 8,
    },
    '& >*:last-child': {
      marginLeft: 8,
    },
  },
})

export default injectSheet(styles)(ComplexEditDialog)
