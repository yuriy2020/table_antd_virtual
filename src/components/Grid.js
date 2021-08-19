import React, { Component } from 'react'
import Button from './common/Button'
import injectSheet from 'react-jss'
// eslint-disable-next-line import/no-webpack-loader-syntax
import { ReactComponent as EditIcon } from '../icons/button_edit_basic.svg'
import { ReactComponent as DownloadIcon } from '../icons/button_download_basic.svg'
import { ReactComponent as DeleteIcon } from '../icons/button_delete_basic.svg'
import { ReactComponent as SettingIcon } from '../icons/button_pref_basic.svg'
import { ReactComponent as OneColumnIcon } from '../icons/columns_1.svg'
import { ReactComponent as TwoColumnIcon } from '../icons/columns_2.svg'
import { ReactComponent as ThreeColumnIcon } from '../icons/columns_3.svg'
import { ReactComponent as ConfigIcon } from '../icons/config_icon.svg'
import { ReactComponent as SortIcon } from '../icons/table_sort.svg'
import Select from './common/Select'
import Text from './common/Text'
import Checkbox from './common/Checkbox'
import Menu, { MenuItem } from './common/Menu'
import { Column, Table } from 'react-virtualized'
import Draggable from 'react-draggable'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators } from '../store/Grid'
import classNames from 'classnames'
import { RIGHT_PANEL_BORDER_WIDTH } from '../const/cssConst'
import { DATE_TIME_FORMAT } from '../const/common'
import HttpUtil from '../util/HttpUtil'
import { BASE_URL } from '../const/api'
//import Dialog from "./TopPanel";
import Dialog from './common/Dialog'
import { HIGHLIGHT_COLOR } from '../const/cssConst'

export const rowHeight = 30
export const rightPading = RIGHT_PANEL_BORDER_WIDTH

const SortableHeader = SortableElement(({ children, ...props }) => React.cloneElement(children, props))

const SortableHeaderRowRenderer = SortableContainer(({ className, columns, resize, classes, style, onClick }) => (
  <div className={className} role='row'>
    {React.Children.map(columns, (column, index) =>
      index === 0 ? (
        <div key={index} className={classes.firstColumnHeader}>
          {column}
        </div>
      ) : (
        <SortableHeader index={index} distanse={1}>
          <div className={classes.columnHeader} style={column.props.style}>
            {column}
            {index !== columns.length - 1 && (
              <Draggable
                axis='x'
                defaultClassNameDragging={classes.draggingSpan}
                onStart={(e) => e.stopPropagation()}
                onDrag={(event, { deltaX }) => {
                  resize({
                    index,
                    deltaX,
                  })
                  event.stopPropagation()
                }}
                position={{ x: 0 }}
                zIndex={900}
              >
                <span className={classes.resizeLabel}></span>
              </Draggable>
            )}
          </div>
        </SortableHeader>
      )
    )}
  </div>
))

class Grid extends Component {
  _columnsSelector = null
  _table = null
  _rows = []

  constructor(props) {
    super(props)

    this.state = {
      timer: null,
      columnsSelectorOpen: false,
      contextAnchor: null,
      contextIncident: null,
      contextOffset: 0,
      contextRemoveInc: null,
    }
  }

  componentDidMount() {
    if (!this.props.inverse) this.props.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== 1 && this.props.currentPage === 1) {
      this._table.scrollToPosition(0)
    }

    this.addHightlightText(this.props.searchText)
  }

  addHightlightText(searchtext='') {
    const allTextTable = document.querySelectorAll('.ReactVirtualized__Table__rowColumn')
    const hightlightText = searchtext
    allTextTable.forEach((cell) => {
      if (hightlightText !== '') {
        let split = cell.textContent.split(hightlightText)
        if (cell.textContent.indexOf(hightlightText) !== -1) {
          cell.innerHTML = split.join(`<span style="background-color:${HIGHLIGHT_COLOR}">${hightlightText}</span>`)
        }else{
          cell.textContent= split.join()
        }
      }else{
        cell.textContent = cell.textContent
      }
    })
  }

  _renderMainColumn(column) {
    let { classes } = this.props

    return [
      <div
        key={'main-column-1-part'}
        //style={{ flex: "0 1 28px" }}
        ref={(c) => (this._columnsSelector = c)}
        onClick={() => this.setState({ columnsSelectorOpen: true })}
      >
        <ConfigIcon />
      </div>,
      <Menu
        key={'main-column-1-menu'}
        anchor={this._columnsSelector}
        open={this.state.columnsSelectorOpen}
        onClose={() => this.setState({ columnsSelectorOpen: false })}
      >
        <div className={classes.topBar}>
          <div>
            {/*
      <Button small><SettingIcon width={26} height={26}/></Button>*/}
          </div>
          <div className={classes.flexGroup}>
            <Button small onClick={() => this.props.changeColumnsCount(1)}>
              <OneColumnIcon fill={this.props.menuColumnCount === 1 ? '#BAC3D0' : '#E2E9F1'} />
            </Button>
            <Button small onClick={() => this.props.changeColumnsCount(2)}>
              <TwoColumnIcon fill={this.props.menuColumnCount === 2 ? '#BAC3D0' : '#E2E9F1'} />
            </Button>
            <Button small onClick={() => this.props.changeColumnsCount(3)}>
              <ThreeColumnIcon fill={this.props.menuColumnCount === 3 ? '#BAC3D0' : '#E2E9F1'} />
            </Button>
          </div>
          <div className={classes.menuColumnsLayer}>
            {this.props.columns./*filter(c => !c.hard).*/ map((c) => (
              <div
                key={'check-col-' + c.dataKey}
                className={classNames(classes.menuColumns, {
                  [classes.menuColumns3]: this.props.menuColumnCount === 3,
                  [classes.menuColumns2]: this.props.menuColumnCount === 2,
                  [classes.menuColumns1]: this.props.menuColumnCount === 1,
                })}
              >
                <Checkbox
                  text={c.name}
                  checked={c.visible}
                  onChange={() => this.props.changeColumnVisible(c.dataKey)}
                />
              </div>
            ))}
          </div>
        </div>
      </Menu>,
    ]
  }

  _renderHeader(params) {
    let { classes } = this.props
    return (
      <SortableHeaderRowRenderer
        {...params}
        distance={2}
        helperClass={classes.sortElem}
        classes={classes}
        axis='x'
        resize={this._resizeRow.bind(this)}
        lockAxis='x'
        onSortEnd={this._onSortEnd}
      />
    )
  }

  _renderColumnHeader(column) {
    let { classes } = this.props

    return (
      <div
        key={column.dataKey}
        className={classes.columnLabel}
        onClick={() => {
          this.props.onSort(column.dataKey)
        }}
      >
        {column.label}
        {this.props.sortBy === column.dataKey && (
          <SortIcon
            style={{
              marginLeft: 16,
              marginTop: -16,
              transform: this.props.sortDir !== 'asc' ? 'translateY(-2px) rotate(180deg)' : 'translateY(-2px)',
            }}
          />
        )}
      </div>
    )
  }

  _onSortEnd = ({ oldIndex, newIndex }) => {
    var visibleColumns = this.props.columns.filter((c) => c.visible)
    var allNewIndex = this.props.columns.findIndex((c) => c.dataKey === visibleColumns[newIndex - 1].dataKey)
    var allOldIndex = this.props.columns.findIndex((c) => c.dataKey === visibleColumns[oldIndex - 1].dataKey)
    this.props.sortColumns(arrayMove(this.props.columns, allOldIndex, allNewIndex))
  }

  _resizeRow({ index, deltaX }) {
    this.props.changeWidths(index, deltaX, this.props.inverse)
  }

  _renderRow = ({ columns, index, style }) => {
    let { classes } = this.props
    let renderColumns = columns.slice(1)
    let isPage = (index + 1) % this.props.perPage === 0 && index !== 0
    let data = this.props.inverse ? this.props.dataInverse : this.props.data

    return (
      <div style={{ ...style, overflow: 'visible' }} key={'customGridRow-' + index}>
        <div
          ref={(c) => (this._rows[index] = c)}
          className={classNames(classes.gridRow, {
            [classes.gridEvenRow]: index % 2 === 0,
            [classes.gridOddRow]: index % 2 !== 0,
            [classes.gridSelectedRow]: data[index] && this.props.selectedInc.indexOf(data[index].id) > -1,
          })}
          onDoubleClick={() => this.props.onRowDoubleClick(data[index])}
          onClick={() => {
            if (!this.props.inverse) {
              this.props.showIncident(data[index])
              this.props.selectRow(data[index])
            }
          }}
          onContextMenu={(e) => {
            if (!this.props.inverse)
              this.setState({
                contextAnchor: this._rows[index],
                contextOffset: e.clientX,
                contextIncident: data[index],
              })
            e.preventDefault()
          }}
        >
          <div
            className={classes.gridRowCheckBox}
            onClick={(e) => {
              this.props.selectRow(data[index])
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <Checkbox checked={data[index] && this.props.selectedInc.find((d) => d.id === data[index].id)} />
          </div>
          {renderColumns}
        </div>
        {isPage && (
          <div className={classes.gridRowDivider}>
            <div className={classes.gridRowPager}>Страница {(index + 1) / this.props.perPage + 1}</div>
          </div>
        )}
      </div>
    )
  }

  render() {
    let { classes, inverse, heightOffset, gridFields } = this.props
    let { widths, columns } = this.props
    let data = inverse ? this.props.dataInverse : this.props.data

    if (gridFields === []) return null

    return (
      <div style={{ overflow: 'hidden' }}>
        {this.state.contextIncident &&
          (this.state.contextIncident.flags.isEditable ||
            this.state.contextIncident.flags.isDownloadable ||
            this.state.contextIncident.flags.isRemovable) && (
            <Menu
              anchor={this.state.contextAnchor}
              open={this.state.contextAnchor !== null}
              offset={this.state.contextOffset}
              onClose={() => this.setState({ contextAnchor: null })}
            >
              <div className={classes.menuLayer}>
                {this.state.contextIncident.flags.isEditable && (
                  <MenuItem
                    onClick={() => {
                      this.props.onEditClick(this.state.contextIncident)
                      this.setState({ contextAnchor: null })
                    }}
                  >
                    <EditIcon /> Редактировать
                  </MenuItem>
                )}
                {this.state.contextIncident.flags.isDownloadable && (
                  <MenuItem
                    onClick={() => {
                      this.setState({ contextAnchor: null })
                      HttpUtil.fetchGet(`${BASE_URL}/inc/json/${this.state.contextIncident.id}`, null, true, (data) => {
                        let file = new Blob([JSON.stringify(data)], { type: 'text/plain' })
                        let filename = `Инцидент ${this.state.contextIncident.id}.json`

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
                    }}
                  >
                    <DownloadIcon /> Выгрузить{' '}
                  </MenuItem>
                )}
                {this.state.contextIncident.flags.isRemovable && (
                  <MenuItem
                    onClick={() => {
                      //this.props.delete(this.state.contextIncident.id);
                      this.setState({ contextRemoveInc: true })
                      this.setState({ contextAnchor: null })
                    }}
                  >
                    <DeleteIcon /> Удалить
                  </MenuItem>
                )}
              </div>
            </Menu>
          )}

        <div
          style={{
            textAlign: 'right',
            display: 'block',
            color: '#a7b3c3',
            paddingRight: '16px',
          }}
        >
          В поисковом запросе: {this.props.total}, всего в базе: {this.props.count}
        </div>
        <Table
          ref={(c) => {
            this._table = c
            if (this.props.createTableRef) {
              this.props.createTableRef(c)
            }
          }}
          className={classes.grid}
          headerHeight={rowHeight * 3}
          onRowsRendered={({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
            let timer = setTimeout(() => {
              this.props.getRows(overscanStartIndex, overscanStopIndex, this.props.inverse, startIndex)
              this.setState({
                timer: null,
              })
            }, 100)
            if (this.state.timer !== null) {
              clearTimeout(this.state.timer)
            }
            this.setState({
              timer,
            })
          }}
          rowRenderer={this._renderRow}
          width={window.innerWidth - (inverse ? 0 : rightPading)}
          height={inverse ? heightOffset + 35 : window.innerHeight - heightOffset - 5}
          rowHeight={rowHeight}
          rowCount={this.props.total}
          rowGetter={({ index }) => {
            if (!data[index]) {
              return {}
            }
            let row = {}
            Object.keys(data[index]).forEach((k) => {
              if (k !== 'fields') {
                if (k === 'dateCreated') row[k] = new Date(data[index][k]).toLocaleTimeString('ru-RU', DATE_TIME_FORMAT)
                else if (k === 'incidentRelevance' || k === 'incidentStatus' || k === 'author')
                  row[k] = data[index][k].name
                else {
                  // console.log(k, '===' ,data[index]);
                  row[k] = data[index][k]
                }
              }
            })
            data[index].fields.forEach((n) => {
              if (n.dataType === 'date') row[n.path] = new Date(n.value).toLocaleTimeString('ru-RU', DATE_TIME_FORMAT)
              else row[n.path] = n.value
            })

            return row
          }}
          headerRowRenderer={this._renderHeader.bind(this)}
        >
          <Column width={28} headerRenderer={this._renderMainColumn.bind(this)} dataKey='config' />
          {columns
            .filter((c) => c.visible)
            .map((column) => (
              <Column
                key={'column-' + column.dataKey}
                dataKey={column.dataKey}
                label={column.name}
                width={widths[column.dataKey] * (window.innerWidth - (inverse ? 0 : rightPading))}
                headerRenderer={this._renderColumnHeader.bind(this)}
              />
            ))}
        </Table>

        <Dialog
          open={this.state.contextRemoveInc !== null}
          header='ПОДТВЕРЖДЕНИЕ'
          text={'Вы действительно хотите безвозвратно удалить ницидент?'}
          onOk={() => {
            this.props.delete(this.state.contextIncident.id)
            this.setState({
              contextRemoveInc: null,
            })
          }}
          onClose={() => this.setState({ contextRemoveInc: null })}
        />
      </div>
    )
  }
}

const border = '1px solid'

const styles = (theme) => ({
  columnLabel: {
    flex: 1,
    alignItems: 'center',
    wordBreak: 'break-all',
  },
  firstColumnHeader: {
    display: 'flex',
    flex: '0 0 57px',
  },
  columnHeader: {
    display: 'flex',
  },
  draggingSpan: {
    borderRight: `1px solid ${theme.primary.main}`,
    wordBreak: 'break-all',
  },
  flexGroup: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 16,
    '& *:not(:first-child)': {
      marginLeft: 16,
    },
  },
  groupFlex: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '& *:not(:first-child)': {
      marginLeft: 5,
    },
  },
  grid: {
    marginTop: 16,
    color: theme.textSecondary,
    //display: "flex",
    //width: window.innerWidth,
    '& .ReactVirtualized__Table__headerRow': {
      cursor: 'pointer',
      display: 'flex',
      //height: rpw,
      width: window.innerWidth - 5,
    },
    /*"& .ReactVirtualized__Table__row": {
        display: "flex",
    },*/
    '& .ReactVirtualized__Table__headerColumn': {
      paddingLeft: 16,
      paddingRight: 16,
      display: 'flex',
      borderBottom: `${border} ${theme.borderColor}`,
      borderLeft: `${border} ${theme.borderColor}`,
    },
    '& .ReactVirtualized__Table__rowColumn': {
      wordBreak: 'break-all',
    },
  },
  gridEvenRow: {
    backgroundColor: theme.hover.light,
  },
  gridOddRow: {
    backgroundColor: 'white',
    '&.gridSelectedRow': {
      backgroundColor: theme.hover.dark,
    },
  },
  gridSelectedRow: {
    backgroundColor: theme.hover.dark,
  },
  gridRow: {
    display: 'flex',
    color: 'black',
    alignItems: 'center',
    height: rowHeight,
    cursor: 'pointer',
    fontSize: 14,
    '&:hover': {
      backgroundColor: theme.hover.main,
    },
    '&.active': {
      backgroundColor: theme.hover.main,
    },
    '&>*': {
      height: rowHeight,
      textIndent: 16,
      alignItems: 'center',
      borderBottom: `${border} ${theme.borderColor}`,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '&>*:not(:first-child)': {
      borderLeft: `${border} ${theme.borderColor}`,
    },
  },
  gridRowDivider: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    height: 2,
    top: -1,
    zIndex: 10,
    backgroundColor: theme.secondary.light,
  },
  gridRowPager: {
    top: -7,
    position: 'relative',
    width: 200,
    height: 16,
    backgroundColor: theme.secondary.light,
    color: theme.contrastText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  },
  gridRowCheckBox: {
    flex: '0 0 57px',
    //width: 61.4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textIndent: 'inherit',
  },
  menuColumnsLayer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-8px !important',
    marginTop: '-8px !important',
    marginBottom: '16px !important',
  },
  menuColumns: {
    //flexGrow: 1,
    padding: 8,
    borderLeft: `${border} ${theme.borderColor}`,
    borderTop: `${border} ${theme.borderColor}`,
  },
  menuColumns1: {
    width: 'calc(100% - 16px)',
  },
  menuColumns2: {
    width: 'calc(49% - 16px)',
  },
  menuColumns3: {
    width: 'calc(33% - 16px)',
  },
  resizeLabel: {
    width: 15,
    borderBottom: `${border} ${theme.borderColor}`,
    cursor: 'e-resize',
  },
  sortElem: {
    paddingLeft: 16,
    borderBottom: `${border} ${theme.borderColor}`,
    borderLeft: `${border} ${theme.borderColor}`,
  },
  topBar: {
    margin: -10,
    alignItems: 'center',
    maxWidth: (props) => props.menuColumnCount * 300,
    paddingLeft: 16,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& >*': {
      margin: 10,
    },
  },
})

const mapStateToProps = (state) => {
  return {
    ...state.grid,
    search: state.topPanel.applySearch,
  }
}
export default connect(mapStateToProps, (dispatch) => bindActionCreators(actionCreators, dispatch))(
  injectSheet(styles)(Grid)
)
