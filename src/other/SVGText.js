// Adapted from https://github.com/techniq/react-svg-text

/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import reduceCSSCalc from 'reduce-css-calc'
import getStringWidth from './getStringWidth'

const calculateWordWidths = ({ children, style }) => {
  try {
    const words = children ? children.toString().split(/\s+/) : []
    const wordsWithComputedWidth = words.map(word => (
      { word, width: getStringWidth(word, style) }
    ))

    const spaceWidth = getStringWidth('\u00A0', style)

    return { wordsWithComputedWidth, spaceWidth }
  } catch (e) {
    return null
  }
}

const Text = (props) => {
  const [wordsByLines, setWordsByLines] = useState([])
  const [spaceWidth, setSpaceWidth] = useState(0)
  const [wordsWithComputedWidth, setWordsWithComputedWidth] = useState([])

  const {
    angle,
    capHeight,
    children,
    dx,
    dy,
    lineHeight,
    scaleToFit,
    style,
    textAnchor,
    verticalAnchor,
    width,
    ...textProps
  } = props

  const x = textProps.x + dx
  const y = textProps.y + dy

  useEffect(() => {
    const updateWordsWithoutCalculate = () => {
      const words = children ? children.toString().split(/\s+/) : []
      setWordsByLines([{ words }])
    }

    const calculateWordsByLines = (
      www,
      sw,
      lineWidth,
    ) => www.reduce((result, { word, width: w }) => {
      const currentLine = result[result.length - 1]

      if (currentLine && (lineWidth == null || scaleToFit
          || (currentLine.width + w + sw) < lineWidth)) {
        // Word can be added to an existing line
        currentLine.words.push(word)
        currentLine.width += w + sw
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
        const newLine = { words: [word], width: w }
        result.push(newLine)
      }

      return result
    }, [])

    const updateWordsByLines = () => {
    // Only perform calculations if using features that require them (multiline, scaleToFit)
      if ((width || scaleToFit)) {
        const wordWidths = calculateWordWidths({ children, style })

        if (wordWidths) {
          const { spaceWidth: sw, wordsWithComputedWidth: www } = wordWidths
          setSpaceWidth(sw)
          setWordsWithComputedWidth(www)
        } else {
          updateWordsWithoutCalculate()

          return
        }

        const newWordsByLines = calculateWordsByLines(
          wordsWithComputedWidth,
          spaceWidth,
          width,
        )

        setWordsByLines(newWordsByLines)
      } else {
        updateWordsWithoutCalculate()
      }
    }

    updateWordsByLines(true)
  }, [children, scaleToFit, spaceWidth, style, width, wordsWithComputedWidth])

  let startDy
  switch (verticalAnchor) {
  case 'start':
    startDy = reduceCSSCalc(`calc(${capHeight})`)
    break
  case 'middle':
    startDy = reduceCSSCalc(`calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`)
    break
  default:
    startDy = reduceCSSCalc(`calc(${wordsByLines.length - 1} * -${lineHeight})`)
    break
  }

  const transforms = []
  if (scaleToFit && wordsByLines.length) {
    const lineWidth = wordsByLines[0].width
    const sx = width / lineWidth
    const sy = sx
    const originX = x - sx * x
    const originY = y - sy * y
    transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`)
  }
  if (angle) {
    transforms.push(`rotate(${angle}, ${x}, ${y})`)
  }
  if (transforms.length) {
    textProps.transform = transforms.join(' ')
  }

  return (
    <text
      textAnchor={textAnchor}
      x={x}
      y={y}
      {...textProps}
    >
      {
        wordsByLines.map((line, index) => (
          <tspan
            dy={index === 0 ? startDy : lineHeight}
            key={index}
            x={x}
          >
            {line.words.join(' ')}
          </tspan>
        ))
      }
    </text>
  )
}

Text.propTypes = {
  angle: PropTypes.number,
  capHeight: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  dx: PropTypes.number,
  dy: PropTypes.number,
  lineHeight: PropTypes.string,
  scaleToFit: PropTypes.bool,
  style: PropTypes.object,
  textAnchor: PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
  verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
}

Text.defaultProps = {
  angle: undefined,
  capHeight: '0.71em', // Magic number from d3
  children: undefined,
  dx: 0,
  dy: 0,
  lineHeight: '1em',
  scaleToFit: false,
  style: undefined,
  textAnchor: 'start',
  verticalAnchor: 'end', // default SVG behavior
  width: undefined,
  x: 0,
  y: 0,
}

export default Text
