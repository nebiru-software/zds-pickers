import React, { Component } from 'react'
import { connect } from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { shifterShape } from '../../core/shapes'
import Dialog from '../Dialog'

export class MidiSecurity extends Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { shifter } = this.props
    // Give web midi a chance to start up before assuming no access given.
    setTimeout(
      /* istanbul ignore next */ () => {
        this.setState({ active: !shifter.accessGranted })
      },
      2000,
    )
  }

  render() {
    const { shifter } = this.props
    const { active } = this.state

    return (
      <Dialog open={Boolean(active) && !shifter.accessGranted}>
        <DialogTitle>Your Permission Is Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This application requires special permissions before it can use SysEx and connect to your ZDS Shifter.
          </DialogContentText>

          <DialogContentText>
            <br />
          </DialogContentText>

          <DialogContentText>Please select &apos;Allow&apos; when prompted by your browser.</DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
}

MidiSecurity.propTypes = {
  shifter: shifterShape.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })

export default connect(mapStateToProps)(MidiSecurity)
