import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import Ripples from 'react-ripples'

class Button extends Component {
  render() {
    let { classes, className, theme, small, micro, text, medium, disabled, color, overflow, rippleStyle, ...other } =
      this.props

    return (
      <div
        className={classNames(classes.rippleContainer, {
          [classes.rippleOverflow]: overflow,
        })}
      >
        <Ripples
          color={color === 'primary' ? 'rgba(255, 255, 255, .6)' : 'rgba(0, 0, 0, .3)'}
          during={400}
          style={rippleStyle}
        >
          <button
            disabled={disabled}
            className={classNames(classes.gammaButton, className, {
              [classes.primary]: color === 'primary' && !disabled,
              [classes.btnDisabled]: disabled === true,
            })}
            {...other}
          >
            {this.props.children}
          </button>
        </Ripples>
      </div>
    )
  }
}

const size = 40
const fontSize = size * 0.7

const sizeS = 26
const fontSizeS = sizeS * 0.7

const sizeXS = 13
const fontSizeXS = sizeXS * 0.7

const sizeM = 40
const fontSizeM = sizeS * 0.7

const styles = (theme) => ({
  rippleContainer: {
    '& s': {
      top: (props) => props.rippleStyle && props.rippleStyle.top,
    },
  },
  rippleOverflow: {
    '& > div': {
      overflow: 'visible !important',
    },
  },
  gammaButton: {
    backgroundColor: (props) =>
      props.disabled ? theme.borderColor : props.color === 'primary' ? theme.primary.main : 'transparent',
    border: (props) => (props.text || props.disabled ? '1px solid ' + theme.borderColor : 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //marginBottom: props => props.text ? undefined : -6,
    height: (props) => (props.micro ? sizeXS : props.small ? sizeS : props.medium ? sizeM : size),
    width: (props) => (props.text ? 'auto' : props.small ? sizeS : props.micro ? sizeXS : size),
    fontSize: (props) => (props.micro ? fontSizeXS : props.small ? fontSizeS : props.medium ? fontSizeM : fontSize),
    paddingLeft: (props) => (props.text ? 16 : 0),
    paddingRight: (props) => (props.text ? 16 : 0),
    color: 'grey',
    padding: 0,
    outline: 0,
    cursor: 'pointer',
  },
  primary: {
    color: theme.contrastText,
    '&:hover': {
      backgroundColor: theme.primary.dark,
    },
    '&:active,:focus': {
      backgroundColor: theme.primary.dark,
    },
  },
})

export default injectSheet(styles)(Button)
