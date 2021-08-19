import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'

class Input extends Component {
  _handleEnter(e) {
    if (e.key === "Enter") {
      this.props.onEnter && this.props.onEnter()
    }
  }

  render() {
    let { classes, className, theme, value, onChange, name, ...other } = this.props

    return (
      <input
        type='text'
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(e)}
        onKeyPress={this._handleEnter.bind(this)}
        className={classNames(classes.input, className)}
        {...other}
      />
    )
  }
}

const styles = (theme) => ({
  input: {
    boxSizing: 'border-box',
    width: '100%',
    outline: 0,
    height: (props) => props.height || 30,
  },
})

export default injectSheet(styles)(Input)
