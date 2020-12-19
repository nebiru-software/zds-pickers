import { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { border, padding } from 'polished'
import Tab from '@material-ui/core/Tab'
import Grid from '@material-ui/core/Grid'
import UserInfo from 'components/user/UserInfo'
import MainMenu from 'components/MainMenu'
import Logo from 'images/shifter.svg'
import EditEntryDlg from 'components/entries/EditEntryDlg'
import ErrorDialog from 'components/ErrorDialog'
import Documentation from 'components/Documentation'
import InfoPanel from 'components/InfoPanel'
import VerticalTabs from 'components/tabs/VerticalTabs'
import ShiftGroups from './ShiftGroups'
import InputControls from './InputControls'

const useStyles = makeStyles(({ constants, mixins: { important }, palette }) => ({
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
  },

  sidebar: {
    ...border('right', 1, 'solid', palette.grey[300]),
  },

  viewport: {
    backgroundColor: palette.greyed,
    height: important(`calc(100vh - ${constants.headerHeight}px)`),
    overflowY: 'auto',
  },
}), { name: 'PrimaryNav' })

const AvailableTabs = [
  <InputControls />,
  <ShiftGroups />,
  <InputControls />,
  <ShiftGroups />,
]

const PrimaryNav = () => {
  const classes = useStyles()
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)

  const selectedTab = AvailableTabs[selectedTabIdx]

  return (
    <>
      <div className={classes.topBar}>
        <Logo width={350} />
        <section>
          <UserInfo />
          <Documentation />
          <MainMenu />
        </section>
      </div>

      <Grid container>
        <Grid
          className={classes.sidebar}
          item
          xs={2}
        >
          <VerticalTabs
            onChange={(_, newIdx) => setSelectedTabIdx(newIdx)}
            orientation="vertical"
            value={selectedTabIdx}
            // variant="scrollable"
          >
            <Tab label="CC Buttons" />
            <Tab label="CC Jacks" />
            <Tab label="Trigger Jacks" />
            <Tab label="Shift Groups" />
          </VerticalTabs>

          <InfoPanel />
        </Grid>

        <Grid
          item
          xs={10}
        >
          <div className={classes.viewport}>
            {selectedTab}
          </div>
        </Grid>

      </Grid>

      <EditEntryDlg />
      <ErrorDialog />
    </>
  )
}

export default PrimaryNav
