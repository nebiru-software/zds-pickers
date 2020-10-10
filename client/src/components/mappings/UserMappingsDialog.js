/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import PropTypes from 'prop-types'
import { validateContent } from 'zds-mappings'
import { FilePicker } from 'nebiru-react-file-picker'
import Button from '@material-ui/core/Button'
import mappingsStyle from '../../styles/mappings.scss'
import Dialog from '../Dialog'

const UserMappingsDialog = ({
  userDialogVisible,
  userMappings,
  hideUserMappingsDialog,
  reportError,
  importMapping,
  deleteMapping,
}) => {
  const handleFileUploaded = (FileObject) => {
    const reader = new FileReader()
    reader.onload = ({ target }) => {
      const content = target.result.trim()
      if (validateContent(content)) {
        importMapping(
          //
          FileObject.name.split('.')[0],
          content,
        )
      } else {
        reportError('Not a valid ZenEdit mapping file.')
      }
    }

    reader.onerror = ({ target }) => {
      reportError(`File could not be read! Code ${target.error.code}`)
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
                      onClick={() => deleteMapping(name)}
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
          onError={reportError}
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

UserMappingsDialog.propTypes = {
  userMappings: PropTypes.arrayOf(PropTypes.string).isRequired,
  userDialogVisible: PropTypes.bool.isRequired,
  hideUserMappingsDialog: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  importMapping: PropTypes.func.isRequired,
  deleteMapping: PropTypes.func.isRequired,
}

export default UserMappingsDialog
