import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const MEASUREMENT_ELEMENT_ID = '__react_svg_text_measurement_id'

type WordsByLine = {
  words: string[]
  width: number
  showLine: boolean
}

const calculateWordsByLines = (
  text: string,
  wordWidths: WordWidths,
  maxWidth: number,
  maxHeight: number,
) => {
  const { lineHeight, spaceWidth, wordsWithComputedWidth } = wordWidths

  return text.split(/\s+/).reduce((result: WordsByLine[], word) => {
    const wordWidth = wordsWithComputedWidth[word]
    const currentLine = result[result.length - 1]
    if (currentLine && currentLine.width + wordWidth + spaceWidth < maxWidth) {
      // Word can be added to an existing line
      currentLine.words.push(word)
      currentLine.width += wordWidth + spaceWidth
    } else {
      // Add first word to line or word is too long to scaleToFit on existing line
      const newLine: WordsByLine = {
        words: [word],
        width: wordWidth,
        showLine: maxHeight
          ? lineHeight * (result.length + 1) < maxHeight
          : true,
      }
      result.push(newLine)
    }
    return result
  }, [])
}

type WordWidths = {
  wordsWithComputedWidth: Record<string, number>
  spaceWidth: number
  lineHeight: number
}

const calculateWordWidths = (
  style?: CSSStyleDeclaration,
  textNode?: SVGGraphicsElement | null,
  text?: string,
): WordWidths | undefined => {
  if (style && textNode) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Array.from(style).forEach(key =>
      textNode.style.setProperty(
        key,
        style.getPropertyValue(key),
        style.getPropertyPriority(key),
      ),
    )
    const wordArray = [...new Set(String(text).split(/\s+/))]
    const wordsWithComputedWidth = wordArray.reduce((wordMap, word) => {
      textNode.textContent = word
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      return { ...wordMap, [word]: textNode.getBBox().width }
    }, {})

    textNode.textContent = '\u00A0'

    const spaceWidth =
      (textNode as SVGTextContentElement)?.getComputedTextLength?.() || 8
    const lineHeight = textNode.getBBox().height

    textNode.setAttribute('style', '')
    return { wordsWithComputedWidth, spaceWidth, lineHeight }
  }
  return undefined
}

type TextProps = Partial<HTMLOrSVGElement> & {
  className?: string
  dx?: number
  dy?: number
  maxHeight?: number
  maxWidth?: number
  transform?: string
  text: string
  textAnchor?: React.CSSProperties['textAnchor']
  verticalAnchor?: 'start' | 'middle' | 'end'
  x?: number
  y?: number
}

const SvgText = (props: TextProps) => {
  const {
    className = '',
    dx = 0,
    dy = 0,
    maxHeight = 1000,
    maxWidth = 1000,
    // textAnchor = 'start',
    text = '',
    verticalAnchor = 'start',
    x = 0,
    y = 0,
    transform = '',
    ...rest
  } = props
  const [wordWidths, setWordWidths] = useState<WordWidths>()
  const [textLines, setTextLines] = useState<WordsByLine[]>([])
  const [style, setComputedStyle] = useState<CSSStyleDeclaration>()
  const measureRef = useRef<SVGSVGElement | HTMLElement>({} as HTMLElement)

  const displayedLines: WordsByLine[] = useMemo(() => {
    const result = textLines.filter(({ showLine }) => showLine)
    return result.length
      ? result
      : text
          .split(/\n/)
          .map(line => ({ words: [line], width: 0, showLine: true }))
  }, [textLines, text])

  const ref: React.LegacyRef<SVGTextElement> = useCallback(
    (node: SVGTextElement | null) => {
      setComputedStyle(
        node !== null ? window.getComputedStyle(node) : undefined,
      )
    },
    [],
  )

  useEffect(() => {
    const el = document.getElementById(MEASUREMENT_ELEMENT_ID)
    if (el === null) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('id', MEASUREMENT_ELEMENT_ID)
      document.body.appendChild(svg)
      svg.appendChild(
        document.createElementNS('http://www.w3.org/2000/svg', 'text'),
      )
      measureRef.current = svg
      return () => {
        document.body.removeChild(svg)
      }
    }
    measureRef.current = el
  }, [])

  useEffect(() => {
    const wordWithWidths = calculateWordWidths(
      style,
      measureRef.current as SVGGraphicsElement | null,
      text,
    )

    setWordWidths(wordWithWidths)
  }, [text, style])

  useEffect(() => {
    if (maxWidth && wordWidths) {
      const lines = text
        .split(/\n/)
        .flatMap(line =>
          calculateWordsByLines(line, wordWidths, maxWidth, maxHeight),
        )

      setTextLines(lines)
    }
  }, [maxHeight, maxWidth, wordWidths, text])

  const startDy = useMemo(() => {
    if (wordWidths?.lineHeight) {
      switch (verticalAnchor) {
        case 'start':
          return wordWidths.lineHeight

        case 'middle':
          return -(((displayedLines.length - 1) * wordWidths.lineHeight) / 2)

        default:
          return -(displayedLines.length - 1) * wordWidths.lineHeight
      }
    }
    return 0
  }, [displayedLines.length, verticalAnchor, wordWidths?.lineHeight])

  return (
    <text
      className={className}
      ref={ref}
      dx={dx}
      dy={dy}
      x={x}
      y={y}
      // textAnchor={textAnchor}
      transform={transform}
      {...rest}>
      <>
        {displayedLines.map((line, idx) => (
          <tspan
            dx={x + dx}
            dy={idx === 0 ? startDy + dy : wordWidths?.lineHeight || 0}
            key={idx}
            x={0}>
            {line.words.join(' ')}
          </tspan>
        ))}
        {textLines.length && displayedLines.length !== textLines.length && (
          <>
            <tspan>...</tspan>
            <title>{text}</title>
          </>
        )}
      </>
    </text>
  )
}

export { SvgText, MEASUREMENT_ELEMENT_ID }

export type { TextProps, WordWidths, WordsByLine }
