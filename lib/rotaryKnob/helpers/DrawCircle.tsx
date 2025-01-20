import React from 'react'

/**
 * Draws a circle with radius = r
 * position must be handled by parent
 */

type DrawCircleProps = React.SVGProps<SVGCircleElement> & {
  r: number
  borderColor?: string
  fillColor?: string
  borderWidth?: number
  fillOpacity: number
  cx: number
  cy: number
}

class DrawCircle extends React.Component<DrawCircleProps> {
  render() {
    const {
      r,
      borderColor = 'black',
      fillColor = 'transparent',
      borderWidth = 2,
      fillOpacity = 1,
      ...rest
    } = this.props

    return (
      <circle
        stroke={borderColor}
        fill={fillColor}
        fillOpacity={fillOpacity}
        r={r}
        {...rest}
      />
    )
  }
}

export default DrawCircle
