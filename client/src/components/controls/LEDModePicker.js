import React, { useState } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import { useDispatch } from 'react-redux'
import {
  ACTIVITY_LED_MODE_ALWAYS_OFF,
  ACTIVITY_LED_MODE_ALWAYS_ON,
  ACTIVITY_LED_MODE_NORMALLY_OFF,
  ACTIVITY_LED_MODE_NORMALLY_ON,
} from '../../midi/sysex'
import { actions } from '../../reducers/shifter'

const options = [
  { value: ACTIVITY_LED_MODE_NORMALLY_ON, label: 'Flicker on activity; Normally ON' },
  { value: ACTIVITY_LED_MODE_NORMALLY_OFF, label: 'Flicker on activity; Normally OFF' },
  { value: ACTIVITY_LED_MODE_ALWAYS_ON, label: 'Always ON' },
  { value: ACTIVITY_LED_MODE_ALWAYS_OFF, label: 'Always OFF' },
]

const LEDModePicker = (props) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const {
    children,
    selectedValue,
    serialMidiOutEnabled,
    usbMidiOutEnabled,
  } = props

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (value) => {
    dispatch(actions.setFlags(value, serialMidiOutEnabled, usbMidiOutEnabled))
    handleClose()
  }

  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-owns={anchorEl ? 'simple-menu' : null}
        onClick={handleClick}
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
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        {options.map(({ value, label }, index) => (
          <MenuItem
            key={value}
            onClick={() => handleMenuItemClick(value)}
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

LEDModePicker.propTypes = {
  selectedValue: PropTypes.number.isRequired,
  serialMidiOutEnabled: PropTypes.bool.isRequired,
  usbMidiOutEnabled: PropTypes.bool.isRequired,
  children: PropTypes.node,
}

LEDModePicker.defaultProps = { children: null }

export default LEDModePicker
