import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { STATUS_CONTROL_CHANGE } from 'zds-pickers'
import InputStatusIcon from '../InputStatusIcon'
import { entryControls } from '../../styles/entryDlg.scss'
import { groupShape, mappingsShape } from '../../shapes'
import EntryControlSet from './EntryControlSet'

class EntryControls extends Component {
  static propTypes = {
    group: groupShape.isRequired,
    changeStatus: PropTypes.func.isRequired,
    changeChannel: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    mappings: mappingsShape.isRequired,
    okButtonRef: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.outputRef = createRef()
    this.inputRef = createRef()
  }

  onPressedEnter = (isInput, actuallyTheyPressedTab, okButtonRef) => {
    const { group: { editQueue } } = this.props

    const { output: { status } } = editQueue

    if (status !== STATUS_CONTROL_CHANGE && isInput) {
      this.outputRef.current.focusValueControl()
    } else if (!actuallyTheyPressedTab) {
      okButtonRef.current.focus()
    }
  }

  render() {
    const {
      changeChannel,
      changeStatus,
      changeValue,
      group: { groupId, editQueue },
      mappings,
      okButtonRef,
    } = this.props

    const { input, output } = editQueue
    const inputProps = {
      groupId,
      entry: input,
      isInput: true,
      changeStatus,
      changeChannel,
      changeValue,
      mappings,
      okButtonRef,
      onPressedEnter: this.onPressedEnter,
    }
    const outputProps = {
      groupId,
      entry: output,
      isInput: false,
      changeStatus,
      changeChannel,
      changeValue,
      mappings,
      okButtonRef,
      onPressedEnter: this.onPressedEnter,
    }

    return (
      <section className={entryControls}>
        <EntryControlSet
          {...inputProps}
          otherEntry={outputProps.entry}
          ref={this.inputRef}
        />
        <InputStatusIcon {...input} />
        <EntryControlSet
          {...outputProps}
          otherEntry={inputProps.entry}
          ref={this.outputRef}
        />
      </section>
    )
  }
}

export default EntryControls
