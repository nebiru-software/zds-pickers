import PropTypes from 'prop-types'
import cl from 'classnames'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { animation, darken, lighten, margin } from 'polished'

const useStyles = makeStyles(({ mixins: { borderS, size }, palette }) => ({
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    margin: 0,
    justifyContent: 'flex-start',
    textTransform: 'uppercase',
  },
  ledRoot: {
    borderRadius: '50%',
    ...margin(0, 10, 0, 8),
    ...size(15),
    ...borderS(palette.primary[100]),
    backgroundColor: darken(0.5, palette.led),
  },
  ledLit: {
    backgroundColor: palette.led,
    ...animation(['pulsate', '2s', 'ease-in-out', 'infinite', 'alternate']),
    animationName: '$pulsate',
  },
  '@keyframes pulsate': {
    '0%': {
      boxShadow: `rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, ${lighten(0.2, palette.led)} 0 2px 12px 2px`,
    },
    '100%': {
      boxShadow: `${palette.led} 0 2px 12px 2px`,
    },
  },
}), { name: 'Led' })

const Led = ({ label, lit }) => {
  const classes = useStyles()

  const className = cl({
    [classes.ledRoot]: true,
    [classes.ledLit]: lit,
  })
  return (
    <figure className={classes.root}>
      <div className={className} />
      <header>{label}</header>
    </figure>
  )
}

Led.propTypes = {
  label: PropTypes.string.isRequired,
  lit: PropTypes.bool.isRequired,
}

export default Led
