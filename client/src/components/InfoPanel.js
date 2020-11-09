import React from 'react'
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { stateVersion } from '../selectors'

const useStyles = makeStyles(({ constants }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 13,
    fontWeight: 100,
    height: constants.headerHeight,
    '& div': {
      padding: 10,
      '& span': {
        paddingLeft: 25,
      },
    },
  },
}), { name: 'InfoPanel' })

export const InfoPanel = () => {
  const classes = useStyles()
  const { client, firmware } = useSelector(stateVersion)
  const formatted = value => (Number.isNaN(value) ? 'N/A' : `v${(value / 10).toFixed(1)}`)
  const year = () => new Date().getFullYear()
  const foundVersion = () => formatted(firmware)

  return (
    <footer className={classes.root}>
      <div>
        &copy; Copyright <a href="https://zendrumstudio.com">Zendrum Studio</a>, {year()}
      </div>
      <div>
        <span>Client: {formatted(client)}</span>
        <span>Firmware: {foundVersion()}</span>
      </div>
    </footer>
  )
}

export default InfoPanel
