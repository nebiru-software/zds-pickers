import { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import { assertRange } from '../utils'

const Knob = (props) => {
  const {
    disabled,
    max,
    min,
    onChange,
    size,
    value: initialValue,
    wheelSensitivity,
    ...rest
  } = props
  const ref = useRef()
  const [value, setValue] = useStateWithDynamicDefault(initialValue)
  const degree = useMemo(() => Math.round((value / max) * 270), [max, value])

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

  const handleKeyPress = (event) => {
    const { key } = event
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      event.target.select()
    }
  }

  return (
    <div
      className="Knob"
      style={{ width: size, height: size }}
    >
      <div className="Knob-label">
        <input
          className="Knob-value"
          onChange={evt => handleChange(evt.target.value)}
          onFocus={({ target }) => target.select()}
          onKeyPress={disabled ? null : handleKeyPress}
          onWheel={handleWheel}
          type="number"
          {...{ disabled, max, min, ref, value, ...rest }}
        />
      </div>
      <div
        className="Knob-spinner"
        style={{ transform: `rotate(${-45 + degree}deg)` }}
      />
    </div>
  )
}

Knob.propTypes = {
  disabled: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.number,
  value: PropTypes.number,
  wheelSensitivity: PropTypes.number,
}
Knob.defaultProps = {
  disabled: false,
  max: 127,
  min: 0,
  onChange: undefined,
  size: 100,
  value: 0,
  wheelSensitivity: 0.1,
}

export default Knob
