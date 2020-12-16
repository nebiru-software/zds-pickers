/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { createDragPreview } from 'react-dnd-text-dragpreview'
import cl from 'classnames'
import Tooltip from '@material-ui/core/Tooltip'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useEffect } from 'react'
import { border, lighten, padding } from 'polished'
import DeleteForever from '@material-ui/icons/DeleteForever'
import Edit from '@material-ui/icons/Edit'
import { STATUS_CONTROL_CHANGE, STATUS_NOTE_OFF, STATUS_NOTE_ON, ccValues } from 'zds-pickers'
import DragTypes from 'core/dragTypes'
import { gridFriendlyData } from 'reducers/shiftGroup'
import { getNoteValue } from 'reducers/mappings'
import { entryShape } from 'core/shapes'

const useStyles = makeStyles(({ mixins: { absWidth, ellipsis, important, percentage }, palette }) => ({
  formattedNoteName: {
    display: 'flex',
    flexFlow: 'row nowrap',
    '& article': ellipsis(),
  },

  gridRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    textAlign: 'center',
    userSelect: 'none',
    ...border(2, 'solid', 'transparent'),

    '& section': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      width: percentage(50),
      ...padding(4, 0),

      '& aside': {
        // Icons
        ...absWidth(30),
        color: palette.text.greyed,
      },

      '& > div:first-of-type': {
        // Message
        ...absWidth(100),
      },

      '& > div:nth-of-type(2)': {
        // Channel
        ...absWidth(75),
      },

      '& > div:nth-of-type(3)': {
        // Value
        ...absWidth(160),
      },
    },

    '& section:nth-child(odd)': {
      flexGrow: 1,
      '& aside': {
        cursor: 'pointer',
      },
    },

    '& section:nth-child(even)': absWidth(40),
  },

  gridRowSelected: {
    borderRadius: 3,
    ...border(2, 'solid', palette.accent),
    backgroundColor: important(lighten(0.7, palette.accent)),
  },

  gridRowDisabled: {
    fontStyle: 'italic',
    color: palette.text.secondary,
  },

  ellipsis: ellipsis(),
}), { name: 'GridRow' })

const dragPreviewStyle = {
  backgroundColor: 'rgb(68, 67, 67)',
  color: 'white',
  fontSize: 15,
  paddingTop: 4,
  paddingRight: 7,
  paddingBottom: 6,
  paddingLeft: 7,
}

const formatDragMessage = (numRows) => {
  const noun = numRows === 1 ? 'item' : 'items'
  return `${numRows} ${noun}`
}

export const entrySource = {
  canDrag(props) {
    return props.selectedRows.length > 0
  },

  beginDrag(props) {
    return {
      groupId: props.groupId,
    }
  },

  endDrag({ groupId: sourceGroupId, selectedRows, handleDraggedFrom }, monitor) {
    const dropResult = monitor.getDropResult()

    if (dropResult) {
      handleDraggedFrom({
        sourceGroupId,
        destGroupId: dropResult.groupId,
        selectedRows,
        copy: dropResult.dropEffect === 'copy',
      })
    }
  },
}

const builtDragSource = DragSource(DragTypes.ENTRY, entrySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))

const GridRow = (props) => {
  const {
    channels,
    clickHandler,
    connectDragPreview,
    connectDragSource,
    disabled,
    editEntry,
    entry,
    groupId,
    idx,
    removeEntry,
    selected,
    selectedRows,
  } = props

  const classes = useStyles()

  useEffect(
    () => {
      if (connectDragPreview) {
        const dragPreview = createDragPreview(formatDragMessage(selectedRows.length), dragPreviewStyle)

        connectDragPreview(dragPreview)
      }
    },
    [connectDragPreview, selectedRows.length],
  )

  // componentDidUpdate(prevProps) {
  //   const { selectedRows } = this.props
  //   /* istanbul ignore else */
  //   if (selectedRows.length !== prevProps.selectedRows.length) {
  //     this.dragPreview = createDragPreview(formatDragMessage(selectedRows.length),
  // dragPreviewStyle, this.dragPreview)
  //   }
  // }

  const { entryId } = entry
  const { indicator, input, output } = gridFriendlyData(entry)

  const FormattedValue = (value, label) => (
    <div className={classes.formattedNoteName}>
      <aside>{value}</aside>
      <article>{label}</article>
    </div>
  )

  const formatValue = ({ status, channel, value }) => {
    let entryData
    let label

    switch (status) {
    case STATUS_NOTE_ON:
    case STATUS_NOTE_OFF:
      entryData = getNoteValue(channels, channel, value)
      label = entryData ? entryData.name : ''
      break

    case STATUS_CONTROL_CHANGE:
      label = ccValues[value].label
        .split(' ')
        .slice(1)
        .join(' ')
      break

    default:
      break
    }

    return FormattedValue(value, label)
  }

  const handleEdit = () => !disabled && editEntry(groupId, entryId)

  const handleDelete = (event) => {
    event.stopPropagation()
    if (!disabled) {
      removeEntry(groupId, selected ? selectedRows : entryId)
    }
  }

  const handleClick = event => clickHandler(event, idx, entry.entryId)

  const rowClass = cl({
    [classes.gridRow]: true,
    [classes.gridRowSelected]: selected && !disabled,
    [classes.gridRowDisabled]: disabled,
  })

  const renderedOutput = (
    <div
      className={rowClass}
      onClick={handleClick}
      onDoubleClick={handleEdit}
    >
      <section>
        <aside>
          <Tooltip
            enterDelay={250}
            placement="right"
            title="Edit (double-clicking row does the same)"
          >
            <Edit onClick={handleEdit} />
          </Tooltip>
        </aside>
        <div className={classes.ellipsis}>{input.statusLabel}</div>
        <div>{input.channel + 1}</div>
        <div className={classes.ellipsis}>{formatValue(input)}</div>
      </section>

      <section>
        <aside>{indicator}</aside>
      </section>

      <section>
        <div className={classes.ellipsis}>{output.statusLabel}</div>
        <div>{output.channel + 1}</div>
        <div className={classes.ellipsis}>{formatValue(output)}</div>
        <aside>
          <Tooltip
            enterDelay={250}
            placement="left"
            title={selected ? 'Delete selected' : 'Delete Entry'}
          >
            <DeleteForever onClick={handleDelete} />
          </Tooltip>
        </aside>
      </section>
    </div>
  )

  return connectDragSource(renderedOutput)
}

GridRow.propTypes = {
  groupId: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  editEntry: PropTypes.func.isRequired,
  removeEntry: PropTypes.func.isRequired,
  entry: entryShape.isRequired,
  selected: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  channels: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  clickHandler: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

GridRow.defaultProps = {
  connectDragSource: null,
  connectDragPreview: null,
}

export default builtDragSource(GridRow)
