declare module 'react-svgmt' {
  import React from 'react'

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
    render(): React.JSX.Element
  }

  type InternalInputProps = {
    min: number
    max: number
    value: number
    step?: number
    inputRef: React.RefObject<HTMLInputElement>
    onChange: (val: number) => void
    style?: React.CSSProperties
  }

  class InternalInput extends React.Component<InternalInputProps> {
    static defaultProps: {
      step: number
    }
    render(): React.JSX.Element
  }

  type Point = {
    x: number
    y: number
  }

  type DrawLineProps = React.SVGProps<SVGLineElement> & {
    width?: number
    color?: string
    p1: Point
    p2: Point
  }

  class DrawLine extends React.Component<DrawLineProps> {
    render(): React.JSX.Element
  }

  type SvgLoaderProps = {
    svg?: string
    svgXML?: string
    width?: string | number
    height?: string | number
    style?: React.CSSProperties
    onSVGReady?: (svg: SVGElement) => void
    children?: React.ReactNode
  }

  type SvgProxyProps = {
    children?: React.ReactNode
    selector: string
    transform?: string
  }

  class SvgLoader extends React.Component<SvgLoaderProps> {
    render(): React.JSX.Element
  }

  class SvgProxy extends React.Component<SvgProxyProps> {
    render(): React.JSX.Element
  }
}
