import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tabs from '@material-ui/core/Tabs'
import ShiftGroup from '../ShiftGroup'
import { actions as shiftGroupActions } from '../../reducers/shiftGroups'
import { actions as mappingsActions } from '../../reducers/mappings'
import { actions as shifterActions } from '../../reducers/shifter'
import { container, loadingCont, tabsCont } from '../../styles/shiftGroups.scss'
import GroupTab from '../entries/GroupTab'
import { groupsShape, inputControlShape, shifterShape, versionShape } from '../../shapes'

export const ShiftGroups = (props) => {
  const {
    changeSelectedGroup,
    inputControls,
    shiftGroups: { groups, selectedGroupIdx, maxEntries, totalEntries },
    shifter: { ready },
    version: { proModel },
  } = props

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
      <div className={tabsCont}>
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

      <div className={container}>
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
        {(decoratedGroups.length === 0 || !ready) && (
          <div className={loadingCont}>Searching for attached ZDS Shifter...</div>
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
