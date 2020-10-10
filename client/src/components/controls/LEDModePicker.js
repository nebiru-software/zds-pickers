import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import {
  ACTIVITY_LED_MODE_ALWAYS_OFF,
  ACTIVITY_LED_MODE_ALWAYS_ON,
  ACTIVITY_LED_MODE_NORMALLY_OFF,
  ACTIVITY_LED_MODE_NORMALLY_ON,
} from '../../midi/sysex'

const options = [
  { value: ACTIVITY_LED_MODE_NORMALLY_ON, label: 'Flicker on activity; Normally ON' },
  { value: ACTIVITY_LED_MODE_NORMALLY_OFF, label: 'Flicker on activity; Normally OFF' },
  { value: ACTIVITY_LED_MODE_ALWAYS_ON, label: 'Always ON' },
  { value: ACTIVITY_LED_MODE_ALWAYS_OFF, label: 'Always OFF' },
]

class LEDModePicker extends Component {
  static propTypes = {
    selectedValue: PropTypes.number.isRequired,
    setFlags: PropTypes.func.isRequired,
    serialMidiOutEnabled: PropTypes.bool.isRequired,
    usbMidiOutEnabled: PropTypes.bool.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = { children: null }

  state = {
    anchorEl: null,
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuItemClick = (value) => {
    const { serialMidiOutEnabled, setFlags, usbMidiOutEnabled } = this.props
    setFlags(value, serialMidiOutEnabled, usbMidiOutEnabled)
    this.handleClose()
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state
    const { children, selectedValue } = this.props

    return (
      <>
        <IconButton
          aria-haspopup="true"
          aria-owns={anchorEl ? 'simple-menu' : null}
          onClick={this.handleClick}
        >
          <Tooltip
            enterDelay={250}
            placement="top"
            title="LED mode"
          >
            <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
              {children}
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
          {options.map(({ value, label }, index) => (
            <MenuItem
              key={value}
              onClick={() => this.handleMenuItemClick(value)}
              selected={index === selectedValue}
              tag={`miValue${value}`}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }
}

export default LEDModePicker
