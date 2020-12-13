/* eslint-disable no-bitwise */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
// import USB from '@material-ui/icons/Usb'
// import Plus from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
// import Midi from '../images/Midi.svg'
import { actions as shifterActions } from '../reducers/shifter'
import { shifterShape } from '../core/shapes'

const options = [
  { value: 4, label: 'Enable MIDI Out on DIN', tag: 'miDinOut' },
  { value: 8, label: 'Enable MIDI Out on USB', tag: 'miUsbOut' },
  { value: 12, label: 'Enable Both DIN AND USB', tag: 'miBothOut' },
]

export class MidiMenu extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    anchorEl: null,
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuItemClick = (value) => {
    const { setFlags, shifter } = this.props
    const { midiActivityLEDMode } = shifter
    const serialMidiOutEnabled = Boolean(value & 4)
    const usbMidiOutEnabled = Boolean(value & 8)
    setFlags(midiActivityLEDMode, serialMidiOutEnabled, usbMidiOutEnabled)
    this.handleClose()
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state
    const { shifter: { ready, found, responding, serialMidiOutEnabled, usbMidiOutEnabled } } = this.props

    const isValueSelected = (value) => {
      let check = 0
      if (serialMidiOutEnabled) {
        check |= 4
      }
      if (usbMidiOutEnabled) {
        check |= 8
      }
      return value === check
    }

    const menuLabel = () => serialMidiOutEnabled && usbMidiOutEnabled ? 'Both DIN and USB' : serialMidiOutEnabled ? 'DIN Only' : 'USB Only'

    return ready ? (
      <>
        <IconButton
          aria-haspopup="true"
          aria-owns={anchorEl ? 'simple-menu' : null}
          disabled={!(found && responding)}
          onClick={this.handleClick}
        >
          <Tooltip
            enterDelay={250}
            placement="top"
            title="MIDI out mode"
          >
            <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
              {/* {serialMidiOutEnabled && <Midi width={18} />}
              {serialMidiOutEnabled && usbMidiOutEnabled && (
                <Plus style={{ width: 15, position: 'relative', left: 3 }} />
              )}
              {usbMidiOutEnabled && <USB />} */}
              TODO:
              <span style={{ padding: '5px 5px 0' }}>{menuLabel()}</span>
              <ArrowDropDown />
            </div>
          </Tooltip>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="simple-menu"
          onClose={this.handleClose}
          open={Boolean(anchorEl)}
        >
          {options.map(({ value, label, ...rest }) => (
            <MenuItem
              key={value}
              onClick={() => this.handleMenuItemClick(value)}
              selected={isValueSelected(value)}
              {...rest}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </>
    ) : null
  }
}

MidiMenu.propTypes = {
  shifter: shifterShape.isRequired,
  setFlags: PropTypes.func.isRequired,
}

export const mapStateToProps = ({ shifter }) => ({ shifter })
export const mapDispatchToProps = dispatch => bindActionCreators(shifterActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MidiMenu)
