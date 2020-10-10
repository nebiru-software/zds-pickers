import React, { Component } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab'
import { DropTarget } from 'react-dnd'
import DragTypes from '../../dragTypes'

export const boxTarget = {
  drop({ groupId }) {
    return { name: 'TAB', groupId }
  },
  canDrop(props, monitor) {
    return props.groupId !== monitor.getItem().groupId
  },
}

const styles = theme => ({
  activeLabel: {
    color: theme.palette.primary[50],
  },
  controlsLabel: {
    position: 'absolute',
    bottom: 1,
    paddingLeft: 5,
    fontSize: '0.75rem',
  },
  dropTarget: {
    background: '#90283c',
    color: 'white',
  },
  dropTargetOver: {
    background: 'green',
    color: 'white',
  },
})

const builtDropTarget = DropTarget(DragTypes.ENTRY, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))

class GroupTab extends Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func,
    canDrop: PropTypes.bool,
    isOver: PropTypes.bool,
    groupId: PropTypes.number.isRequired,
    controlLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    canDrop: false,
    isOver: false,
    connectDropTarget: null,
  }

  render() {
    const {
      active,
      canDrop,
      classes,
      connectDropTarget,
      controlLabels,
      groupId,
      isOver,
      selected,
      ...rest
    } = this.props

    const labelClassName = classNames({
      [classes.controlsLabel]: true,
      [classes.activeLabel]: selected,
    })

    const tabClassName = classNames({
      [classes.dropTarget]: canDrop,
      [classes.dropTargetOver]: canDrop && isOver,
    })

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
}

export default compose(
  builtDropTarget,
  withStyles(styles),
)(GroupTab)
