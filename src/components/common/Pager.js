import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import arrowLeft from '../../icons/arrow_paging_l.svg'
import arrowRight from '../../icons/arrow_paging_r.svg'
import doubleArrowLeft from '../../icons/arrow_paging_le.svg'
import doubleArrowRight from '../../icons/arrow_paging_re.svg'

class Pager extends Component {
  render() {
    let { classes, className, total, current, theme, ...other } = this.props

    return (
      <div className={classNames(classes.gammaPager, className)}>
        <img alt='В начало' src={doubleArrowLeft} onClick={this.props.onStart} />
        <img alt='Пред.' src={arrowLeft} onClick={this.props.onPrev} />
        <input
          className={classes.page}
          value={current}
          onChange={(e) => this.props.onChange(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.which === 13) {
              this.props.onEnter()
            }
          }}
        />

        <div className={classes.total}>/ {total}</div>
        <img alt='След.' src={arrowRight} onClick={this.props.onNext} />
        <img alt='В конец' src={doubleArrowRight} onClick={this.props.onEnd} />
      </div>
    )
  }
}

const size = 30

const styles = (theme) => ({
  gammaPager: {
    display: 'flex',
    alignItems: 'center',
    '&>*:not(:first-child)': {
      marginLeft: 16,
    },
    '&>img': {
      cursor: 'pointer',
    },
  },
  page: {
    height: size,
    textAlign: 'center',
    width: 50,
  },
  total: {
    color: theme.textSecondary,
    display: 'flex',
    alignItems: 'center',
  },
})

export default injectSheet(styles)(Pager)
