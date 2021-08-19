import React, { Component } from 'react'
import Modal from './Modal'
import Button from './Button'
import injectSheet from 'react-jss'

class Dialog extends Component {
  render() {
    let { open, onOk, okText, onClose, text, header } = this.props

    if (!open) return null

    return (
      <Modal
        backdropClose={false}
        open={open}
        okText={okText}
        zIndex={1}
        onClose={onClose}
        header={header}
        width={400}
        maxHeight={150}
        actions={[
          <Button key='cancel-dia' medium={true} text={true} color='primary' onClick={onClose}>
            ОТМЕНА
          </Button>,
          <Button key='ok-dia' medium={true} text={true} style={{ marginLeft: 32 }} color='primary' onClick={onOk}>
            {okText ? okText : 'Ок'}
          </Button>,
        ]}
      >
        {text}
      </Modal>
    )
  }
}

const incWidth = 60

const styles = (theme) => ({
  editheader: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  editHeaderLeft: {
    width: `${incWidth}%`,
    display: 'flex',
    alignItems: 'center',
  },
  editheaderActions: {
    marginLeft: 16,
    alignItems: 'center',
    display: 'flex',
  },
  editHeaderRight: {
    width: `${100 - incWidth}%`,
    display: 'flex',
    alignItems: 'center',
    '&>:not(:first-child)': {
      marginLeft: 16,
    },
  },
})

export default injectSheet(styles)(Dialog)
