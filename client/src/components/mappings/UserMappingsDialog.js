/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useCallback } from 'react'
import { validateContent } from 'zds-mappings'
import { FilePicker } from 'nebiru-react-file-picker'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DeleteForever from '@material-ui/icons/DeleteForever'
import Dialog from 'components/Dialog'
import { stateMappings } from 'selectors/index'
import { actions as mappingActions } from 'reducers/mappings'
import { actions as errorActions } from 'reducers/errorLog'

const useStyles = makeStyles(({ mixins: { borderS, important, rem }, palette }) => ({
  root: {
    '& section': {
      ...borderS(palette.border),
      borderRadius: 3,
      width: 300,
      height: 300,
      padding: rem(2),
      overflowY: 'auto',

      '& article': {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        marginBottom: rem(2),
        minWidth: 250,
        fontSize: rem(1.6),

        '& aside': {
          paddingTop: 4,
          marginRight: rem(1),
          cursor: 'pointer',
        },
      },
    },
  },
  noUserMappings: {
    fontStyle: 'italic',
    fontSize: rem(2),
    color: palette.text.secondary,
    width: '100%',
    textAlign: 'center',
    marginTop: 30,
  },
  buttonBar: {
    justifyContent: important('space-between'),
  },
}), { name: 'UserMappingsDialog' })

const UserMappingsDialog = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const {
    userDialogVisible,
    userMappings,
  } = useSelector(stateMappings)

  const hideUserMappingsDialog = useCallback(() => {
    dispatch(mappingActions.hideUserMappingsDialog())
  }, [dispatch])

  const handleFileUploaded = (FileObject) => {
    const reader = new FileReader()
    reader.onload = ({ target }) => {
      const content = target.result.trim()
      if (validateContent(content)) {
        dispatch(mappingActions.importMapping(
          FileObject.name.split('.')[0],
          content,
        ))
      } else {
        dispatch(errorActions.reportError('Not a valid ZenEdit mapping file.'))
      }
    }

    reader.onerror = ({ target }) => {
      dispatch(errorActions.reportError(`File could not be read! Code ${target.error.code}`))
    }

    reader.readAsText(FileObject)
    return reader
  }

  return (
    <Dialog
      className={classes.root}
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
                    title="Delete mapping"
                  >
                    <DeleteForever onClick={() => dispatch(mappingActions.deleteMapping(name))} />
                  </Tooltip>
                </aside>
                <div>{name}</div>
              </article>
            ))
          ) : (
            <div className={classes.noUserMappings}>You&apos;ve not imported any custom mappings yet</div>
          )}
        </section>
      </DialogContent>

      <DialogActions className={classes.buttonBar}>
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
