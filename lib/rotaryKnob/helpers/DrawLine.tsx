import React from 'react'
import type { Point } from '../Types'

/**
 * Draws a line from p1 to p2
 */

type DrawLineProps = React.SVGProps<SVGLineElement> & {
  width?: number
  color?: string
  p1: Point
  p2: Point
}

class DrawLine extends React.Component<DrawLineProps> {
  render() {
    const { width = 2, color = 'black', p1, p2, ...rest } = this.props
    return (
      <line
        {...rest}
        stroke={color}
        strokeWidth={width}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
      />
    )
  }
}

export { DrawLine }
