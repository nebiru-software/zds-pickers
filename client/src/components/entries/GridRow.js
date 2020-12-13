/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { createDragPreview } from 'react-dnd-text-dragpreview'
import { STATUS_CONTROL_CHANGE, STATUS_NOTE_OFF, STATUS_NOTE_ON, ccValues } from 'zds-pickers'
import classNames from 'classnames'
import Tooltip from '@material-ui/core/Tooltip'
import DragTypes from '../../core/dragTypes'
import { gridFriendlyData } from '../../reducers/shiftGroup'
import styles from '../../styles/shiftGroupRow.scss'
import { getNoteValue } from '../../reducers/mappings'
import { entryShape } from '../../core/shapes'

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

class GridRow extends PureComponent {
  componentDidMount() {
    const { connectDragPreview, selectedRows } = this.props

    /* istanbul ignore else */
    if (connectDragPreview) {
      this.dragPreview = createDragPreview(formatDragMessage(selectedRows.length), dragPreviewStyle)

      connectDragPreview(this.dragPreview)
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedRows } = this.props
    /* istanbul ignore else */
    if (selectedRows.length !== prevProps.selectedRows.length) {
      this.dragPreview = createDragPreview(formatDragMessage(selectedRows.length), dragPreviewStyle, this.dragPreview)
    }
  }

  render() {
    const {
      channels,
      clickHandler,
      disabled,
      editEntry,
      entry,
      groupId,
      idx,
      removeEntry,
      selected,
      selectedRows,
    } = this.props
    const { connectDragSource } = this.props
    const { entryId } = entry
    const { indicator, input, output } = gridFriendlyData(entry)

    const FormattedValue = (value, label) => (
      <div className={styles.formattedNoteName}>
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

    const rowClass = classNames({
      [styles.gridRow]: true,
      [styles.gridRowSelected]: selected && !disabled,
      [styles.gridRowDisabled]: disabled,
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
              <i
                className="material-icons"
                onClick={handleEdit}
              >
                mode_edit
              </i>
            </Tooltip>
          </aside>
          <div className={styles.ellipsis}>{input.statusLabel}</div>
          <div>{input.channel + 1}</div>
          <div className={styles.ellipsis}>{formatValue(input)}</div>
        </section>
        <section>
          <aside>{indicator}</aside>
        </section>
        <section>
          <div className={styles.ellipsis}>{output.statusLabel}</div>
          <div>{output.channel + 1}</div>
          <div className={styles.ellipsis}>{formatValue(output)}</div>
          <aside>
            <Tooltip
              enterDelay={250}
              placement="left"
              title={selected ? 'Delete selected' : 'Delete Entry'}
            >
              <i
                className="material-icons"
                onClick={handleDelete}
                tag="iDelete"
              >
                delete_forever
              </i>
            </Tooltip>
          </aside>
        </section>
      </div>
    )

    return connectDragSource(renderedOutput)
  }
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
