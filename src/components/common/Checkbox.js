import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'

class Checkbox extends Component {
  render() {
    let { classes, className, text, theme, checked, onChange, ...other } = this.props

    return (
      <div className={classes.flex} onChange={onChange}>
        <label
          className={classNames(classes.gammaCheckmark, {
            [classes.visible]: this.props.checked,
          })}
        >
          <input
            className={classNames(classes.gammaCheckbox, className)}
            type='checkbox'
            defaultChecked={checked}
            {...other}
          >
            {this.props.children}
          </input>
          {text}
        </label>
      </div>
    )
  }
}

const styles = (theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  gammaCheckbox: {
    minWidth: '1em',
    zIndex: 2,
    opacity: 0,
    margin: 0,
    padding: 0,
    cursor: 'pointer',
  },
  gammaCheckmark: {
    cursor: 'pointer',
    fontSize: 16,
    paddingLeft: 10,
    '&::before': {
      borderColor: 'lightgrey',
      content: "''",
      width: 'calc(1em + 2px)',
      height: 'calc(1em + 2px)',
      display: 'block',
      boxSizing: 'border-box',
      borderRadius: 0,
      border: '1px solid transparent',
      zIndex: 0,
      position: 'absolute',
      left: 0,
      backgroundColor: 'transparent',
    },
    '&::after': {
      borderColor: theme.primary.main,
      backgroundColor: theme.primary.main,
      transform: 'scale(.4)!important',
      borderRadius: '20%',
      borderWidth: 'calc(1em / 7)',
      width: 'calc(1em + 2px)',
      height: 'calc(1em + 2px)',
      display: 'block',
      boxSizing: 'border-box',
      border: '1px solid transparent',
      zIndex: 0,
      position: 'absolute',
      left: 0,
      top: 0,
    },
  },
  visible: {
    '&::after': {
      content: "''",
    },
  },
})

export default injectSheet(styles)(Checkbox)
