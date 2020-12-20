import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border } from 'polished'
import HorizontalTabs from 'components/tabs/HorizontalTabs'
import { actions } from 'reducers/shiftGroups'
import { stateShiftGroups, stateShifter } from 'selectors/index'
import { getShiftGroups } from 'selectors/shiftGroups'
import GroupTab from 'components/entries/GroupTab'
import ShiftGroup from 'components/ShiftGroup'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: '100%',
  },
  container: {
    ...border(4, 'solid', palette.accent),
    borderRadius: 4,
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
    <div className={classes.root}>
      <HorizontalTabs
        disabled={!ready}
        onChange={handleTabChange}
        value={selectedGroupIdx}
      >
        {groups.map(({ label, active, groupId, controlLabels }, idx) => ready ? (
          <GroupTab
            active={active}
            color="primary"
            controlLabels={controlLabels}
            groupId={groupId}
            key={idx}
            label={label}
          />
        ) : null)}
      </HorizontalTabs>

      <div className={classes.container}>
        <ShiftGroup groupId={selectedGroupIdx} />
      </div>
    </div>
  )
}

export default ShiftGroups
