/* eslint-disable react/no-unescaped-entities */
import { hardwareTestShape } from '../../../core/shapes'

const SendEntries = ({ hardwareTest: { creatingRules } }) => creatingRules ? (
  <h3>Setting up test entries...</h3>
) : (
  <>
    <h3>Entries created.</h3>
    <h4>Both LEDS should now be lit.</h4>
    <h4>Click 'Next' to test out the shift rules...</h4>
  </>
)

SendEntries.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
}

export default SendEntries
