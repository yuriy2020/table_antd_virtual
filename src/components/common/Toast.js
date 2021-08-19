import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import { ReactComponent as WarnIcon } from '../../icons/status_close.svg'
import { ReactComponent as OkIcon } from '../../icons/status_save.svg'
import { ReactComponent as CloseIcon } from '../../icons/close_icon.svg'
import Button from './Button'

class Toast extends Component {
  componentDidMount() {
    setTimeout(this.props.onClose, this.props.timeout || 3000)
  }

  render() {
    let { classes, className, theme, visible, onClose, warning, header, text, ...other } = this.props

    if (!visible) return null

    return ReactDOM.createPortal(
      <div
        //onClick={e => e.stopPropagation()}
        className={classNames(classes.toast, className)}
        {...other}
      >
        {warning ? <WarnIcon /> : <OkIcon />}
        <div style={{ flex: 1, margin: '0 16px' }}>
          <div className={classes.header}>{header}</div>
          <div className={classes.text}>{text}</div>
        </div>
        <CloseIcon style={{ cursor: 'pointer' }} onClick={this.props.onClose} />
      </div>,
      document.getElementsByTagName('body')[0]
    )
  }
}

const styles = (theme) => ({
  header: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    marginTop: 16,
  },
  toast: {
    minWidth: 300,
    minHeight: 100,
    padding: '16px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    alignItems: 'flex-start',
    left: 0,
    zIndex: 800,
  },
  '@global': (props) => ({
    'html,body': {
      //overflow: props.open ? "hidden" : "auto"
    },
  }),
})

export default injectSheet(styles)(Toast)
