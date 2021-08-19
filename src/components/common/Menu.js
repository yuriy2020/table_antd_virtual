import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'
import classNames from 'classnames'

class Menu extends Component {
  _handleClose(e) {
    if (this.props.backdropClose !== false) this.props.onClose()
    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    let { classes, className, theme, anchor, open, onClose, actions, ...other } = this.props
    if (!open) return null

    return ReactDOM.createPortal(
      <div
        className={classes.wrapper}
        onClick={this._handleClose.bind(this)}
        onContextMenu={this._handleClose.bind(this)}
      >
        <div onClick={(e) => e.stopPropagation()} className={classNames(classes.menu, className)} {...other}>
          {this.props.children}
        </div>
        {actions && actions.length > 0 && <div className={classes.actions}>{actions}</div>}
      </div>,
      document.getElementsByTagName('body')[0]
    )
  }
}

const styles = (theme) => ({
  actions: {
    marginTop: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menu: {
    minWidth: 300,
    backgroundColor: 'white',
    border: `3px solid ${theme.borderColor}`,
    position: 'absolute',
    top: (props) =>
      !props.anchor
        ? 0
        : //( props.anchor.getBoundingClientRect().top + props.anchor.getBoundingClientRect().height + (props.offset !== undefined ? 0 : 11)),
        window.screen.availHeight < props.anchor.offsetTop
        ? props.anchor.getBoundingClientRect().top -
          props.anchor.getBoundingClientRect().height +
          (props.offset !== undefined ? 0 : 11) -
          372
        : props.anchor.getBoundingClientRect().top +
          props.anchor.getBoundingClientRect().height +
          (props.offset !== undefined ? 0 : 11),

    left: (props) =>
      !props.anchor
        ? 0
        : props.offset !== undefined
        ? props.offset - 30
        : props.anchor.getBoundingClientRect().left + 304 > window.screen.availWidth
        ? props.anchor.getBoundingClientRect().left - 300 + 30
        : props.anchor.getBoundingClientRect().left + props.anchor.getBoundingClientRect().width / 2 - 30,
    zIndex: 9999,
    '&::before': {
      top: (props) => (!props.anchor ? -26 : window.screen.availHeight < props.anchor.offsetTop ? 'auto' : -26),
      bottom: (props) => (!props.anchor ? -26 : window.screen.availHeight < props.anchor.offsetTop ? -26 : 'auto'),
      left: (props) =>
        !props.anchor ? 13 : props.anchor.getBoundingClientRect().left + 304 > window.screen.availWidth ? 'auto' : 13,
      right: (props) =>
        !props.anchor
          ? 'auto'
          : props.anchor.getBoundingClientRect().left + 304 > window.screen.availWidth
          ? 13
          : 'auto',
      width: 0,
      border: `13px solid ${theme.borderColor}`,
      height: 0,
      content: "' '",
      position: 'absolute',
      borderColor: (props) =>
        !props.anchor
          ? `${theme.borderColor} transparent transparent `
          : window.screen.availHeight < props.anchor.offsetTop
          ? `${theme.borderColor} transparent transparent `
          : `transparent transparent ${theme.borderColor}`,
    },
    '&::after': {
      top: (props) => (!props.anchor ? -18 : window.screen.availHeight < props.anchor.offsetTop ? 'auto' : -18),
      bottom: (props) => (!props.anchor ? -18 : window.screen.availHeight < props.anchor.offsetTop ? -18 : 'auto'),
      left: (props) =>
        !props.anchor ? 16 : props.anchor.getBoundingClientRect().left + 304 > window.screen.availWidth ? 'auto' : 16,
      right: (props) =>
        !props.anchor
          ? 'auto'
          : props.anchor.getBoundingClientRect().left + 304 > window.screen.availWidth
          ? 16
          : 'auto',
      width: 0,
      border: `10px solid white`,
      height: 0,
      content: "' '",
      position: 'absolute',
      borderColor: (props) =>
        !props.anchor
          ? `transparent transparent white`
          : window.screen.availHeight < props.anchor.offsetTop
          ? `white transparent transparent`
          : `transparent transparent white`,
    },
  },
  wrapper: {
    cursor: 'default',
    position: 'absolute',
    zIndex: 9998,
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  '@global': (props) => ({
    'html,body': {
      overflow: props.open ? 'hidden' : 'auto',
    },
  }),
})

class MenuItemComponent extends Component {
  _handleClick(e) {
    e.currentTarget.firstChild.click && e.currentTarget.firstChild.click()
    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    let { className, classes, theme, ...other } = this.props

    return (
      <div className={classNames(classes.menuItem, className)} onClick={this._handleClick} {...other}>
        {this.props.children}
      </div>
    )
  }
}

const stylesItem = (theme) => ({
  menuItem: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: 16,
    '&:hover': {
      backgroundColor: theme.backgroundColor,
    },
  },
})

export default injectSheet(styles)(Menu)
export var MenuItem = injectSheet(stylesItem)(MenuItemComponent)
