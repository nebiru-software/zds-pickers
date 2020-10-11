import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { padding } from 'polished'
import UserInfo from '../user/UserInfo'
import MainMenu from '../MainMenu'
import Logo from '../../images/shifter.svg'
import EditEntryDlg from '../entries/EditEntryDlg'
import ErrorDialog from '../ErrorDialog'
import Documentation from '../Documentation'
import ShiftGroups from './ShiftGroups'
import InputControls from './InputControls'

const heightHeader = 77

const useStyles = makeStyles(({ palette }) => ({
  mainContent: {
    ...padding(0, 4),
    margin: 0,
  },
  topBar: {
    boxSizing: 'border-box',
    height: heightHeader,
    ...padding(10, 16, 10),
    margin: 0,
    backgroundColor: palette.background.paperSecondary,
    color: palette.text.primary,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& section': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
    },

    '& svg': {
      fill: palette.text.secondary, // $color-text-dimmer;
    },
  },
}), { name: 'PrimaryNav' })

const PrimaryNav = () => {
  const classes = useStyles()
  return (
    <div>
      <div className={classes.topBar}>
        <Logo />
        <section>
          <UserInfo />
          <Documentation />
          <MainMenu />
        </section>
      </div>

      <section className={classes.mainContent}>
        <InputControls />
        <ShiftGroups />
        <EditEntryDlg />
        <ErrorDialog />
      </section>
    </div>
  )
}

export default PrimaryNav
