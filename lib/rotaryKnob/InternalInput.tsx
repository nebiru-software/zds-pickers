import React from 'react'

type InternalInputProps = {
  disabled?: boolean
  min: number
  max: number
  value: number
  step?: number
  inputRef: React.RefObject<HTMLInputElement>
  onChange: (val: number) => void
  style?: React.CSSProperties
}

class InternalInput extends React.Component<InternalInputProps> {
  static defaultProps = {
    step: 1,
  }
  render() {
    const props = this.props
    const hideStyle = {}

    function onValChange(event: React.ChangeEvent<HTMLInputElement>) {
      props.onChange(Number(event.target.value))
    }

    const { value, min, max, step, onChange, inputRef, ...rest } = props
    return (
      <input
        ref={inputRef}
        value={value}
        step={step}
        onChange={onValChange}
        style={hideStyle}
        type="range"
        min={min}
        max={max}
        {...rest}
      />
    )
  }
}

export default InternalInput
