import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { actions as shifterActions } from '../../../reducers/shifter'
import { actions as hardwareTestActions } from '../../../reducers/hardwareTest'
import { shifterShape } from '../../../core/shapes'
import Dialog from '../../Dialog'
import Interface from './Interface'
import ActionButtons from './ActionButtons'

const style = { minHeight: 200, minWidth: 450, maxWidth: 450 }

export class HardwareTest extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

  handleKeyDown = (event) => {
    const { ctrlKey, key, metaKey } = event
    const { showHardwareTestDialog } = this.props

    // Press CTRL+CMD+T to bring up interface
    if (key === 't' && ctrlKey && metaKey) {
      event.preventDefault()
      event.stopImmediatePropagation()
      showHardwareTestDialog()
    }
  }

  handleClose = () => {
    const { hideHardwareTestDialog } = this.props
    hideHardwareTestDialog()
  }

  render() {
    const { classes, shifter, ...rest } = this.props
    const { hardwareTestVisible, testInterfaceFound } = shifter
    return (
      <Dialog
        maxWidth="sm"
        onClose={this.handleClose}
        open={hardwareTestVisible}
        style={{ zIndex: 10000 }}
      >
        <DialogTitle>Test Interface</DialogTitle>

        {testInterfaceFound ? (
          <>
            <DialogContent style={style}>
              <Interface {...rest} />
            </DialogContent>
            <ActionButtons {...rest} />
          </>
        ) : (
          <DialogContent style={style}>
            <DialogContentText>Attach the M-Audio USB adaptor to continue...</DialogContentText>
          </DialogContent>
        )}
      </Dialog>
    )
  }
}

export const mapStateToProps = ({ shifter, hardwareTest }) => ({ shifter, hardwareTest })
export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ...shifterActions,
    ...hardwareTestActions,
  },
  dispatch,
)

HardwareTest.propTypes = {
  shifter: shifterShape.isRequired,
  showHardwareTestDialog: PropTypes.func.isRequired,
  hideHardwareTestDialog: PropTypes.func.isRequired,
  classes: PropTypes.object,
}

HardwareTest.defaultProps = {
  classes: null,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HardwareTest)
