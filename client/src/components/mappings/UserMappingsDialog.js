/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react'
import { validateContent } from 'zds-mappings'
import { FilePicker } from 'nebiru-react-file-picker'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import { useDispatch, useSelector } from 'react-redux'
import mappingsStyle from '../../styles/mappings.scss'
import Dialog from '../Dialog'
import { stateMappings } from '../../selectors'
import { actions } from '../../reducers/mappings'

const UserMappingsDialog = () => {
  const dispatch = useDispatch()
  const {
    userDialogVisible,
    userMappings,
  } = useSelector(stateMappings)

  const hideUserMappingsDialog = useCallback(() => {
    dispatch(actions.hideUserMappingsDialog())
  }, [dispatch])

  const handleFileUploaded = (FileObject) => {
    const reader = new FileReader()
    reader.onload = ({ target }) => {
      const content = target.result.trim()
      if (validateContent(content)) {
        dispatch(actions.importMapping(
          //
          FileObject.name.split('.')[0],
          content,
        ))
      } else {
        dispatch(actions.reportError('Not a valid ZenEdit mapping file.'))
      }
    }

    reader.onerror = ({ target }) => {
      dispatch(actions.reportError(`File could not be read! Code ${target.error.code}`))
    }

    reader.readAsText(FileObject)
    return reader
  }

  return (
    <Dialog
      className={mappingsStyle.userMappingsDialog}
      onClose={hideUserMappingsDialog}
      open={userDialogVisible}
    >
      <DialogTitle>Imported Mappings</DialogTitle>
      <DialogContent>
        <section>
          {userMappings.length ? (
            userMappings.map((name, idx) => (
              <article key={`mp_${idx}`}>
                <aside>
                  <Tooltip
                    enterDelay={250}
                    placement="left"
                    title="Delete entry"
                  >
                    <i
                      className="material-icons"
                      onClick={() => dispatch(actions.deleteMapping(name))}
                    >
                      delete_forever
                    </i>
                  </Tooltip>
                </aside>
                <div>{name}</div>
              </article>
            ))
          ) : (
            <div className={mappingsStyle.noUserMappings}>You&apos;ve not imported any custom mappings yet</div>
          )}
        </section>
      </DialogContent>
      <DialogActions className={mappingsStyle.buttonBar}>
        <FilePicker
          extensions={['txt']}
          onChange={handleFileUploaded}
        >
          <Button>Import Mapping...</Button>
        </FilePicker>

        <Button
          autoFocus
          color="primary"
          onClick={hideUserMappingsDialog}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserMappingsDialog
