import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tabs from '@material-ui/core/Tabs'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border } from 'polished'
import ShiftGroup from '../ShiftGroup'
import { actions as shiftGroupActions } from '../../reducers/shiftGroups'
import { actions as mappingsActions } from '../../reducers/mappings'
import { actions as shifterActions } from '../../reducers/shifter'
// import { container, loadingCont, tabsCont } from '../../styles/shiftGroups.scss'
import GroupTab from '../entries/GroupTab'
import { groupsShape, inputControlShape, shifterShape, versionShape } from '../../core/shapes'

const heightHeader = 77
const inputControlsHeight = 280
const heightTabs = 48
const heightGridControls = 62
const heightFooter = 30
const viewportMargin = 30
const tabBorderWidth = 4

const gridHeight = heightHeader + inputControlsHeight + heightTabs
  + heightGridControls + heightFooter + viewportMargin + tabBorderWidth
  * 2 + 42

const useStyles = makeStyles(({ mixins: { important }, palette }) => ({
  root: { },
  loadingCont: {
    paddingTop: 80,
    textAlign: 'center',
    fontSize: 24,
    // color: '$color-text-dimmer',
    height: important(`calc(100vh - ${gridHeight}px + 55px)`),
    overflow: important('hidden'),
  },
  container: {
    ...border(4, 'solid', palette.accent),
    borderRadius: '0 4px 4px 4px',
  },
}), { name: 'ShiftGroups' })

export const ShiftGroups = (props) => {
  const {
    changeSelectedGroup,
    inputControls,
    shiftGroups: { groups, selectedGroupIdx, maxEntries, totalEntries },
    shifter: { ready },
    version: { proModel },
  } = props

  const classes = useStyles()

  const decoratedGroups = groups.map((group) => {
    const assignedControls = inputControls
      .filter((control, idx) => proModel || idx < 2)
      .filter(({ channel, value }) => channel === group.channel && value === group.value)
      .map(({ controlId }) => controlId + 1)
      .map(controlNumber => `FS${controlNumber}`)
    return { ...group, controlLabels: assignedControls }
  })

  return (
    <div>
      <div className={classes.root}>

        {/* classes.tabsCont */}
        <Tabs
          disabled={!ready}
          onChange={(e, idx) => changeSelectedGroup(idx)}
          value={selectedGroupIdx}
        >
          {decoratedGroups.map(({ label, active, groupId, controlLabels }, idx) => ready ? (
            <GroupTab
              active={active}
              controlLabels={controlLabels}
              groupId={groupId}
              key={idx}
              label={label}
            />
          ) : null)}
        </Tabs>
      </div>

      <div className={classes.container}>
        {decoratedGroups.map((group, idx) => idx === selectedGroupIdx && (
        <ShiftGroup
          key={idx}
          {...group}
          {...props}
          disabled={!ready}
          maxEntries={maxEntries}
          totalEntries={totalEntries}
        />
        ))}
        {Boolean(decoratedGroups.length === 0 || !ready) && (
          <div className={classes.loadingCont}>Searching for attached ZDS Shifter...</div>
        )}
      </div>
    </div>
  )
}

ShiftGroups.propTypes = {
  shiftGroups: groupsShape.isRequired,
  shifter: shifterShape.isRequired,
  inputControls: PropTypes.arrayOf(inputControlShape).isRequired,
  version: versionShape.isRequired,
  changeSelectedGroup: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shiftGroups, shifter, mappings, user, inputControls, version }) => ({
  shiftGroups,
  shifter,
  mappings,
  user,
  inputControls,
  version,
})
export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    //
    ...shiftGroupActions,
    ...mappingsActions,
    reportError: shifterActions.reportError,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShiftGroups)
