import { Arc, Knob as RcKnob, Pointer, Scale } from 'rc-knob'
import PropTypes from 'prop-types'

const Knob = ({ size }) => {
  const scaleSize = 10
  const margin = 2
  const backKnobSize = size - (scaleSize + margin) * 2
  const knobSize = 0.686 * backKnobSize
  const ptWidth = (7.2 / 100) * backKnobSize

  return (
    <RcKnob
      angleOffset={220}
      angleRange={280}
      max={100}
      min={0}
      onChange={value => console.log(value)}
      size={size}
    >
      <defs>
        <radialGradient
          cx="1"
          cy="0.5"
          gradientTransform="scale(.5 1)"
          gradientUnits="objectBoundingBox"
          id="k2bg1"
          r="1"
        >
          <stop
            offset="0"
            stopColor="#6c6f76"
          />
          <stop
            offset="1"
            stopColor="#333535"
          />
        </radialGradient>

        <linearGradient
          gradientUnits="objectBoundingBox"
          id="k2bg2"
          x1="0.46"
          x2="0.72"
          y1="0.17"
          y2="0.92"
        >
          <stop
            offset="0"
            stopColor="#6f6c6b"
          />
          <stop
            offset="1"
            stopColor="#494848"
          />
        </linearGradient>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="k2bg2s"
          x1="0.39"
          x2="0.90"
          y1="0.19"
          y2="0.8"
        >
          <stop
            offset="0"
            stopColor="#b2adac"
          />
          <stop
            offset=".22368"
            stopColor="#63605f"
          />
          <stop
            offset="1"
            stopColor="#6d6968"
          />
        </linearGradient>

        <linearGradient
          gradientUnits="objectBoundingBox"
          id="k2pt1"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#cbc8c3"
          />
          <stop
            offset=".9127"
            stopColor="#e7e5e2"
          />
          <stop
            offset="1"
            stopColor="#ffffff"
          />
        </linearGradient>
        <linearGradient
          gradientUnits="objectBoundingBox"
          id="k2pt2"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#f3f2f1"
          />
          <stop
            offset=".036396"
            stopColor="#eeedeb"
          />
          <stop
            offset="1"
            stopColor="#cdcac4"
          />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="url(#k2bg1)"
        r={backKnobSize / 2}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="url(#k2bg2)"
        r={knobSize / 2}
        stroke="url(#k2bg2s)"
        strokeWidth="2"
      />
      <Scale
        color="#505050"
        radius={size / 2}
        steps={8}
        tickHeight={scaleSize}
        tickWidth={4}
      />
      <Pointer
        height={0}
        radius={0}
        useRotation
        width={0}
      >
        <g>
          <rect
            fill="url(#k2pt1)"
            height={backKnobSize / 2 - knobSize / 2}
            width={ptWidth}
            x={-ptWidth / 2}
            y={-backKnobSize / 2}
          />
          <rect
            fill="url(#k2pt2)"
            height={ptWidth / 2 + knobSize / 2}
            width={ptWidth}
            x={-ptWidth / 2}
            y={-knobSize / 2}
          />
        </g>
      </Pointer>
    </RcKnob>
  )
}

Knob.propTypes = {
  size: PropTypes.number,
}
Knob.defaultProps = {
  size: 50,
}

export default Knob
