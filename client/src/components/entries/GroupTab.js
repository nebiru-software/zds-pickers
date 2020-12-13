import { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tab from '@material-ui/core/Tab'
import { DropTarget } from 'react-dnd'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DragTypes from '../../core/dragTypes'

export const boxTarget = {
  drop({ groupId }) {
    return { name: 'TAB', groupId }
  },
  canDrop(props, monitor) {
    return props.groupId !== monitor.getItem().groupId
  },
}

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  activeLabel: {
    color: palette.primary[50],
  },
  controlsLabel: {
    position: 'absolute',
    bottom: -1,
    paddingLeft: 5,
    fontSize: rem(1.15),
  },
  dropTarget: {
    background: '#90283c',
    color: palette.common.white,
  },
  dropTargetOver: {
    background: palette.common.green,
    color: palette.common.white,
  },
}), { name: 'GroupTab' })

const builtDropTarget = DropTarget(DragTypes.ENTRY, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))

const GroupTab = (props) => {
  const {
    active,
    canDrop,
    connectDropTarget,
    controlLabels,
    groupId,
    isOver,
    selected,
    ...rest
  } = props
  const classes = useStyles()

  const labelClassName = useMemo(
    () => classNames({
      [classes.controlsLabel]: true,
      [classes.activeLabel]: selected,
    }),
    [classes.activeLabel, classes.controlsLabel, selected],
  )

  const tabClassName = useMemo(
    () => classNames({
      [classes.dropTarget]: canDrop,
      [classes.dropTargetOver]: canDrop && isOver,
    }),
    [canDrop, classes.dropTarget, classes.dropTargetOver, isOver],
  )

  const renderedOutput = (
    <div>
      <Tab
        {...rest}
        active={active ? 'true' : 'false'}
        className={tabClassName}
        selected={selected}
      />
      <div className={labelClassName}>{controlLabels.join(', ')}</div>
    </div>
  )

  return connectDropTarget(renderedOutput)
}

GroupTab.propTypes = {
  active: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  connectDropTarget: PropTypes.func,
  controlLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupId: PropTypes.number.isRequired,
  isOver: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
}

GroupTab.defaultProps = {
  canDrop: false,
  connectDropTarget: null,
  isOver: false,
}

export default builtDropTarget(GroupTab)
