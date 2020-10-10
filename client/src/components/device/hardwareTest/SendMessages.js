/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { hardwareTestShape } from '../../../core/shapes'

const SendMessages = ({ hardwareTest: { sendingMessages, passed } }) => sendingMessages ? (
  <>
    <h3>Sending messages...</h3>
    <h4>If nothing is happening, unplug and re-insert the UNO and then try again.</h4>
  </>
) : passed ? (
  <>
    <h3 style={{ color: 'green' }}>PASSED</h3>
    <h4>Click 'Next' to clear and reset unit...</h4>
  </>
) : (
  <h3 style={{ color: 'red' }}>FAILED - check console for details</h3>
)

SendMessages.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
}

export default SendMessages
