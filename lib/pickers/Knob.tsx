import { useCallback } from 'react'
import useStateWithDynamicDefault from '../hooks/useStateWithDynamicDefault'
import RotaryKnob from '../rotaryKnob'
import { assertRange } from '../utils.ts'
import knobSkin10 from './knobSkin10.tsx'

type KnobProps = {
  disabled?: boolean
  max?: number
  min?: number
  onChange?: (value: number) => void
  value?: number
  wheelEnabled?: boolean
  wheelSensitivity?: number
}

const Knob = (props: KnobProps) => {
  const {
    disabled = false,
    max = 127,
    min = 0,
    onChange,
    value: initialValue = 0,
    wheelEnabled = false,
    wheelSensitivity = 0.1,
    ...rest
  } = props

  const [value, setValue] = useStateWithDynamicDefault(initialValue)

  const handleChange = (val: number) => {
    if (disabled) return

    const newValue = assertRange(Number.parseInt(String(val), 10), max, min)
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (!wheelEnabled || disabled) return

      event.preventDefault()
      const delta = -event.deltaY * wheelSensitivity
      const newValue = assertRange(value + delta, max, min)

      setValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    },
    [
      wheelEnabled,
      disabled,
      wheelSensitivity,
      value,
      max,
      min,
      onChange,
      setValue,
    ],
  )

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

export default Knob

export type { KnobProps }
