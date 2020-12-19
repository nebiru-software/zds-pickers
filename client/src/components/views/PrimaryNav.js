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
    '& > div': { height: '100%' },
    marginBottom: 5,
    paddingRight: 3,
  },

  viewport: {
    backgroundColor: palette.greyed,
    height: important(`calc(100vh - ${constants.headerHeight}px)`),
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}), { name: 'PrimaryNav' })

const AvailableTabs = [
  { label: 'CC Buttons', content: <InputControls /> },
  { label: 'CC/EXP Jacks', content: <ShiftGroups /> },
  { label: 'Trigger Jacks', content: <InputControls /> },
  { label: 'Shift Groups', content: <ShiftGroups /> },
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

          <Grid
            container
            direction="column"
            justify="space-between"
          >
            <Grid item>
              <VerticalTabs
                onChange={(_, newIdx) => setSelectedTabIdx(newIdx)}
                orientation="vertical"
                value={selectedTabIdx}
                variant="scrollable"
              >
                {AvailableTabs.map(({ label }) => (
                  <Tab
                    key={`label ${label}`}
                    label={label}
                  />
                ))}
              </VerticalTabs>
            </Grid>

            <Grid item>
              <InfoPanel />
            </Grid>
          </Grid>

        </Grid>

        <Grid
          item
          xs={10}
        >
          <div className={classes.viewport}>
            {selectedTab.content}
          </div>
        </Grid>

      </Grid>

      <EditEntryDlg />
      <ErrorDialog />
    </>
  )
}

export default PrimaryNav
