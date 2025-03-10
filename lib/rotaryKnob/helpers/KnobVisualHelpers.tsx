import React from 'react'
import type { Point } from '../Types'
import { toRadians } from '../utils'
import { DrawCircle } from './DrawCircle'
import { DrawLine } from './DrawLine'
import { HelpersOverlay } from './HelpersOverlay'

/** Precision visual helpers */

/**
 * Precision mode visual helpers
 */
type KnobVisualHelpersProps = {
  svgRef?: SVGSVGElement
  radius: number
  minimumDragDistance: number
  valueAngle: number
  mousePos: Point
}

type KnobVisualHelpersState = {
  centerX: number
  centerY: number
  valueMarkerX: number
  valueMarkerY: number
}

class KnobVisualHelpers extends React.Component<
  KnobVisualHelpersProps,
  KnobVisualHelpersState
> {
  state = {
    centerX: 0,
    centerY: 0,
    valueMarkerX: 0,
    valueMarkerY: 0,
  }

  static getDerivedStateFromProps(
    props: KnobVisualHelpersProps,
    state: KnobVisualHelpersState,
  ) {
    //Calculate position
    if (!props.svgRef) return state

    const vbox = props.svgRef.getBoundingClientRect()
    const halfWidth = vbox.width / 2

    //Calculate current angle segment end point
    //Note: Not sure why we need to subtract 90 here
    const valueMarkerX =
      props.radius * Math.cos(toRadians(props.valueAngle - 90))
    const valueMarkerY =
      props.radius * Math.sin(toRadians(props.valueAngle - 90))

    return {
      ...state,
      centerX: vbox.left + halfWidth,
      centerY: vbox.top + halfWidth,
      valueMarkerX,
      valueMarkerY,
    }
  }

  render() {
    const markCircleColor =
      this.props.minimumDragDistance <= this.props.radius ? 'green' : 'grey'
    const fillColor =
      this.props.minimumDragDistance <= this.props.radius
        ? '#88E22D'
        : '#D8D8D8'
    const minDistanceCueVisible =
      this.props.minimumDragDistance >= this.props.radius

    return (
      <HelpersOverlay>
        <svg
          style={{ position: 'absolute', top: '0', left: '0' }}
          width="100%"
          height="100%">
          <defs>
            <marker
              id="Triangle"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {/* Current drag distance */}
          <DrawCircle
            borderColor={markCircleColor}
            fillColor={fillColor}
            fillOpacity={0.02}
            r={this.props.radius}
            cx={this.state.centerX}
            cy={this.state.centerY}
          />
          {/* Minimum drag distance marker */}
          {minDistanceCueVisible && (
            <DrawCircle
              borderColor={markCircleColor}
              fillColor={fillColor}
              fillOpacity={0}
              r={this.props.minimumDragDistance}
              cx={this.state.centerX}
              cy={this.state.centerY}
              //strokeDasharray="5, 5"
            />
          )}

          {/* Line to mouse position */}
          {/* <DrawLine
            p1={{ x: this.state.centerX, y: this.state.centerY }}
            p2={{ x: this.props.mousePos.x, y: this.props.mousePos.y }}
            opacity={0.4}
            strokeDasharray="5, 5"
          /> */}
          {/* Line to current value */}
          <DrawLine
            p1={{ x: this.state.centerX, y: this.state.centerY }}
            p2={{
              x: this.state.valueMarkerX + this.state.centerX,
              y: this.state.valueMarkerY + this.state.centerY,
            }}
            markerEnd="url(#Triangle)"
          />
        </svg>
      </HelpersOverlay>
    )
  }
}

export { KnobVisualHelpers }
