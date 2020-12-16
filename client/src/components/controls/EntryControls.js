import { useRef } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { STATUS_CONTROL_CHANGE } from 'zds-pickers'
import InputStatusIcon from 'components/InputStatusIcon'
import { groupShape, mappingsShape } from 'core/shapes'
import EntryControlSet from './EntryControlSet'

const EntryControls = (props) => {
  const {
    changeChannel,
    changeStatus,
    changeValue,
    group: {
      groupId,
      editQueue,
    },
    mappings,
    okButtonRef,
  } = props

  const outputRef = useRef()
  const inputRef = useRef()

  const onPressedEnter = (isInput, actuallyTheyPressedTab) => {
    const { output: { status } } = editQueue

    if (status !== STATUS_CONTROL_CHANGE && isInput) {
      outputRef.current.focusValueControl()
    } else if (!actuallyTheyPressedTab) {
      okButtonRef.current.focus()
    }
  }

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
    onPressedEnter,
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
    onPressedEnter,
  }

  return (
    <Grid container>
      <Grid item>
        <EntryControlSet
          {...inputProps}
          otherEntry={outputProps.entry}
          ref={inputRef}
        />
      </Grid>

      <Grid item>
        <InputStatusIcon {...input} />
      </Grid>

      <Grid item>
        <EntryControlSet
          {...outputProps}
          otherEntry={inputProps.entry}
          ref={outputRef}
        />
      </Grid>
    </Grid>
  )
}

EntryControls.propTypes = {
  group: groupShape.isRequired,
  changeStatus: PropTypes.func.isRequired,
  changeChannel: PropTypes.func.isRequired,
  changeValue: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mappings: mappingsShape.isRequired,
  okButtonRef: PropTypes.object.isRequired,
}

export default EntryControls
