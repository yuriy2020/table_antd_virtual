import React, { Component } from 'react'
import injectSheet from 'react-jss'
import ClipLoader from 'react-spinners/ClipLoader'

class Loader extends Component {
  render() {
    let { size, classes, ...other } = this.props

    return (
      <div className={classes.loader}>
        <ClipLoader sizeUnit={'px'} size={size} />
      </div>
    )
  }
}

const styles = (theme) => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
    '&>*': {
      borderColor: theme.primary.main + ' !important',
      borderBottomColor: 'transparent !important',
    },
  },
})

export default injectSheet(styles)(Loader)
