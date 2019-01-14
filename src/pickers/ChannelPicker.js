import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { arraySequence } from '../utils'

const Items = classes => arraySequence(16).map(i => (
  <MenuItem
    key={i}
    value={i}
    classes={classes}
  >
    {i + 1}
  </MenuItem>
))

const ChannelPicker = (props) => {
  const { channel: value, onChange, classes, ...rest } = props
  const { selectMenu, menuItem, selectedMenuItem, ...otherClasses } = classes
  const menuProps = {
    MenuListProps: { classes: { root: selectMenu } },
  }

  return (
    <Select
      renderValue={val => `Channel ${val + 1}`}
      onChange={({ target }) => onChange(target.value)}
      value={value}
      MenuProps={menuProps}
      classes={{ ...otherClasses }}
      {...rest}
    >
      {Items({ root: menuItem, selected: selectedMenuItem })}
    </Select>
  )
}

ChannelPicker.propTypes = {
  channel: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default ChannelPicker
