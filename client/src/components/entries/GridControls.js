import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import MappingsDialog from '../mappings/MappingsDialog'
import UserMappingsDialog from '../mappings/UserMappingsDialog'
import { mappingsShape, shifterShape, userShape } from '../../core/shapes'
import CCPicker from '../controls/CCPicker'
import ChannelPicker from '../controls/ChannelPicker'

/* istanbul ignore next */
const styles = theme => ({
  addIcon: {
    marginRight: theme.spacing.unit,
  },
  mappingButton: {
    textTransform: 'none',
    borderRadius: 5,
    maxHeight: 30,
    minHeight: 30,
    padding: `0 ${theme.spacing.unit}px`,
  },
  addButton: {
    borderRadius: 8,
    minHeight: 50,
  },
})

export class GridControls extends Component {
  static noMapping = 'No Mapping'

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

  handleMappingClick = (event) => {
    const { showMappingsDialog } = this.props
    event.preventDefault()
    showMappingsDialog()
  }

  canAddEntry = () => {
    const {
      disabled,
      editing,
      mappings: { dialogVisible, userDialogVisible, userImportDialogVisible },
      maxEntries,
      shifter: { responding, found, importDialogVisible, importInProcess, exportDialogVisible, errorVisible },
      totalEntries,
      user: { dialogVisible: registrationDialogVisible },
    } = this.props
    return (
      responding
      && found
      && !disabled
      && !editing
      && !dialogVisible
      && !importDialogVisible
      && !importInProcess
      && !userDialogVisible
      && !userImportDialogVisible
      && !exportDialogVisible
      && !errorVisible
      && !registrationDialogVisible
      && totalEntries < maxEntries
    )
  }

  handleKeyDown = (event) => {
    const {
      canAddEntry,
      props: { addEntry, groupId },
    } = this

    if (String(event.key).toUpperCase() === 'N' && canAddEntry()) {
      event.preventDefault()
      addEntry(groupId)
    }
  }

  render() {
    const {
      addEntry,
      changeGroupChannel,
      changeGroupValue,
      changeMapping,
      channel,
      classes,
      deleteMapping,
      disabled,
      groupId,
      hideMappingsDialog,
      hideUserMappingsDialog,
      importMapping,
      mappings,
      mappings: { channels },
      maxEntries,
      reportError,
      shifter: { ready },
      showUserMappingsDialog,
      totalEntries,
      value,
    } = this.props

    const mappingName = channels[channel] || this.noMapping

    return (
      <>
        <MappingsDialog
          {...mappings}
          changeMapping={changeMapping}
          hideMappingsDialog={hideMappingsDialog}
          showUserMappingsDialog={showUserMappingsDialog}
        />

        <UserMappingsDialog
          {...mappings}
          deleteMapping={deleteMapping}
          hideUserMappingsDialog={hideUserMappingsDialog}
          importMapping={importMapping}
          reportError={reportError}
        />

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
              <div>
                <CCPicker
                  disabled={disabled}
                  onChange={newValue => changeGroupValue(groupId, newValue)}
                  style={{ maxWidth: 120 }}
                  value={value}
                />

                <ChannelPicker
                  channel={channel}
                  disabled={disabled}
                  onChange={newChannel => changeGroupChannel(groupId, newChannel)}
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
                  disabled={!ready}
                  onClick={this.handleMappingClick}
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
                  disabled={!this.canAddEntry()}
                  onClick={() => addEntry(groupId)}
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
  }
}

GridControls.propTypes = {
  changeGroupChannel: PropTypes.func.isRequired,
  changeGroupValue: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  mappings: mappingsShape.isRequired,
  showMappingsDialog: PropTypes.func.isRequired,
  hideMappingsDialog: PropTypes.func.isRequired,
  changeMapping: PropTypes.func.isRequired,
  showUserMappingsDialog: PropTypes.func.isRequired,
  hideUserMappingsDialog: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  importMapping: PropTypes.func.isRequired,
  deleteMapping: PropTypes.func.isRequired,
  maxEntries: PropTypes.number.isRequired,
  totalEntries: PropTypes.number.isRequired,
  editing: PropTypes.bool.isRequired,
  shifter: shifterShape.isRequired,
  user: userShape.isRequired,
  groupId: PropTypes.number.isRequired,
  channel: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

export default withStyles(styles)(GridControls)
