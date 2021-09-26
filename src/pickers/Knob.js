import PropTypes from 'prop-types'
import { Knob as RotaryKnob } from 'react-rotary-knob'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import { assertRange } from '../utils'
import knobSkin10 from './knobSkin10'

const Knob = (props) => {
  const {
    disabled,
    max,
    min,
    onChange,
    value: initialValue,
    wheelEnabled,
    wheelSensitivity,
    ...rest
  } = props

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = (val) => {
    if (disabled) return

    const newValue = assertRange(parseInt(val, 10), max, min)
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleWheel = ({ deltaY }) => {
    let change = Math.trunc(deltaY * wheelSensitivity)
    if (change === 0 && deltaY !== 0) {
      // Assure that at least a tiny change happens
      change += deltaY > 0 ? 1 : -1
    }

    handleChange(value + change)
  }

  return (
    <RotaryKnob
      clampMax={320}
      clampMin={40}
      className="zds-pickers__knob-container"
      disabled={disabled}
      onChange={handleChange}
      onWheel={wheelEnabled ? handleWheel : undefined}
      preciseMode={false}
      rotateDegrees={180}
      /**
       * To see all skins:
       * http://react-rotary-knob-skins-preview.surge.sh/
       *
       * NOTE: we've copied the one we use into this package because the skins
       * pack package does not work in Electron.
       */
      skin={knobSkin10}
      style={{ opacity: disabled ? 0.4 : 1 }}
      unlockDistance={0}
      {...{ max, min, value, ...rest }}
    />
  )
}

Knob.propTypes = {
  disabled: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  wheelEnabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.number,
  wheelSensitivity: PropTypes.number,
}
Knob.defaultProps = {
  disabled: false,
  max: 127,
  min: 0,
  onChange: undefined,
  value: 0,
  wheelEnabled: false,
  wheelSensitivity: 0.1,
}

export default Knob
