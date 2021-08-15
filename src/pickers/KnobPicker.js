import PropTypes from 'prop-types'
import Knob from './Knob'

const KnobPicker = (props) => {
  const { label, shrinkLabel, ...rest } = props
  return shrinkLabel
    ? (
      <div className="zds-pickers__container">
        <div>
          <Knob {...rest} />
        </div>
      </div>
    )
    : (
      <div className="zds-pickers__container">
        {Boolean(label) && <span className="zds-pickers__label">{label}</span>}
        <div>
          <Knob {...rest} />
        </div>
      </div>
    )
}

KnobPicker.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  shrinkLabel: PropTypes.bool,
  size: PropTypes.number,
  value: PropTypes.number,
  wheelSensitivity: PropTypes.number,
}

KnobPicker.defaultProps = {
  disabled: false,
  label: undefined,
  max: 127,
  min: 0,
  onChange: undefined,
  shrinkLabel: false,
  size: 100,
  value: 0,
  wheelSensitivity: 0.1,
}

export default KnobPicker
