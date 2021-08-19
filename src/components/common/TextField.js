import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import Text from './Text'

class Input extends Component {
  render() {
    let { classes, className, theme, value, onChange, text, rowCount, resize, fullWidth, ...other } = this.props

    return (
      <div style={{ flex: fullWidth ? 1 : 'inherit' }}>
        {text && (
          <Text className={classes.text} color='textSecondary'>
            {text}
          </Text>
        )}
        {rowCount ? (
          <textarea
            rows={rowCount}
            value={value === null ? undefined : value}
            onChange={(e) => onChange && onChange(e)}
            className={classNames(classes.input, className)}
            {...other}
          ></textarea>
        ) : (
          <input
            rows={rowCount}
            value={value}
            onChange={(e) => onChange && onChange(e)}
            className={classNames(classes.input, className)}
            {...other}
          />
        )}
      </div>
    )
  }
}

const styles = (theme) => ({
  text: {
    fontSize: 10,
    marginBottom: -3,
    fontWeight: 'bold',
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: 8,
    outline: 0,
    resize: (props) => (props.resize ? 'vertical' : 'none'),
    height: (props) => (props.height ? props.height : props.rowCount ? props.height * 35 : 35),
  },
})

export default injectSheet(styles)(Input)
