import Link from '@material-ui/core/Link'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import styled from '@material-ui/core/styles/styled'

const Documentation = ({ className }) => (
  <Tooltip
    className={className}
    title="View documentation"
  >
    <Link
      href="https://s3.amazonaws.com/zds-shifter/ZDS+Shifter+-+User+Manual+v1.pdf"
      target="_blank"
    >
      <HelpIcon />
    </Link>
  </Tooltip>
)

export default styled(Documentation)(({ theme: { mixins: { size }, palette } }) => ({
  '& svg': {
    fill: palette.text.dimmer,
    ...size(34),
    marginTop: 6,
  },
}), { name: 'Documentation' })
