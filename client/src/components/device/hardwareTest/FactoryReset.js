/* eslint-disable react/no-unescaped-entities */
import { hardwareTestShape } from '../../../core/shapes'

const FactoryReset = ({ hardwareTest: { performingReset } }) => performingReset ? ( //
  <h3>Performing factory reset...</h3>
) : (
  <>
    <h3>Reset Complete.</h3>
    <h4>Click 'Next' to create test shift rules...</h4>
    <h4>Both foot switches will also be enabled and the LEDs should illuminate.</h4>
  </>
)

FactoryReset.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
}

export default FactoryReset
