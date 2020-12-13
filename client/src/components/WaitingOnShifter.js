import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  root: {
    fontSize: '2rem',
    width: '100%',
    textAlign: 'center',
    paddingTop: 30,
  },
}

const WaitingOnShifter = ({ classes }) => <div className={classes.root}>Shifter is busy...</div>

WaitingOnShifter.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(WaitingOnShifter)
