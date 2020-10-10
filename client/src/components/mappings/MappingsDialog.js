import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import MenuItem from '@material-ui/core/MenuItem'
import mappingsStyle from '../../styles/mappings.scss'
import Dialog from '../Dialog'
import MappingPicker from './MappingPicker'

const MappingsDialog = ({
  dialogVisible,
  channels,
  stockMappings,
  userMappings,
  hideMappingsDialog,
  changeMapping,
  showUserMappingsDialog,
}) => {
  const userMenuSource = userMappings.map((label, idx) => (
    <MenuItem
      key={`${label}_${idx}`}
      value={label}
    >
      <b>{label}</b>
    </MenuItem>
  ))

  const stockMenuSource = stockMappings.map((label, idx) => (
    <MenuItem
      key={`${label}_${idx}`}
      value={label}
    >
      {label}
    </MenuItem>
  ))

  const menuSource = [...userMenuSource, ...stockMenuSource]

  return (
    <Dialog
      className={mappingsStyle.mappingsDialog}
      onClose={hideMappingsDialog}
      open={dialogVisible}
    >
      <DialogTitle>Channel Mappings</DialogTitle>
      <DialogContent>
        <DialogContentText />
        <section>
          {channels.map((value, idx) => (
            <article key={`mp_${idx}`}>
              <div>{idx + 1}</div>
              <MappingPicker
                menuSource={menuSource}
                onChange={name => changeMapping(idx, name)}
                value={value || ''}
              />
            </article>
          ))}
        </section>
      </DialogContent>
      <DialogActions className={mappingsStyle.buttonBar}>
        <Button onClick={showUserMappingsDialog}>Manage User Mappings...</Button>
        <Button
          autoFocus
          color="primary"
          onClick={hideMappingsDialog}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

MappingsDialog.propTypes = {
  dialogVisible: PropTypes.bool.isRequired,
  channels: PropTypes.arrayOf(PropTypes.string).isRequired,
  stockMappings: PropTypes.arrayOf(PropTypes.string).isRequired,
  userMappings: PropTypes.arrayOf(PropTypes.string).isRequired,

  hideMappingsDialog: PropTypes.func.isRequired,
  changeMapping: PropTypes.func.isRequired,
  showUserMappingsDialog: PropTypes.func.isRequired,
}

export default MappingsDialog
