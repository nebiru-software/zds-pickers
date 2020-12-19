import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { padding } from 'polished'
import { stateVersion } from 'selectors/index'

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  root: {
    color: palette.text.secondary,
    fontSize: rem(1.8),

    '& div': {
      ...padding(5, 10),
    },
  },

  version: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    '& b, span': { display: 'block' },
  },

  copyright: {
    fontSize: rem(1.2),
    fontWeight: 100,
    marginTop: 10,
    textAlign: 'right',
    lineHeight: 1.2,
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

      <div className={classes.version}>
        <b>Client:</b>
        <span>{formatted(client)}</span>
      </div>

      <div className={classes.version}>
        <b>Firmware:</b>
        <span>{foundVersion()}</span>
      </div>

      <div className={classes.copyright}>
        &copy; Copyright {year()}<br />
        Nebiru Software
      </div>
    </footer>
  )
}

export default InfoPanel
