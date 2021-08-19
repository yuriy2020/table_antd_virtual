import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import { ReactComponent as CloseIcon } from '../../icons/close_icon.svg'
import { ReactComponent as RightIcon } from '../../icons/arrow_side_white.svg'
import Button from './Button'

class Modal extends Component {
  _handleClose(e) {
    this.props.onClose()
    e.stopPropagation()
    e.preventDefault()
  }

  escapeHandler = (e) => {
    if (e.keyCode === 27 && this.props.escClose) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeHandler)
  }

  render() {
    let {
      classes,
      className,
      bodyScrollable,
      theme,
      open,
      onClose,
      backdropClose,
      header,
      actions,
      onLeft,
      onRight,
      zIndex,
      ...other
    } = this.props

    if (!open) return null
    // console.log('===>', other)
    return ReactDOM.createPortal(
      [
        <div
          key='modal-close-container'
          className={classes.wrapper}
          onClick={backdropClose !== false ? this._handleClose.bind(this) : undefined}
          onKeyDown={onClose}
        ></div>,
        this.props.onLeft && (
          <div
            key='left-arrow'
            style={{ transform: 'rotate(180deg)', left: `calc(50% - ${this.props.width / 2 + 30}px)` }}
            className={classes.arrow}
            onClick={this.props.switch}
          >
            <Button
              rippleStyle={{ top: '0 !important' }}
              overflow={true}
              style={{ width: 15, height: 80 }}
              onClick={this.props.onLeft}
            >
              <RightIcon style={{ width: 15 }} />
            </Button>
          </div>
        ),
        this.props.onRight && (
          <div
            key='right-arrow'
            style={{ right: `calc(50% - ${this.props.width / 2 + 80}px)` }}
            className={classes.arrow}
            onClick={this.props.switch}
          >
            <Button
              rippleStyle={{ top: '0 !important' }}
              overflow={true}
              style={{ width: 15, height: 80 }}
              onClick={this.props.onRight}
            >
              <RightIcon style={{ width: 15 }} />
            </Button>
          </div>
        ),
        <div
          key='modal-body'
          onClick={(e) => e.stopPropagation()}
          className={classNames(classes.modal, className)}
          {...other}
        >
          <div className={classes.header}>
            <div className={classes.headerText}>{header}</div>
            {!this.props.showOnlyDialog && (
              <CloseIcon style={{ cursor: 'pointer' }} onClick={this._handleClose.bind(this)} />
            )}
          </div>
          <div className={classNames(classes.body, bodyScrollable || classes.bScrollable)}>{this.props.children}</div>
          {actions && actions.length > 0 && <div className={classes.actions}>{actions}</div>}
        </div>,
      ],
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
  body: {
    marginTop: 24,
    flex: 1,
    paddingRight: 24,
    marginRight: -24,
    maxHeight: (props) => props.maxHeight || window.innerHeight * 0.9 - 68,
    overflowY: 'hidden',
  },
  bScrollable: {
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  modal: {
    //maxHeight: window.innerHeight - 120,
    height: (props) => props.maxHeight || '90%',
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    width: (props) => props.width,
    maxWidth: '90%',
    marginLeft: (props) => (props.showOnlyDialog ? 0 : -props.width / 2),
    left: (props) => (props.showOnlyDialog ? '20%' : '50%'),
    right: (props) => (props.showOnlyDialog ? '20%' : 'auto'),
    backgroundColor: 'white',
    opacity: 1,
    position: 'absolute',
    top: 10,
    zIndex: (props) => 500 + (props.zIndex * 201 || 0),
    border: '1px solid #c2cad5',
  },
  arrow: {
    position: 'absolute',
    overflow: 'hidden',
    top: '45%',
    cursor: 'pointer',
    height: 100,
    width: 30,
    zIndex: (props) => 500 + (props.zIndex * 201 || 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.secondary.light,
  },
  wrapper: {
    cursor: 'default',
    position: 'absolute',
    zIndex: (props) => 300 + (props.zIndex * 201 || 0),
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.8,
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

export default injectSheet(styles)(Modal)
