import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '@material-ui/core/Button'
import ReactModal from 'react-modal'
import EntryControls from '../controls/EntryControls'
import { actions as shiftGroupActions } from '../../reducers/shiftGroups'
import { actions as shiftEntryActions } from '../../reducers/shiftEntry'
import { instructions } from '../../styles/entryDlg.scss'
import { groupsShape, mappingsShape } from '../../shapes'

/**
 * We ran into a huge issue with material-ui dialog here.
 * When we place components that are in our external zds-pickers library into
 * a modal, we get a stack overflow when the control is focused.
 * This seems to have something to be with there essentially being two separate
 * material-ui instances.
 * To get around this, we're using react-modal instead of the material-ui dialog.
 */

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    marginTop: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    width: 500,
    height: 400,
    maxHeight: 400,
    overflow: 'visible',
  },
}

const actionStyle = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  marginRight: 12,
}

export class EditEntryDlg extends Component {
  constructor(props) {
    super(props)
    this.okButtonRef = createRef()
  }

  render() {
    const {
      cancelEntryEdit,
      mappings,
      saveEntryEdit,
      shiftGroups: { selectedGroupIdx },
      shiftGroups,
    } = this.props
    const group = shiftGroups.groups[selectedGroupIdx] || {}
    const { editQueue, editing, groupId } = group

    const close = () => cancelEntryEdit(groupId)

    const submit = () => saveEntryEdit(groupId, editQueue)

    if (editing === undefined) {
      return <section />
    }
    return (
      <ReactModal
        isOpen={editing}
        onRequestClose={close}
        style={modalStyle}
      >
        <EntryControls
          group={group}
          {...this.props}
          mappings={mappings}
          okButtonRef={this.okButtonRef}
          onSubmit={submit}
        />

        <div className={instructions}>
          When Group {String.fromCharCode(65 + selectedGroupIdx)} is enabled, this rule will alter any messages that
          match the INPUT so that they take on the characteristics of the OUTPUT.
          <br />
          <br />
          If Note Stack is selected for OUTPUT, then set the stacked note # there.
        </div>

        <div style={actionStyle}>
          <Button
            onClick={close}
            tag="btnCancel"
          >
            Cancel
          </Button>
          <Button
            buttonRef={this.okButtonRef}
            color="primary"
            onClick={submit}
            tabIndex={-1}
            tag="btnApply"
            variant="contained"
          >
            Apply
          </Button>
        </div>
      </ReactModal>
    )
  }
}

EditEntryDlg.propTypes = {
  shiftGroups: groupsShape.isRequired,
  mappings: mappingsShape.isRequired,
  saveEntryEdit: PropTypes.func.isRequired,
  cancelEntryEdit: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shiftGroups, mappings }) => ({ shiftGroups, mappings })
export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ...shiftGroupActions, //
    ...shiftEntryActions,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEntryDlg)
