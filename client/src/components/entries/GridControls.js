import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MappingsDialog from '../mappings/MappingsDialog'
import UserMappingsDialog from '../mappings/UserMappingsDialog'
import CCPicker from '../controls/CCPicker'
import ChannelPicker from '../controls/ChannelPicker'
import { isDisabled } from '../../selectors/shifter'
import { actions as mappingActions } from '../../reducers/mappings'
import useParamSelector from '../../hooks/useParamSelector'
import { canAddEntryToShiftGroup, getShiftGroup } from '../../selectors/shiftGroups'
import { stateMappings, stateShiftGroups } from '../../selectors'
import { actions as shiftGroupActions } from '../../reducers/shiftGroups'
import { isDefined } from '../../core/fp/utils'

const useStyles = makeStyles(({ mixins: { paddingR, rem } }) => ({
  addIcon: {
    marginRight: rem(1),
  },
  mappingButton: {
    textTransform: 'none',
    borderRadius: 5,
    maxHeight: 30,
    minHeight: 30,
    ...paddingR(0, 1),
  },
  addButton: {
    borderRadius: 8,
    minHeight: 50,
  },
  controls: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
}), { name: 'GridControls' })

const noMapping = 'No Mapping'

const GridControls = ({ groupId }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const disabled = useSelector(isDisabled)
  const shiftGroup = useParamSelector(getShiftGroup, groupId) || {}
  const { maxEntries, totalEntries } = useSelector(stateShiftGroups)
  const canAddEntry = useParamSelector(canAddEntryToShiftGroup, groupId)
  const mappings = useSelector(stateMappings)

  const { channels } = mappings
  const { channel, value } = shiftGroup

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (String(event.key).toUpperCase() === 'N' && canAddEntry) {
        event.preventDefault()
        dispatch(shiftGroupActions.addEntry(groupId))
      }
    }

    document.addEventListener('keydown', handleKeyDown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [canAddEntry, dispatch, groupId])

  const handleMappingClick = (event) => {
    event.preventDefault()
    dispatch(mappingActions.showMappingsDialog())
  }

  const mappingName = channels[channel] || noMapping

  return isDefined(value)
    ? (
      <>
        <MappingsDialog />

        <UserMappingsDialog />

        <Grid
          alignItems="flex-start"
          container
          justify="space-between"
          spacing={8}
          style={{ padding: 5 }}
          wrap="nowrap"
        >
          <Grid item>
            <Typography variant="subtitle2">Activated by CC</Typography>
            <Tooltip
              enterDelay={250}
              placement="top"
              title="The CC and channel that enables this group"
            >
              <div className={classes.controls}>
                <CCPicker
                  disabled={disabled}
                  onChange={newValue => dispatch(shiftGroupActions.changeGroupValue(groupId, newValue))}
                  style={{ maxWidth: 120 }}
                  value={value}
                />

                <ChannelPicker
                  channel={channel}
                  disabled={disabled}
                  onChange={newChannel => dispatch(shiftGroupActions.changeGroupChannel(groupId, newChannel))}
                  style={{ maxWidth: 120 }}
                />
              </div>
            </Tooltip>
          </Grid>

          <Grid item>
            <Typography variant="subtitle2">Mapping</Typography>
            <Tooltip
              enterDelay={250}
              title="Set channel mappings..."
            >
              <div>
                <Button
                  className={classes.mappingButton}
                  color="primary"
                  disabled={disabled}
                  onClick={handleMappingClick}
                  variant="contained"
                >
                  {mappingName}
                </Button>
              </div>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip
              enterDelay={250}
              title={`Maximum combined entries is ${maxEntries}`}
            >
              <>
                <Typography
                  style={{ textDecoration: 'underline' }}
                  variant="subtitle2"
                >
                  Used / Left
                </Typography>
                <div>{`${totalEntries} / ${maxEntries - totalEntries}`}</div>
              </>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip
              enterDelay={250}
              placement="left"
              title="Add new rule (press 'n' for shortcut)"
            >
              <div>
                <Button
                  className={classes.addButton}
                  color="primary"
                  disabled={!canAddEntry}
                  onClick={() => dispatch(shiftGroupActions.addEntry(groupId))}
                  variant="contained"
                >
                  <Add className={classes.addIcon} />
                  Add
                </Button>
              </div>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    )
    : null
}

GridControls.propTypes = {
  groupId: PropTypes.number.isRequired,
}

export default GridControls
