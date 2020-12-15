// import PropTypes from 'prop-types'
// import withStyles from '@material-ui/core/styles/withStyles'
// import { ChannelPicker as ZDSPicker } from 'zds-pickers'

// const styles = theme => ({
//   selectMenu: {
//     display: 'flex',
//     flexFlow: 'row wrap',
//     maxWidth: 150,
//     justifyContent: 'center',
//   },
//   menuItem: {
//     padding: 0,
//     maxWidth: 35,
//     minWidth: 35,
//     justifyContent: 'center',
//   },
//   selectedMenuItem: {
//     // color: theme.palette.getContrastText(theme.palette.text.primary),
//     color: theme.palette.text.primary,
//     backgroundColor: theme.palette.primary[500],
//   },
//   selectRoot: {},
//   selectRootDisabled: {
//     borderColor: theme.palette.grey[400],
//     backgroundColor: theme.palette.grey[400],
//     boxShadow: 'none',
//   },
// })

// const ChannelPicker = ({ classes, disabled, value, ...rest }) => {
//   const { selectRoot, selectRootDisabled, ...otherClasses } = classes
//   return (
//     <ZDSPicker
//       classes={{
//         ...otherClasses,
//         root: disabled ? selectRootDisabled : selectRoot,
//       }}
//       disableUnderline
//       {...rest}
//     />
//   )
// }

// ChannelPicker.propTypes = {
//   classes: PropTypes.object.isRequired,
//   disabled: PropTypes.bool,
//   value: PropTypes.number,
// }
// ChannelPicker.defaultProps = {
//   disabled: false,
//   value: null,
// }

// export default withStyles(styles)(ChannelPicker)
