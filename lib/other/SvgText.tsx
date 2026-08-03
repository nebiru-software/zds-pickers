import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const MEASUREMENT_ELEMENT_ID = '__react_svg_text_measurement_id'

/**
 * The only computed properties that affect measured text geometry. Copying
 * the full computed style (~300 properties) onto the measurement node per
 * instance forced a style flush that dominated initial render in hosts
 * with many SvgText instances.
 */
const FONT_PROPERTIES = [
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-size',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'letter-spacing',
  'text-transform',
  'word-spacing',
] as const

const fontSignature = (style: CSSStyleDeclaration): string =>
  FONT_PROPERTIES.map(key => style.getPropertyValue(key)).join('|')

type FontMetrics = {
  widths: Map<string, number>
  spaceWidth: number
  lineHeight: number
}

/**
 * Word widths only depend on the word and the font it renders in, so they
 * are cached module-wide by font signature. Text that repeats across
 * instances (labels, numbers) measures once per font, ever.
 */
const fontMetricsCache = new Map<string, FontMetrics>()

const __resetFontMetricsCacheForTests = (): void => {
  fontMetricsCache.clear()
}

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
    const signature = fontSignature(style)
    let metrics = fontMetricsCache.get(signature)

    const wordArray = [...new Set(String(text).split(/\s+/))]
    const knownWidths = metrics?.widths
    const missingWords = knownWidths
      ? wordArray.filter(word => !knownWidths.has(word))
      : wordArray

    if (!metrics || missingWords.length) {
      for (const key of FONT_PROPERTIES) {
        textNode.style.setProperty(
          key,
          style.getPropertyValue(key),
          style.getPropertyPriority(key),
        )
      }

      if (!metrics) {
        textNode.textContent = '\u00A0'
        const spaceWidth =
          (textNode as SVGTextContentElement)?.getComputedTextLength?.() || 8
        const lineHeight = textNode.getBBox().height
        metrics = { widths: new Map(), spaceWidth, lineHeight }
        fontMetricsCache.set(signature, metrics)
      }

      for (const word of missingWords) {
        textNode.textContent = word
        metrics.widths.set(word, textNode.getBBox().width)
      }

      textNode.setAttribute('style', '')
    }

    const wordsWithComputedWidth: Record<string, number> = {}
    for (const word of wordArray) {
      wordsWithComputedWidth[word] = metrics.widths.get(word) ?? 0
    }

    return {
      wordsWithComputedWidth,
      spaceWidth: metrics.spaceWidth,
      lineHeight: metrics.lineHeight,
    }
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
  const measureRef = useRef<SVGGraphicsElement | HTMLElement>({} as HTMLElement)

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
      svg.setAttribute('aria-hidden', 'true')
      // Rendered but invisible: getBBox returns zeros under display:none,
      // so park it offscreen instead. Being outside any host SVG also
      // keeps per-word getBBox from forcing layout of live content.
      svg.style.position = 'fixed'
      svg.style.left = '-9999px'
      svg.style.top = '0'
      const textEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text',
      )
      svg.appendChild(textEl)
      document.body.appendChild(svg)
      // Measure against the <text> child — pointing at the <svg> container
      // made every measurement return the svg's own box.
      measureRef.current = textEl
      // Deliberately no cleanup: the element is a shared singleton and
      // other mounted instances may still hold it as their measure target.
      return
    }
    // Hosts may provide either the <text> itself or a container around one.
    measureRef.current =
      el.tagName.toLowerCase() === 'text'
        ? el
        : ((el.querySelector('text') ?? el) as HTMLElement)
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

export {
  __resetFontMetricsCacheForTests,
  calculateWordsByLines,
  calculateWordWidths,
  MEASUREMENT_ELEMENT_ID,
  SvgText,
}

export type { TextProps, WordWidths, WordsByLine }
