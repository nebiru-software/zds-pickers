import React, { Fragment, createElement, useRef } from 'react'
import PropTypes from 'prop-types'
import useComponentSize from '../hooks/useComponentSize'
import SVGText from '../other/SVGText'

export const DefaultTooltip = ({ children }) => createElement(Fragment, null, children)

DefaultTooltip.propTypes = { children: PropTypes.element.isRequired }

const RESPONSE_CURVE_0 = 0
const RESPONSE_CURVE_1 = 1
const RESPONSE_CURVE_2 = 2
const RESPONSE_CURVE_3 = 3
const RESPONSE_CURVE_4 = 4
const RESPONSE_CURVE_5 = 5
const RESPONSE_CURVE_6 = 6
const RESPONSE_CURVE_7 = 7

export const RESPONSE_CURVES = [
  {
    value: RESPONSE_CURVE_7,
    label: 'Always maxed out.',
  },
  {
    value: RESPONSE_CURVE_6,
    label: 'Most sensitive.',
  },
  {
    value: RESPONSE_CURVE_5,
    label: 'Moderately sensitive.',
  },
  {
    value: RESPONSE_CURVE_4,
    label: 'A little sensitive.',
  },
  {
    value: RESPONSE_CURVE_0,
    label: 'Linear, no change.',
  },
  {
    value: RESPONSE_CURVE_1,
    label: 'A little less sensitive.',
  },
  {
    value: RESPONSE_CURVE_2,
    label: 'Even less sensitive.',
  },
  {
    value: RESPONSE_CURVE_3,
    label: 'Least sensitive.',
  },
]

// const width = 218
// const height = 150
const axisOffset = 20
const buttonSize = 15

const axisX1 = axisOffset
const axisY1 = axisOffset

const ResponseCurve = (props) => {
  const { Tooltip, autosize, disabled, inverted, onChange, value: responseCurve } = props

  const ref = useRef(null)
  const svgRef = useRef(null)
  const { height: ourHeight, width: ourWidth } = useComponentSize(ref)

  const width = autosize ? ourWidth || 218 : 218
  const height = autosize ? ourHeight || 150 : 150

  const axisX2 = width - axisOffset
  const axisY2 = height - axisOffset

  const xMid = width / 2
  const yMid = height / 2

  const svgProps = { ref: svgRef }

  const responseCurves = RESPONSE_CURVES.map(({ value, label }) => {
    let c1
    let c2
    let x1 = axisX1
    let y1 = inverted ? axisY1 : axisY2
    let x2 = axisX2
    let y2 = inverted ? axisY2 : axisY1
    let labelX = xMid
    let labelY = yMid
    switch (value) {
    case RESPONSE_CURVE_0:
      c1 = xMid
      c2 = yMid
      labelY += 3

      break
    case RESPONSE_CURVE_1:
      c1 = inverted ? xMid + width * 0.13 : xMid - width * 0.13
      c2 = yMid - height * 0.13
      labelX = inverted ? xMid + width * 0.1 : xMid - width * 0.1
      labelY = yMid - height * 0.09
      break

    case RESPONSE_CURVE_2:
      c1 = inverted ? xMid + width * 0.25 : xMid - width * 0.25
      c2 = yMid - height * 0.25
      labelX = inverted ? xMid + width * 0.2 : xMid - width * 0.2
      labelY = yMid - height * 0.17
      break

    case RESPONSE_CURVE_3:
      c1 = inverted ? xMid + width * 0.35 : xMid - width * 0.35
      c2 = yMid - height * 0.35
      labelX = inverted ? xMid + width * 0.28 : xMid - width * 0.28
      labelY = yMid - height * 0.25
      break

    case RESPONSE_CURVE_4:
      c1 = inverted ? xMid - width * 0.13 : xMid + width * 0.13
      c2 = yMid + height * 0.13
      labelX = inverted ? xMid - width * 0.1 : xMid + width * 0.1
      labelY = yMid + height * 0.1
      break

    case RESPONSE_CURVE_5:
      c1 = inverted ? xMid - width * 0.25 : xMid + width * 0.25
      c2 = yMid + height * 0.25
      labelX = inverted ? xMid - width * 0.2 : xMid + width * 0.2
      labelY = yMid + height * 0.18
      break

    case RESPONSE_CURVE_6:
      c1 = inverted ? xMid - width * 0.35 : xMid + width * 0.35
      c2 = yMid + height * 0.35
      labelX = inverted ? xMid - width * 0.28 : xMid + width * 0.28
      labelY = yMid + height * 0.25
      break

    case RESPONSE_CURVE_7:
      x1 = inverted ? axisX1 : axisX2
      y1 = axisY1
      x2 = x1
      y2 = axisY2
      c1 = x1
      c2 = yMid
      labelX = x1 - 5
      labelY = height - 30
      break

    default:
      break
    }
    return {
      value,
      label,
      c1,
      c2,
      x1,
      y1,
      x2,
      y2,
      labelX,
      labelY,
    }
  })

  return (
    <div
      className="response-curve-picker"
      ref={ref}
    >
      <svg {...svgProps}>
        <rect
          className="container"
          height={height}
          rx={3}
          ry={3}
          width={width}
          x={0}
          y={0}
        />

        <SVGText
          className="axis"
          textAnchor="middle"
          transform={`translate(${axisX1 - 14} ${height / 2}) rotate(90)`}
          x={0}
          y={0}
        >
          Applied force
        </SVGText>
        <SVGText
          className="axis"
          textAnchor="middle"
          transform={`translate(${width / 2} ${axisY2 + 13})`}
          x={0}
          y={0}
        >
          Output (velocity)
        </SVGText>

        <line
          className="axis"
          x1={axisX1}
          x2={axisX1}
          y1={axisY1}
          y2={axisY2}
        />
        <line
          className="axis"
          x1={axisX1}
          x2={axisX2}
          y1={axisY2}
          y2={axisY2}
        />

        {responseCurves.map(({ value, label, x1, y1, x2, y2, c1, c2, labelX, labelY }) => (
          <g key={value}>
            <path
              className={value === responseCurve ? 'curve-selected' : 'curve'}
              d={`M${x1} ${y1} C ${c1} ${c2}, ${c1} ${c2}, ${x2} ${y2}`}
            />

            <Tooltip
              placement="left"
              title={label}
            >
              <rect
                className={value === responseCurve ? 'button-selected' : 'button'}
                height={buttonSize}
                onClick={disabled ? null : () => onChange({ target: { value } })}
                transform={`translate(${labelX + 3} ${labelY - buttonSize / 1.05}) rotate(45)`}
                width={buttonSize}
              />
            </Tooltip>

            <text
              className={value === responseCurve ? 'button-selected' : 'button'}
              transform={`translate(${labelX} ${labelY})`}
            >
              {value}
              <title>{label}</title>
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

ResponseCurve.propTypes = {
  autosize: PropTypes.bool,
  disabled: PropTypes.bool,
  inverted: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  Tooltip: PropTypes.elementType,
  value: PropTypes.number.isRequired,
}

ResponseCurve.defaultProps = {
  autosize: false,
  disabled: false,
  inverted: false,
  Tooltip: DefaultTooltip,
}

export default ResponseCurve
