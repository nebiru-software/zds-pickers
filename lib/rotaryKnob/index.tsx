/**
 * Show the rotation circle and marker
 * dispatches drag events
 */

import { type D3DragEvent, drag } from 'd3-drag'
import { type ScaleLinear, scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import type { BaseType, Selection } from 'd3-selection'
import { useEffect, useRef, useState } from 'react'
import { SvgLoader, SvgProxy } from 'react-svgmt'
import InternalInput from './InternalInput'
import type { Point } from './Types'
import { KnobVisualHelpers } from './helpers/KnobVisualHelpers'
import defaultSkin from './knobdefaultskin'
import utils from './utils'

/**
 * type definition for the skin system attribute modification element
 */
type AttributeSetValue = {
  name: string
  value: (props: unknown, value: unknown) => string
}

/**
 * Type definition for the skin element manipulation block
 */

interface UpdateElement {
  element: string
  content: (_props: React.CSSProperties, value: number) => string
  attrs: AttributeSetValue[]
}

interface Skin {
  svg: string
  knobX: number
  knobY: number
  updateAttributes: UpdateElement[]
}

type KnobProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  clampMax?: number
  clampMin?: number
  defaultValue?: number
  disabled?: boolean
  format?: (val: number) => string
  max?: number
  min?: number
  onChange?: (val: number) => void
  onEnd?: () => void
  onStart?: () => void
  preciseMode?: boolean
  rotateDegrees?: number
  skin?: Skin
  step?: number
  style: React.CSSProperties
  unlockDistance?: number
  value?: number
}

type KnobState = {
  svgRef?: SVGSVGElement
  dragging: boolean
  dragDistance: number
  mousePos: Point
  valueAngle: number
  uncontrolledValue?: number
}

// function printDebugValues(obj) {
//   console.log('------------')
//   Object.keys(obj).forEach(key => {
//     const value =
//       typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]
//     console.log(`${key}: ${value}`)
//   })
//   console.log('------------')
// }

/**
 * Generic knob component
 */
const RotaryKnob = (props: KnobProps) => {
  const {
    clampMax = 360,
    clampMin = 0,
    defaultValue = 0,
    disabled = false,
    format = (val: number) => val.toFixed(0),
    max = 100,
    min = 0,
    onChange = () => {},
    onEnd = () => {},
    onStart = () => {},
    preciseMode = true,
    rotateDegrees = 0,
    skin = defaultSkin as Skin,
    step = 1,
    style,
    unlockDistance = 100,
    value,
    ...rest
  } = props

  const [isControlled, setIsControlled] = useState(value !== undefined)

  const container = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  let scale: ScaleLinear<number, number>
  let scaleProps: {
    min: number
    max: number
    clampMin: number
    clampMax: number
  }

  const [state, setState] = useState<KnobState>({
    svgRef: undefined,
    dragging: false,
    dragDistance: 0,
    mousePos: { x: 0, y: 0 },
    valueAngle: 0,
    uncontrolledValue: 0,
  })

  // returns angles between 0 and 360 for values lower 0 or greater 360
  const normalizeAngle = (angle: number): number => {
    if (angle < 0) {
      //E.g -1 turns 359
      return angle + 360
    }
    if (angle > 360) {
      return angle - 360
    }
    return angle
  }

  // converts a value to an angle for the knob respecting the additional rotateDegrees prop
  const convertValueToAngle = (value: number): number => {
    const angle = (getScale()(value) + rotateDegrees) % 360
    return normalizeAngle(angle)
  }

  // converts an angle to a value for the knob respecting the additional rotateDegrees prop
  const convertAngleToValue = (angle: number): number => {
    const angle2 = angle - rotateDegrees
    return getScale().invert(normalizeAngle(angle2))
  }

  const getScale = () => {
    // Memoize scale so it's not recalculated every time
    if (
      !scaleProps ||
      scaleProps.min !== min ||
      scaleProps.max !== max ||
      scaleProps.clampMin !== clampMin ||
      scaleProps.clampMax !== clampMax
    ) {
      if (rotateDegrees < 270 && rotateDegrees > 90) {
        scale = scaleLinear().domain([min, max]).range([clampMin, clampMax])
      } else {
        scale = scaleLinear().domain([max, min]).range([clampMax, clampMin])
      }
      scale.clamp(true)
      scaleProps = {
        min: min,
        max: max,
        clampMin: clampMin,
        clampMax: clampMax,
      }
    }
    return scale
  }

  useEffect(() => {
    setIsControlled(value !== undefined)

    setState(prevState => ({
      ...prevState,
      uncontrolledValue: value ?? defaultValue ?? 0,
    }))

    if (container.current) {
      // Remove existing drag behavior
      select(container.current).on('.drag', null)
      // Only setup new drag if not disabled
      if (!disabled) {
        setupDragging(select(container.current))
      }
    }
  }, [value, defaultValue, disabled])

  const saveRef = (elem: SVGElement) => {
    if (!state.svgRef) {
      setState({ ...state, svgRef: elem as SVGSVGElement })
    }
  }

  const onAngleChanged = (angle: number) => {
    //Calculate domain value
    const domainValue = convertAngleToValue(angle)
    if (!isControlled) {
      /**
       * If the mode is 'uncontrolled' we need to update our local state
       */
      setState(st => {
        return { ...st, uncontrolledValue: domainValue }
      })
    }
    if (!disabled) onChange(domainValue)
  }

  /**
   * Returns the current value (depending on controlled/uncontrolled mode)
   */
  const getValue = (): number =>
    isControlled ? (value ?? 0) : (state.uncontrolledValue ?? 0)

  const setupDragging = (
    elem: Selection<HTMLDivElement, unknown, BaseType, unknown>,
  ) => {
    if (!elem?.node()) return
    const node = elem.node()
    if (!node) return

    let vbox = node.getBoundingClientRect()
    const cx = vbox.width / 2
    const cy = vbox.height / 2

    // Shared state via closure
    let startPos: Point
    let startAngle: number
    let initialAngle: number
    let monitoring = false

    function started(event: D3DragEvent<HTMLDivElement, unknown, unknown>) {
      if (!event?.sourceEvent) return
      if (!node) return

      const currentValue = getValue()

      vbox = node.getBoundingClientRect()
      elem.classed('dragging', true)
      onStart()

      startPos = { x: event.x - cx, y: event.y - cy }
      startAngle = utils.getAngleForPoint(startPos.x, startPos.y)
      initialAngle = convertValueToAngle(currentValue)
      monitoring = false

      // ...existing setState code...
    }

    function dragged(event: D3DragEvent<HTMLDivElement, unknown, unknown>) {
      const currentPos = { x: event.x - cx, y: event.y - cy }
      const distanceFromCenter = Math.sqrt(
        currentPos.x ** 2 + currentPos.y ** 2,
      )

      if (preciseMode) {
        if (!monitoring && distanceFromCenter >= unlockDistance) {
          startPos = currentPos
          startAngle = utils.getAngleForPoint(currentPos.x, currentPos.y)
          monitoring = true
        }
      } else {
        monitoring = true
      }

      const currentAngle = utils.getAngleForPoint(currentPos.x, currentPos.y)
      const deltaAngle = currentAngle - startAngle
      let finalAngle = initialAngle + deltaAngle
      finalAngle = normalizeAngle(finalAngle)

      if (monitoring) {
        onAngleChanged(finalAngle)
      }

      setState(prevState => ({
        ...prevState,
        dragDistance: distanceFromCenter,
        mousePos: {
          x: event.sourceEvent.clientX,
          y: event.sourceEvent.clientY,
        },
        valueAngle: monitoring ? finalAngle : initialAngle,
      }))
    }

    function ended() {
      elem.classed('dragging', false)
      setState(prevState => ({ ...prevState, dragging: false }))
      onEnd()
      inputRef.current?.focus()
    }

    const dragInstance = drag<HTMLDivElement, unknown>()
      .container(() => node)
      .on('start', started)
      .on('drag', dragged)
      .on('end', ended)

    elem.call(dragInstance)
  }

  const onFormControlChange = (newVal: number) => {
    if (!isControlled) {
      /**
       * If the mode is 'uncontrolled' we need to update our local state
       */
      setState(prevState => ({ ...prevState, uncontrolledValue: newVal }))
    }

    if (!disabled) onChange(newVal)
  }

  const currentValue: number = getValue()
  const angle = convertValueToAngle(currentValue)

  const styles: {
    container: React.CSSProperties
    input: React.CSSProperties
  } = {
    container: Object.assign(
      {},
      {
        width: '50px',
        height: '50px',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        cursor: 'crosshair',
      },
      style,
    ),
    input: {
      width: '50%',
      position: 'absolute',
      top: '0',
      left: '-100%',
    },
  }

  //Get custom updates defined by the skin
  //Transform the updateAttributes array into a SvgProxy array
  const updateAttrs = skin.updateAttributes
  const skinElemUpdates = updateAttrs
    ? updateAttrs.map((elemUpdate, ix: number) => {
        let elemContent: string | null = null
        if (elemUpdate.content) {
          elemContent = elemUpdate.content(props, currentValue)
        }
        const attributes: Record<string, string> = {}
        //Call value function
        //TODO: support string values
        for (const attr of elemUpdate.attrs || []) {
          attributes[attr.name] = attr.value(props, currentValue)
        }

        return (
          <SvgProxy
            key={ix}
            selector={elemUpdate.element}
            {...attributes}>
            {elemContent}
          </SvgProxy>
        )
      })
    : null

  return (
    <>
      <div
        ref={container}
        style={styles.container}
        {...rest}>
        <InternalInput
          disabled={disabled}
          inputRef={inputRef}
          style={styles.input}
          value={currentValue}
          min={min}
          max={max}
          step={step}
          onChange={onFormControlChange}
        />

        <SvgLoader
          height="100%"
          svgXML={skin.svg}
          width="100%"
          onSVGReady={saveRef}>
          <SvgProxy
            selector="#knob"
            transform={`$ORIGINAL rotate(${angle}, ${skin.knobX}, ${skin.knobY})`}
          />
          {skinElemUpdates}
        </SvgLoader>
      </div>

      {state.dragging && preciseMode && (
        <KnobVisualHelpers
          svgRef={state.svgRef}
          radius={state.dragDistance}
          mousePos={state.mousePos}
          minimumDragDistance={unlockDistance}
          valueAngle={state.valueAngle}
        />
      )}
    </>
  )
}

export default RotaryKnob
