import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { stateVersion } from 'selectors/index'

const useStyles = makeStyles(({ mixins: { rem }, palette }) => ({
  root: {
    position: 'absolute',
    bottom: 0,
    color: palette.text.secondary,
    fontSize: rem(1.8),

    '& div': {
      padding: 10,
    },
  },

  copyright: {
    fontSize: rem(1.2),
    fontWeight: 100,
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

      <div><b>Client:</b> {formatted(client)}</div>
      <div><b>Firmware:</b> {foundVersion()}</div>

      <div className={classes.copyright}>
        &copy; Copyright {year()}<br />
        Zendrum Studio
      </div>
    </footer>
  )
}

export default InfoPanel
