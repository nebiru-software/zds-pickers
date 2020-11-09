import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import MenuItem from '@material-ui/core/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import mappingsStyle from '../../styles/mappings.scss'
import Dialog from '../Dialog'
import { stateMappings } from '../../selectors'
import { actions } from '../../reducers/mappings'
import MappingPicker from './MappingPicker'

const MappingsDialog = () => {
  const dispatch = useDispatch()
  const {
    channels,
    dialogVisible,
    stockMappings,
    userMappings,
  } = useSelector(stateMappings)

  const hideMappingsDialog = useCallback(() => {
    dispatch(actions.hideMappingsDialog())
  }, [dispatch])

  const changeMapping = useCallback((idx, name) => {
    dispatch(actions.changeMapping(idx, name))
  }, [dispatch])

  const showUserMappingsDialog = useCallback(() => {
    dispatch(actions.showUserMappingsDialog())
  }, [dispatch])

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

export default MappingsDialog
