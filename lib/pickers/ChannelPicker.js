import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import { arraySequence } from '../utils'

const styles = theme => ({
  selectMenu: {
    display: 'flex',
    flexFlow: 'row wrap',
    maxWidth: 150,
    justifyContent: 'center',
  },
  menuItem: {
    padding: 0,
    maxWidth: 35,
    minWidth: 35,
    justifyContent: 'center',
  },
  selectedMenuItem: {
    // color: theme.palette.getContrastText(theme.palette.text.primary),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary[500],
  },
})

const Items = classes =>
  arraySequence(16).map(i => (
    <MenuItem key={i} value={i} classes={classes}>
      {i + 1}
    </MenuItem>
  ))

const ChannelPicker = ({ channel: value, onChange, classes }) => {
  const menuProps = {
    MenuListProps: { classes: { root: classes.selectMenu } },
  }

  return (
    <Select
      renderValue={val => `Channel ${val + 1}`}
      onChange={({ target }) => onChange(target.value)}
      value={value}
      MenuProps={menuProps}
      disableUnderline
    >
      {Items({ root: classes.menuItem, selected: classes.selectedMenuItem })}
    </Select>
  )
}

ChannelPicker.propTypes = {
  channel: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ChannelPicker)
