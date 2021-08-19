import React from 'react'
import Dropzone from 'react-dropzone'
import injectSheet from 'react-jss'
import Loader from './Loader'
import Text from './Text'
import { BASE_URL } from '../../const/api'
import HttpUtil from '../../util/HttpUtil'
//import { bindActionCreators } from 'redux';
//import { showToastType} from "../../store/Incidents";
//import { connect } from 'react-redux';
import { ReactComponent as AddIcon } from '../../icons/add_file.svg'
import { ReactComponent as CloseIcon } from '../../icons/close_icon_micro.svg'

// export const actionCreators = {
//     showToast: (type) => async (dispatch, getState) => {
//         if (type === "edit") {
//             dispatch({
//                 type: showToastType,
//                 header: "СОХРАНЕНО",
//                 text: "Изменения инцидента успешно сохранены"
//             })
//         } else if (type === "save") {
//             dispatch({
//                 type: showToastType,
//                 header: "СОХРАНЕНО",
//                 text: "Создан новый инцидент"
//             })
//         } else if (type === "delete") {
//             dispatch({
//                 type: showToastType,
//                 header: "УДАЛЕНИЕ",
//                 text: "Инцидент успешно удалён"
//             })
//         }
//     },
// };

class DropZone extends React.Component {
  filesSizeLimit = 5242880

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      openSnackBar: false,
      errorMessage: '',
      files: this.props.files || [],
      disabled: true,
      hoverFile: null,
    }
  }

  _getLimitsData() {
    HttpUtil.fetchGet(`${BASE_URL}/inchistory/getattachmentlimit`, null, true, (data) => {
      this.filesSizeLimit = data.value
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      files: nextProps.files,
      disabled: true,
    })
  }

  componentDidMount() {
    this._getLimitsData()
  }

  handleClose() {
    this.props.closeDialog()
    this.setState({ open: false })
    if (this.props.onClose) this.props.onClose()
  }

  onDrop(files) {
    let oldFiles = this.state.files,
      filesSize = 0
    const filesLimit = this.props.filesLimit || '3'
    const filesSizeLimit = this.filesSizeLimit

    oldFiles = oldFiles.concat(files)

    oldFiles.forEach(function (file) {
      filesSize += file.size
    })

    if (filesSize > filesSizeLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: 'Максимальный размер вложений к одному комментарию: ' + filesSizeLimit / 1024 / 1024 + ' Мб.',
      })

      // dispatch({
      //     type: showToastType,
      //     header: 'Ошибка',
      //     text: 'Максимальный размер вложений к одному комментарию: ' + (filesSizeLimit/1024/1024) + ' Мб.'
      // });

      alert('Максимальный размер вложений к одному комментарию: ' + filesSizeLimit / 1024 / 1024 + ' Мб.')

      return
    }

    if (oldFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: 'Нельзя загрузить более ' + filesLimit + ' файла.',
      })
    } else {
      this.setState(
        {
          files: oldFiles,
        },
        this.changeButtonDisable
      )
      this.props.saveFiles(oldFiles)
    }
  }

  changeButtonDisable() {
    if (this.state.files.length !== 0) {
      this.setState({
        disabled: false,
      })
    } else {
      this.setState({
        disabled: true,
      })
    }
  }

  /*saveFiles() {
      const filesLimit = this.props.filesLimit || '1';

      if (this.state.files.length > filesLimit) {
          this.setState({
              openSnackBar: true,
              errorMessage: 'Нельзя загрузить более ' + filesLimit + ' файла.',
          });
      } else {
          this.props.saveFiles(this.state.files);
      }
  }*/

  onDropRejected() {
    this.setState({
      openSnackBar: true,
      errorMessage: 'Файл должен быть формата .pdf меньше 15 МБ',
    })
  }

  handleRequestCloseSnackBar = () => {
    this.setState({
      openSnackBar: false,
    })
  }

  render() {
    const fileSizeLimit = this.props.maxSize || 3000000
    const { classes } = this.props

    /*<Snackbar
        open={this.state.openSnackBar}
        message={this.state.errorMessage}
        autoHideDuration={3000}
        onClose={this.handleRequestCloseSnackBar}
    />*/

    return this.props.blocked ? (
      <Loader size={30} />
    ) : (
      [
        this.state.files &&
          this.state.files.map((f, i) => (
            <div
              className={classes.flex}
              key={'dz-file-' + i}
              onMouseEnter={() => this.setState({ hoverFile: i })}
              onMouseLeave={() => this.setState({ hoverFile: null })}
            >
              <div title={f.name} className={classes.fileName}>
                {i + 1 + '. ' + f.name}
              </div>
              {/* <div style={{ whiteSpace: "nowrap" }}>
                            {Math.round(f.size / 1024 / 1024 * 100) / 100} Мб
                        </div>*/}
              {this.state.hoverFile === i && (
                <div className={classes.pointer} onClick={() => this.props.onRemove(i)}>
                  <CloseIcon />
                </div>
              )}
            </div>
          )),
        !this.props.disabled && (
          <Dropzone
            key='dz-zone'
            //accept={this.state.acceptedFiles.join(',')}
            onDrop={this.onDrop.bind(this)}
            className={classes.dropZone}
            acceptClassName={classes.stripes}
            rejectClassName={classes.rejectStripes}
            onDropRejected={this.onDropRejected.bind(this)}
            maxSize={fileSizeLimit}
          >
            <div className={classes.dropzoneTextStyle}>
              <AddIcon />
              <Text color='primary'>
                {this.state.files && this.state.files.length === 0
                  ? 'Прикрепить документ или изображение'
                  : 'Прикрепить ещё'}
              </Text>
            </div>
          </Dropzone>
        ),
      ]
    )
  }
}

const styles = (theme) => ({
  dropZone: {
    position: 'relative',
    width: '100%',
    //height: 50,
    //backgroundColor: theme.backgroundColor,
    //border: '1px solid ' + theme.primary.main,
    cursor: 'pointer',
    flex: 1,
  },
  dropzoneTextStyle: {
    /*textAlign: 'center',
    padding: 16,
    position: 'relative',*/
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginLeft: 8,
    },
  },
  fileName: {
    whiteSpace: 'nowrap',
    maxWidth: (props) => (props.fullWidth ? 'inherit' : 160),
    overflow: 'hidden',
    marginBottom: 2,
    textOverflow: 'ellipsis',
  },
  flex: {
    display: 'flex',
    padding: '2px 8px',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: theme.backgroundColor,
    },
    '&>:not(:first-child)': {
      marginLeft: 5,
    },
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    width: 650,
  },
  pointer: {
    cursor: 'pointer',
  },
  redButton: {
    color: 'rgb(225, 0, 80)',
  },
  rejectStripes: {
    width: '100%',
    height: 50,
    cursor: 'pointer',
    borderColor: `${theme.error.main}`,
    backgroundImage: `repeating-linear-gradient(-45deg, ${theme.backgroundColor}, ${theme.backgroundColor} 25px, ${theme.error.main} 25px, ${theme.error.main} 50px)`,
    animation: 'progress 2s linear infinite !important',
    backgroundSize: '166.5% 100%',
  },
  stripes: {
    width: '100%',
    height: 50,
    cursor: 'pointer',
    borderColor: theme.secondary.main,
    backgroundImage: `repeating-linear-gradient(-45deg, ${theme.backgroundColor}, ${theme.backgroundColor} 25px, ${theme.primary.main} 25px, ${theme.primary.main} 50px)`,
    animation: 'progress 2s linear infinite !important',
    backgroundSize: '166.5% 100%',
  },
  uploadIconSize: {
    width: 51,
    height: 51,
  },
  '@keyframes progress': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '70px 0',
    },
  },
})

// export default connect(
//     dispatch => bindActionCreators(actionCreators, dispatch)
// )(injectSheet(styles)(DropZone));

export default injectSheet(styles)(DropZone)
