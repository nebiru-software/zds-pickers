import React, { Component } from 'react'
import PropTypes from 'prop-types'
import once from 'lodash/once'
import { hardwareTestShape } from '../../../shapes'

class Done extends Component {
  static propTypes = {
    hardwareTest: hardwareTestShape.isRequired,
    hideHardwareTestDialog: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.hide = once(props.hideHardwareTestDialog)
  }

  componentDidUpdate = () => {
    const { hardwareTest: { busy } } = this.props
    if (!busy) {
      this.hide()
    }
  }

  render() {
    return (
      <>
        <h3>Done</h3>
        <h4>This dialog will close once the reset completes.</h4>
      </>
    )
  }
}

export default Done
