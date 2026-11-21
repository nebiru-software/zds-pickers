import { createElement, Fragment } from 'react'

type TooltipProps = {
  children?: React.ReactNode
  placement?: 'left' | 'right' | 'top' | 'bottom'
  title: React.ReactNode
}

const DefaultTooltip = ({ children }: React.PropsWithoutRef<TooltipProps>) =>
  createElement(Fragment, null, children)

export type { TooltipProps }
export { DefaultTooltip }
