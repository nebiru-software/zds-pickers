import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, padding } from 'polished'
import UserInfo from 'components/user/UserInfo'
import MainMenu from 'components/MainMenu'
import Logo from 'images/shifter.svg'
import EditEntryDlg from 'components/entries/EditEntryDlg'
import ErrorDialog from 'components/ErrorDialog'
import Documentation from 'components/Documentation'
import ShiftGroups from './ShiftGroups'
import InputControls from './InputControls'

const useStyles = makeStyles(({ constants, palette }) => ({
  mainContent: {
    ...padding(0, 4),
    margin: 0,
  },
  topBar: {
    boxSizing: 'border-box',
    height: constants.headerHeight,
    ...padding(10, 16, 10),
    margin: 0,
    backgroundColor: palette.common.white,
    color: palette.text.primary,
    ...border('bottom', 1, 'solid', palette.grey[300]),

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
