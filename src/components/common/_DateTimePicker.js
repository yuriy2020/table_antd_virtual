import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import { ReactComponent as ArrowLeft } from '../../icons/arrow_paging_l.svg'
import { ReactComponent as ArrowRight } from '../../icons/arrow_paging_r.svg'
import { ReactComponent as CloseIcon } from '../../icons/close_icon.svg'
import Input from './Input'
import Button from './Button'

const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

class DateTimePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: props.date || new Date(),
      accuracy: props.accuracy,
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.date !== this.props.date || nextProps.accuracy !== this.props.accuracy) {
      this.setState({
        date: nextProps.date || new Date(),
        accuracy: nextProps.accuracy,
      })
    }
  }

  _setDate(date, accuracy) {
    if (date === 'today') {
      let curDate = this.state.date
      curDate.setDate(new Date().getDate())
      curDate.setMonth(new Date().getMonth())
      curDate.setFullYear(new Date().getFullYear())
      this.setState({
        date: curDate,
      })
      return
    }

    this.setState({
      date,
      accuracy: accuracy ? accuracy : 0,
    })
  }

  render() {
    let { classes, theme, className, onChange, onClose, ...other } = this.props

    let date = this.state.date

    let year = date.getFullYear()
    let month = date.getMonth()
    let firstDate = new Date(year, month, 1)
    let lastDate = new Date(year, month + 1, 0)

    let datesArray = []

    for (var i = 0; i < firstDate.getDay(); i++) {
      let index = i
      datesArray.push(
        <div
          key={'in-prev-' + i}
          className={classes.dateInactive}
          onClick={() => this._setDate(new Date(year, month, -index))}
        >
          {new Date(year, month, -index).getDate()}
        </div>
      )
    }

    for (var i = 1; i <= lastDate.getDate(); i++) {
      let index = i
      datesArray.push(
        <div
          key={'act-' + i}
          className={classNames(classes.dateActive, {
            [classes.dateCurrent]: this.state.date.getDate() === index,
          })}
          onClick={() => this._setDate(new Date(year, month, index))}
        >
          {new Date(year, month, index).getDate()}
        </div>
      )
    }

    for (var i = 1; i < 7 - lastDate.getDay(); i++) {
      let index = i
      datesArray.push(
        <div
          key={'in-post-' + i}
          className={classes.dateInactive}
          onClick={() => this._setDate(new Date(year, month + 1, index))}
        >
          {new Date(year, month + 1, index).getDate()}
        </div>
      )
    }

    return (
      <div className={classNames(className, classes.layer)} {...other}>
        <div className={classes.monthYear}>
          <div className={classes.monthPick}>
            <ArrowLeft
              className={classes.left}
              onClick={() => {
                let date = this.state.date
                date.setMonth(date.getMonth() - 1)
                this._setDate(date)
              }}
            />
            {months[this.state.date.getMonth()]}
            <ArrowRight
              className={classes.right}
              onClick={() => {
                let date = this.state.date
                date.setMonth(date.getMonth() + 1)
                this._setDate(date)
              }}
            />
          </div>
          <div className={classes.yearPick}>
            <ArrowLeft
              className={classes.left}
              onClick={() => {
                let date = this.state.date
                date.setFullYear(date.getFullYear() - 1)
                this._setDate(date)
              }}
            />
            {this.state.date.getFullYear()}
            <ArrowRight
              className={classes.right}
              onClick={() => {
                let date = this.state.date
                date.setFullYear(date.getFullYear() + 1)
                this._setDate(date)
              }}
            />
          </div>
          <div className={classes.buttonToday} onClick={() => this._setDate('today')}>
            Сегодня
          </div>
        </div>
        <div className={classes.daysOfWeek}>
          {daysOfWeek.map((d, i) => (
            <div className={classes.day} key={'day-' + i}>
              {d}
            </div>
          ))}
        </div>
        <div className={classes.dates}>{datesArray}</div>
        <div className={classes.time}>
          <div className={classes.hours}>
            Часы
            <Input
              className={classes.timeInput}
              value={this.state.accuracy > 0 ? this.state.date.getHours() : ''}
              onChange={(e) => {
                let date = this.state.date
                date.setHours(e.currentTarget.value)
                this._setDate(date, 1)
              }}
            />
            {this.state.accuracy > 0 && (
              <CloseIcon className={classes.timeClearIcon} onClick={() => this.setState({ accuracy: 0 })} />
            )}
          </div>
          <div className={classes.minutes}>
            Минуты
            <Input
              className={classes.timeInput}
              value={this.state.accuracy > 1 ? this.state.date.getMinutes() : ''}
              onChange={(e) => {
                let date = this.state.date
                date.setMinutes(e.currentTarget.value)
                this._setDate(date, 2)
              }}
            />
            {this.state.accuracy > 1 && (
              <CloseIcon className={classes.timeClearIcon} onClick={() => this.setState({ accuracy: 1 })} />
            )}
          </div>
          <div className={classes.seconds}>
            Секунды
            <Input
              className={classes.timeInput}
              value={this.state.accuracy > 2 ? this.state.date.getSeconds() : ''}
              onChange={(e) => {
                let date = this.state.date
                date.setSeconds(e.currentTarget.value)
                this._setDate(date, 3)
              }}
            />
            {this.state.accuracy > 2 && (
              <CloseIcon className={classes.timeClearIcon} onClick={() => this.setState({ accuracy: 2 })} />
            )}
          </div>
        </div>
        <div className={classes.action}>
          <Button
            text={true}
            small={true}
            onClick={() => {
              if (onClose) onClose()
            }}
          >
            Закрыть
          </Button>
          <Button
            color='primary'
            text={true}
            small={true}
            onClick={() => {
              if (onChange) onChange(this.state.date)
              if (onClose) onClose()
            }}
          >
            ОК
          </Button>
        </div>
      </div>
    )
  }
}

const width = 240

const styles = (theme) => ({
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  buttonToday: {
    border: '2px solid' + theme.primary.main,
    color: theme.primary.main,
    padding: 2,
    fontSize: 12,
    marginTop: 2,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: theme.primary.main,
      color: theme.contrastText,
    },
  },
  day: {
    width: width / 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    height: width / 7,
  },
  daysOfWeek: {
    display: 'flex',
    borderBottom: '2px solid ' + theme.borderColor,
  },
  dates: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottom: '2px solid ' + theme.borderColor,
  },
  dateActive: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: width / 7,
    width: width / 7,
    cursor: 'pointer',
    boxSizing: 'border-box',
    '&:hover': {
      border: '2px solid' + theme.primary.main,
    },
  },
  dateCurrent: {
    backgroundColor: theme.secondary.light,
    color: theme.contrastText,
  },
  dateInactive: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: width / 7,
    width: width / 7,
    color: theme.textSecondary,
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      border: '2px solid' + theme.primary.main,
    },
  },
  layer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width,
  },
  left: {
    marginRight: 5,
    cursor: 'pointer',
  },
  monthYear: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthPick: {
    width: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    marginTop: 3,
    justifyContent: 'space-between',
    '&>*:not(:first-child)': {
      marginLeft: 25,
    },
  },
  timeClearIcon: {
    top: -18,
    left: '70%',
    display: 'block',
    marginBottom: -12,
    position: 'relative',
    cursor: 'pointer',
  },
  timeInput: {
    marginTop: 3,
    height: 25,
    paddingLeft: 6,
  },
  right: {
    marginLeft: 5,
    cursor: 'pointer',
  },
  yearPick: {
    display: 'flex',
    alignItems: 'center',
  },
})

export default injectSheet(styles)(DateTimePicker)
