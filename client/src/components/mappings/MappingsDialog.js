import { useCallback, useMemo } from 'react'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import MenuItem from '@material-ui/core/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { margin, padding } from 'polished'
import Star from '@material-ui/icons/Star'
import Divider from '@material-ui/core/Divider'
import Dialog from 'components/Dialog'
import { stateMappings } from 'selectors/index'
import { actions } from 'reducers/mappings'
import MappingPicker from './MappingPicker'

const useStyles = makeStyles(({ mixins: { absWidth, important, rem }, palette }) => ({
  root: {
    '& section': {
      display: 'flex',
      flexFlow: 'column wrap',
      maxHeight: 330,
      width: 580,
      paddingRight: 4,

      '& article': {
        display: 'flex',
        flexFlow: 'row nowrap',
        ...margin(0, 8, 4, 0),
        minWidth: 250,

        '& > div:first-of-type': {
          userSelect: 'none',
          minWidth: 27,
          marginRight: 5,
          backgroundColor: palette.grey[200],
          textAlign: 'center',
          ...padding(9, 1, 0, 2),
          borderRadius: 6,
          fontWeight: 'bold',
          fontSize: rem(1.2),
        },

        '& > div:nth-of-type(2)': {
          '& > div:first-of-type': absWidth(220),
        },
      },

      '& article:nth-child(10)': {
        '& > div:first-of-type': {
          backgroundColor: palette.grey[400],
          color: 'white',
        },
      },

      '& .MuiSelect-select svg': { display: 'none' },
    },
  },
  userMapping: {
    fontWeight: 'bold',
    '& svg': {
      width: 18,
      marginRight: rem(0.7),
      marginBottom: 2,
      fill: 'orange',
    },
  },
  noMapping: {
    fontStyle: 'italic',
    color: palette.text.greyed,
    textAlign: 'center',
    marginLeft: rem(2.7),
  },
  buttonBar: {
    justifyContent: important('space-between'),
  },
}), { name: 'MappingsDialog' })

const MappingsDialog = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
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

  const menuSource = useMemo(() => {
    const userMenuSource = userMappings.map((label, idx) => (
      <MenuItem
        className={classes.userMapping}
        key={`${label}_${idx}`}
        value={label}
      >
        <Star />
        {label}
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

    const clearEntry = (
      <MenuItem
        className={classes.noMapping}
        key="clear"
        value={null}
      >
        No Mapping
      </MenuItem>
    )

    return [
      clearEntry,
      <Divider key="divider-1" />,
      ...userMenuSource,
      userMenuSource.length ? <Divider key="divider-2" /> : null,
      ...stockMenuSource,
    ]
  }, [classes.noMapping, classes.userMapping, stockMappings, userMappings])

  return (
    <Dialog
      className={classes.root}
      maxWidth={false}
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
      <DialogActions className={classes.buttonBar}>
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
