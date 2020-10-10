import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { hardwareTestShape } from '../../../core/shapes'
import { once } from '../../../core/fp/utils'

class Done extends Component {
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

Done.propTypes = {
  hardwareTest: hardwareTestShape.isRequired,
  hideHardwareTestDialog: PropTypes.func.isRequired,
}

export default Done
