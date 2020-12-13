import { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import {
  NotePicker,
  STATUS_CONTROL_CHANGE,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
  STATUS_PITCH_WHEEL,
  StatusPicker,
  ValuePicker,
  statuses,
} from 'zds-pickers'
import { entryControlSet, notePicker, valuePicker } from '../../styles/entryDlg.scss'
import { getMapping, getNoteValue } from '../../reducers/mappings'
import { mappingsShape, midiMessageShape } from '../../core/shapes'
import CCPicker from './CCPicker'
import ChannelPicker from './ChannelPicker'

class EntryControlSet extends Component {
  constructor(props) {
    super(props)
    this.valueControlRef = createRef()
  }

  focusValueControl = () => {
    const { current } = this.valueControlRef
    const control = current.input || current.select
    control.focus()
  }

  render() {
    const {
      changeChannel,
      changeStatus,
      changeValue,
      entry: { status },
      entry,
      groupId,
      isInput,
      mappings: { channels },
      onPressedEnter,
      otherEntry,
    } = this.props

    const statusList = statuses
      // You cannot set input to 'stack' mode
      .filter(({ value }) => !isInput || value !== STATUS_NOTE_OFF)
      // Pitch Wheel is not possible with the Shifter
      .filter(({ value }) => value !== STATUS_PITCH_WHEEL)
      // You MUST use Note On if stacking notes
      .filter(({ value }) => isInput || otherEntry.status === STATUS_NOTE_ON || value !== STATUS_NOTE_OFF)
      .filter(({ value }) => !isInput || otherEntry.status !== STATUS_NOTE_OFF || value === STATUS_NOTE_ON)

    const handleKeyDown = (event) => {
      const { okButtonRef } = this.props
      /* istanbul ignore else */
      if (event.key === 'Tab') {
        event.preventDefault()
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        onPressedEnter(isInput, event.key === 'Tab', okButtonRef)
      }
    }

    const entryProps = { ...entry }

    if (entryProps.status === STATUS_NOTE_ON) {
      const entryData = getNoteValue(channels, entry.channel, entry.value)
      /* istanbul ignore else */
      if (entryData) {
        entryProps.value = `${entryData.note} ${entryData.name}`
      }
    }

    const pickerProps = {
      onChange: value => changeValue(groupId, isInput, value),
      autoFocus: isInput,
      onKeyDown: handleKeyDown,
      inputRef: this.valueControlRef,
    }

    const renderPicker = () => {
      const mapping = getMapping(channels, entry.channel)

      if (status === STATUS_CONTROL_CHANGE) {
        return (
          <CCPicker
            {...entry}
            {...pickerProps}
          />
        )
      }
      if ((status === STATUS_NOTE_ON || status === STATUS_NOTE_OFF) && mapping) {
        return (
          <NotePicker
            mapping={mapping}
            {...entry}
            {...pickerProps}
            className={notePicker}
          />
        )
      }
      return (
        <ValuePicker
          {...entryProps}
          className={valuePicker}
          ref={this.valueControlRef}
          {...pickerProps}
        />
      )
    }

    return (
      <div className={entryControlSet}>
        <h3>{isInput ? 'Input' : 'Output'}</h3>
        <StatusPicker
          {...entry}
          onChange={value => changeStatus(groupId, isInput, value)}
          statuses={statusList}
        />
        <ChannelPicker
          {...entry}
          onChange={value => changeChannel(groupId, isInput, value)}
        />
        {renderPicker()}
      </div>
    )
  }
}

EntryControlSet.propTypes = {
  isInput: PropTypes.bool,
  entry: midiMessageShape.isRequired,
  groupId: PropTypes.number.isRequired,
  changeStatus: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  changeChannel: PropTypes.func.isRequired,
  onPressedEnter: PropTypes.func.isRequired,
  mappings: mappingsShape.isRequired,
  otherEntry: midiMessageShape.isRequired,
  okButtonRef: PropTypes.object.isRequired,
}

EntryControlSet.defaultProps = {
  isInput: false,
}

export default EntryControlSet
