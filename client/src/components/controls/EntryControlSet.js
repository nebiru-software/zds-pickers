import { forwardRef, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, margin, padding } from 'polished'
import {
  CCPicker,
  ChannelPicker,
  NotePicker,
  STATUS_CONTROL_CHANGE,
  STATUS_NOTE_OFF,
  STATUS_NOTE_ON,
  STATUS_PITCH_WHEEL,
  StatusPicker,
  ValuePicker,
  statuses,
} from 'zds-pickers'
import { getMapping, getNoteValue } from 'reducers/mappings'
import { mappingsShape, midiMessageShape } from 'core/shapes'

const useStyles = makeStyles(({ mixins: { absWidth }, palette }) => ({
  entryControlSet: {
    ...margin(0, 10),
    ...padding(0, 20, 20),
    ...border(4, 'solid', palette.accent),
    borderRadius: 15,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'center',
    height: 144,
    ...absWidth(170),

    '& h3': {
      textAlign: 'center',
      margin: '10px 0 0',
      color: palette.text.primary,
    },
  },

  notePicker: {

  },

  valuePicker: {

  },
}), { name: 'EntryControlSet' })

const EntryControlSet = forwardRef((props, ref) => {
  const {
    changeChannel,
    changeStatus,
    changeValue,
    entry: { status },
    entry,
    groupId,
    isInput,
    mappings: { channels },
    okButtonRef,
    onPressedEnter,
    otherEntry,
  } = props
  const classes = useStyles()
  const valueControlRef = useRef()

  // const focusValueControl = () => {
  //   const { current } = valueControlRef
  //   const control = current.input || current.select
  //   control.focus()
  // }

  const statusList = useMemo(
    () => statuses
    // You cannot set input to 'stack' mode
      .filter(({ value }) => !isInput || value !== STATUS_NOTE_OFF)
    // Pitch Wheel is not possible with the Shifter
      .filter(({ value }) => value !== STATUS_PITCH_WHEEL)
    // You MUST use Note On if stacking notes
      .filter(({ value }) => isInput || otherEntry.status === STATUS_NOTE_ON || value !== STATUS_NOTE_OFF)
      .filter(({ value }) => !isInput || otherEntry.status !== STATUS_NOTE_OFF || value === STATUS_NOTE_ON),
    [isInput, otherEntry.status],
  )

  const handleKeyDown = (event) => {
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
    ref: valueControlRef,
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
          className={classes.notePicker}
        />
      )
    }
    return (
      <ValuePicker
        {...entryProps}
        className={classes.valuePicker}
        ref={valueControlRef}
        {...pickerProps}
      />
    )
  }

  return (
    <div
      className={classes.entryControlSet}
      ref={ref}
    >
      <h3>{isInput ? 'Input' : 'Output'}</h3>
      <StatusPicker
        // {...entry}
        onChange={value => changeStatus(groupId, isInput, value)}
        statuses={statusList}
        value={entry.status}
      />
      <ChannelPicker
        {...entry}
        onChange={value => changeChannel(groupId, isInput, value)}
      />
      {renderPicker()}
    </div>
  )
})

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
