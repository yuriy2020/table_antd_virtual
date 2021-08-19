import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'

class Text extends Component {
  render() {
    let { classes, className, bold, italic, theme, ...other } = this.props

    return (
      <div
        className={classNames(classes.gammaText, className, {
          [classes.primary]: this.props.color === 'primary',
          [classes.secondary]: this.props.color === 'secondary',
          [classes.textSecondary]: this.props.color === 'textSecondary',
          [classes.bold]: bold,
          [classes.italic]: italic,
        })}
        {...other}
      >
        {this.props.children}
      </div>
    )
  }
}

const fontSize = 18 * 0.9

const styles = (theme) => ({
  bold: {
    fontWeight: 'bold',
  },
  gammaText: {
    fontSize,
    minHeight: 19,
  },
  textSecondary: {
    color: theme.textSecondary,
  },
  secondary: {
    color: theme.secondary.main,
  },
  italic: {
    fontStyle: 'italic',
  },
  primary: {
    color: theme.primary.main,
  },
})

export default injectSheet(styles)(Text)
