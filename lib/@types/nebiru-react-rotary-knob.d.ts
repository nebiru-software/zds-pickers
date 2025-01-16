declare module 'nebiru-react-rotary-knob' {
  const Knob: React.ComponentType<{
    clampMax: number
    clampMin: number
    className: string
    disabled: boolean
    max: number
    min: number
    onChange: (value: number) => void
    onWheel?: (event: WheelEvent) => void
    preciseMode: boolean
    rotateDegrees: number
    skin: typeof import('./knobSkin10.tsx').default
    style: React.CSSProperties
    unlockDistance: number
    value: number
  }>

  export { Knob }
}
