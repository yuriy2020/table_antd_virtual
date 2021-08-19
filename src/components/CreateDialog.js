import React, { Component } from 'react'
import Modal from './common/Modal'
import Button from './common/Button'
// import WatchForm from './WatchForm'
import injectSheet from 'react-jss'
import HttpUtil from '../util/HttpUtil'
import Text from './common/Text'

import { ReactComponent as SaveIcon } from '../icons/save_icon.svg'
import { ReactComponent as DownloadIcon } from '../icons/button_download_basic.svg'
import { ReactComponent as DeleteIcon } from '../icons/button_delete_basic.svg'
import { ReactComponent as UploadIcon } from '../icons/button_upload_basic.svg'
import { BASE_URL } from '../const/api'
import Dialog from './common/Dialog'
import Menu, { MenuItem } from './common/Menu'

class CreateDialog extends Component {
  _editForm = null

  constructor(props) {
    super(props)
    this.state = {
      delta: 0,
      incId: null,
      closeDia: null,
      removeDia: null,
      uploaderOpen: null,
      showDownloadCreateDialog: false,
      changed: false,
      inputFields: {},
    }
  }

  _downloadData = (incident, fileType) => {
    let self = this
    let url = `${BASE_URL}/inc/json/${incident.id}`

    if (fileType !== undefined) {
      url = `${BASE_URL}/inc/file/${incident.id}/${fileType}`
    } else {
      HttpUtil.fetchIncDownload(url, null, true, (data) => {
        let filename = `Инцидент ${incident.id}.${fileType}`
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
      })
      return
    }

    HttpUtil.fetchGet(
      url,
      null,
      true,
      (data) => {
        let file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
        let filename = `Инцидент ${incident.id}.json`

        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, filename)
        } else {
          var a = document.createElement('a'),
            url = URL.createObjectURL(file)
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          setTimeout(function () {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
            self._editForm.refresh()
          }, 0)
        }
      },
      (data) => {
        let filename = `Инцидент ${incident.id}.${fileType}`
        let a = document.createElement('a')

        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 0)
      }
    )
  }

  _getPrevIncId(id, dir) {
    let currentIndex, currentInc, index

    for (let i in window.rows.value) {
      if (window.rows.value.hasOwnProperty(i)) {
        if (window.rows.value[i].id === id) {
          currentInc = window.rows.value[i]
        }
      }
    }

    currentIndex = window.rows.value.indexOf(currentInc)

    if (dir === 0) {
      if (currentIndex === 0) {
        index = 0
      } else {
        index = currentIndex - 1
      }
    } else {
      if (currentIndex === window.rows.value.length - 1) {
        index = window.rows.value.length - 1
      } else {
        index = currentIndex + 1
      }
    }

    return window.rows.value[index].id
  }

  _renderEditHeader() {
    let { classes, flags, incident, name, onClose } = this.props
    return (
      <div style={{ boxSizing: 'content-box' }} className={classes.editheader}>
        <div className={classes.editHeaderLeft}>
          <Text bold>ПАСПОРТ ИНЦИДЕНТА</Text>
          <div className={classes.editheaderActions}>
            {flags.isDownloadable && (
              <Button
                id={'download-top-create-dialog'}
                onClick={() => {
                  this.setState({ showDownloadCreateDialog: true })
                }}
              >
                <DownloadIcon />
              </Button>
            )}
            {
              <Menu
                key={'menu-download'}
                anchor={document.getElementById('download-top-create-dialog')}
                open={this.state.showDownloadCreateDialog}
                onClose={() => this.setState({ showDownloadCreateDialog: false })}
              >
                <MenuItem
                  onClick={() => {
                    this._downloadData(incident)
                    this.setState({ showDownloadCreateDialog: false })
                  }}
                >
                  Выгрузить в json-файл
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this._downloadData(incident, 'csv')
                    this.setState({ showDownloadCreateDialog: false })
                  }}
                >
                  Выгрузить в csv-файл
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this._downloadData(incident, 'xlsx')
                    this.setState({ showDownloadCreateDialog: false })
                  }}
                >
                  Выгрузить в xlsx-файл
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this._downloadData(incident, 'docx')
                    this.setState({ showDownloadCreateDialog: false })
                  }}
                >
                  Выгрузить в docx-файл
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this._downloadData(incident, 'pdf')
                    this.setState({ showDownloadCreateDialog: false })
                  }}
                >
                  Выгрузить в pdf-файл
                </MenuItem>
                {/*  <MenuItem onClick={() => {*/}
                {/*  this.setState({showDownloadCreateDialog: false});*/}
                {/*  this.setState({uploaderOpen: true});*/}
                {/*}}>*/}
                {/*  Загрузить из JSON файла*/}
                {/*  </MenuItem>*/}
              </Menu>
            }
            {/*
                    <Button onClick={null}>
                        <UploadIcon />
                    </Button>
                    */}
            {flags.isEditable && (
              <Button
                onClick={() => {
                  if (this._editForm) {
                    this._editForm.save()
                    this.setState({ changed: false })
                    /*this.setState({
                    closeDia: () => {
                        this.setState({ changed: false });
                    }
                })*/
                  }
                }}
              >
                <SaveIcon
                  stroke={this.state.changed ? this.props.theme.primary.main : this.props.theme.textSecondary}
                />
              </Button>
            )}
            {flags.isRemovable && (
              <Button
                onClick={() => {
                  if (this._editForm) {
                    this.setState({
                      removeDia: () => this._editForm.delete(onClose),
                    })
                  }
                }}
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        </div>
        <div className={classes.editHeaderRight}>
          <Text bold>ИСТОРИЯ ИНЦИДЕНТА</Text>
          <Button
            onClick={() => {
              HttpUtil.fetchFile(
                `${BASE_URL}/inchistory/download/${incident.id}/${encodeURIComponent(
                  -new Date().getTimezoneOffset() / 60
                )}`,
                null,
                (data) => {
                  var file = data

                  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(file, `История инцидента «${name}».txt`)
                  } else {
                    var element = document.createElement('a')
                    element.setAttribute('href', URL.createObjectURL(file))
                    element.setAttribute('download', `История инцидента «${name}».txt`)

                    element.style.display = 'none'
                    document.body.appendChild(element)

                    element.click()

                    document.body.removeChild(element)
                  }
                }
              )
            }}
          >
            <DownloadIcon />
          </Button>
        </div>
        <Dialog
          open={this.state.removeDia !== null}
          header='ПОДТВЕРЖДЕНИЕ'
          text={'Вы инициировали удаление инцидента(-ов), продолжить?'}
          onOk={() => {
            this.state.removeDia()
            this.setState({
              removeDia: null,
              changed: false,
            })
          }}
          onClose={() => this.setState({ removeDia: null })}
        />
        <Dialog
          open={this.state.closeDia !== null}
          okText='Сохранить и закрыть'
          header='ЗАКРЫТИЕ ИНЦИДЕНТА'
          text={'У вас остались несохранённые данные, продолжить?'}
          onOk={() => {
            if (this._editForm) {
              this._editForm.save()
            }
            this.state.closeDia()
            this.setState({
              closeDia: null,
              changed: false,
            })
          }}
          onClose={() => {
            this.state.closeDia()
            this.setState({
              closeDia: null,
              changed: false,
            })
          }}
        />
      </div>
    )
  }

  render() {
    let { open, fields, onClose, edit, needFetch, incident, incId } = this.props
    // console.log('incident>>>',
    // open,   ///   false/true
    // fields,
    // onClose, /// onClose={() => this.setState({ createDialogOpen: false })}
    // edit,  /// undefined
    // needFetch,  /// undefined
    // incident,  /// undefined
    // incId  /// undefined
    // )
    if (!fields.children || (edit && !incident)) return null

    let incidentId = !edit ? null : this.props.incident.id === null ? incident.id : this.props.incident.id

    const setIncState = (dir) => {
      if (!dir) dir = 1
      let currentIndex, currentInc, index
      let incId = this.props.incident.id
      for (let i = 0; i < window.rows.value.length; i++) {
        if (window.rows.value[i].id === incId) {
          currentInc = window.rows.value[i]
          currentIndex = window.rows.value.indexOf(currentInc)
          index = currentIndex + dir
          if (index < 0 || index >= window.rows.value.length) return
          this.props.incident = window.rows.value[index]
          let nextIncId = window.rows.value[index].id
          this.setState({
            delta: nextIncId + currentInc.id * dir,
            incId: nextIncId,
          })
          return
        }
      }
    }

    let _width = ''

    if (this.props.showOnlyDialog) {
      _width = 'auto'
    } else {
      _width = edit ? window.innerWidth * 0.8 : window.innerWidth * 0.5
    }

    return (
      <Modal
        backdropClose={false}
        escClose={true}
        open={open}
        onLeft={
          edit
            ? () => {
                setIncState(1)
              }
            : null
        }
        onRight={
          edit
            ? () => {
                setIncState(-1)
              }
            : null
        }
        onClose={() => {
          if (edit && this.state.changed) {
            this.setState({
              closeDia: onClose,
            })
          } else {
            this.setState({
              delta: 0,
            })
            onClose()
          }
        }}
        header={this.props.showOnlyDialog ? '' : this.props.edit ? this._renderEditHeader() : 'СОЗДАНИЕ ИНЦИДЕНТА'}
        width={_width}
        showOnlyDialog={this.props.showOnlyDialog}
        actions={ 
          edit
            ? []
            : [
                <Button
                  key='add-inc'
                  medium={true}
                  text={true}
                  color='primary'
                  onClick={() => {
                    if (this._editForm) {
                      this._editForm.save(onClose)
                      this.setState({ changed: false })
                    }
                  }}
                >
                  СОЗДАТЬ
                </Button>,
              ]
        }
      >
        {open && (
          // <WatchForms_2  incident={incidentId}/>
          // <WatchForm_3 incident={incidentId}/>

          // <WatchForm
          //   createRef={(c) => (this._editForm = c)}
          //   change={(isChange) => {
          //     this.setState({ changed: isChange })
          //   }}
          //   edit={edit}
          //   fields={fields}
          //   incident={incidentId} /// undefined
          //   needFetch={needFetch}
          //   needHistory={edit}
          // />
          <></>
        )}
      </Modal>
    )
  }
}

const incWidth = 60

const styles = (theme) => ({
  editheader: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  editHeaderLeft: {
    width: `${incWidth}%`,
    display: 'flex',
    alignItems: 'center',
  },
  editheaderActions: {
    marginLeft: 16,
    alignItems: 'center',
    display: 'flex',
  },
  editHeaderRight: {
    width: `${100 - incWidth}%`,
    display: 'flex',
    alignItems: 'center',
    '&>:not(:first-child)': {
      marginLeft: 16,
    },
  },
})

export default injectSheet(styles)(CreateDialog)
