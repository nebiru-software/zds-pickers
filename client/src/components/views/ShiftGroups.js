import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border } from 'polished'
import ShiftGroup from '../ShiftGroup'
import { actions } from '../../reducers/shiftGroups'
import GroupTab from '../entries/GroupTab'
import { stateShiftGroups, stateShifter } from '../../selectors'
import { getShiftGroups } from '../../selectors/shiftGroups'

const useStyles = makeStyles(({ constants, mixins: { important }, palette }) => ({
  root: { },
  loadingCont: {
    paddingTop: 80,
    textAlign: 'center',
    fontSize: 24,
    // color: '$color-text-dimmer',
    height: important(`calc(100vh - ${constants.gridHeight}px + 55px)`),
    overflow: important('hidden'),
  },
  container: {
    ...border(4, 'solid', palette.accent),
    borderRadius: '0 4px 4px 4px',
  },
}), { name: 'ShiftGroups' })

export const ShiftGroups = () => {
  const dispatch = useDispatch()
  const { selectedGroupIdx } = useSelector(stateShiftGroups)
  const { groups } = useSelector(getShiftGroups)
  const { ready } = useSelector(stateShifter)

  const classes = useStyles()

  const handleTabChange = useCallback((e, idx) => {
    dispatch(actions.changeSelectedGroup(idx))
  }, [dispatch])

  return (
    <div>
      <div className={classes.root}>

        {/* classes.tabsCont */}
        <Tabs
          disabled={!ready}
          onChange={handleTabChange}
          value={selectedGroupIdx}
        >
          {groups.map(({ label, active, groupId, controlLabels }, idx) => ready ? (
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
        <ShiftGroup groupId={selectedGroupIdx} />

        {Boolean(groups.length === 0 || !ready) && (
          <div className={classes.loadingCont}>Searching for attached ZDS Shifter...</div>
        )}
      </div>
    </div>
  )
}

export default ShiftGroups
