import React, { Component } from 'react'
import injectSheet from 'react-jss'
import classNames from 'classnames'

class TabGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
    }
  }

  _handleChange(i) {
    this.setState({
      index: i,
    })
    this.props.onChange && this.props.onChange(i)
  }

  componentDidMount() {
    this._handleChange(1)
  }

  render() {
    let { classes, className, theme, ...other } = this.props

    return (
      <div {...other}>
        <div className={classes.tabs}>
          {this.props.children.map(
            (c, i) =>
              c && (
                <div
                  className={classNames(classes.tab, {
                    [classes.selected]: this.state.index === i,
                  })}
                  key={'tab-' + i}
                  onClick={() => this._handleChange(i)}
                >
                  {/* {c} */}
                </div>
              )
          )}
        </div>
        <div
          style={{ left: (100 * this.state.index) / this.props.children.filter((c) => c !== undefined).length + '%' }}
          /*className={classes.selectedBorder} */
        />
        <div /*className={classes.border}*/ />
      </div>
    )
  }
}

const styles = (theme) => ({
  border: {
    height: 2,
    backgroundColor: theme.textSecondary,
  },
  tabs: {
    display: 'flex',
    fontSize: 16,
  },
  tab: {
    width: (props) => 100 / props.children.filter((c) => c !== undefined).length + '%',
    height: 20,
    cursor: 'pointer',
    textAlign: 'center',
  },
  selected: {
    color: theme.textSecondary,
  },
  selectedBorder: {
    transition: 'left 0.3s',
    width: (props) => 100 / props.children.filter((c) => c !== undefined).length + '%',
    height: 3,
    position: 'relative',
    backgroundColor: theme.textSecondary,
  },
})

export default injectSheet(styles)(TabGroup)
