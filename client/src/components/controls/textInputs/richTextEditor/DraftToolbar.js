/* istanbul ignore file */
import makeStyles from '@material-ui/core/styles/makeStyles'
// import FormatBold from '@material-ui/icons/FormatBold'
// import FormatItalic from '@material-ui/icons/FormatItalic'
// import FormatUnderlined from '@material-ui/icons/FormatUnderlined'
// import FormatStrikethrough from '@material-ui/icons/FormatStrikethrough'
// import DraftToolButton from './DraftToolButton'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    background: palette.common.lightGrey,
    borderColor: palette.common.lightGrey,
    borderBottomColor: palette.borderLight,
  },
}), { name: 'DraftToolbar' })

const DraftToolbar = (/* { toggleInlineStyle } */) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {/* <DraftToolButton onClick={toggleInlineStyle('BOLD')}>
        <FormatBold />
      </DraftToolButton>
      <DraftToolButton onClick={toggleInlineStyle('ITALIC')}>
        <FormatItalic />
      </DraftToolButton>
      <DraftToolButton onClick={toggleInlineStyle('UNDERLINE')}>
        <FormatUnderlined />
      </DraftToolButton>
      <DraftToolButton onClick={toggleInlineStyle('STRIKETHROUGH')}>
        <FormatStrikethrough />
      </DraftToolButton> */}
    </div>
  )
}

DraftToolbar.propTypes = {
  // toggleInlineStyle: PropTypes.func.isRequired,
}

export default DraftToolbar
