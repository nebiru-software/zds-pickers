declare module 'zds-react-piano' {
  import type { ReactNode } from 'react'

  type NoteLabelRenderProps = {
    isAccidental: boolean
    isActive: boolean
    keyboardShortcut?: string | null
    midiNumber: number
  }

  type NoteRange = {
    first: number
    last: number
  }

  const ReactPiano: React.ComponentType<{
    className?: string
    disabled?: boolean
    keyWidthToHeight: number
    noteRange: NoteRange
    onClick?: (note: number) => void
    onDoubleClick?: (note: number) => void
    onKeyMouseEnter?: (note: {
      accidental: boolean
      left: number
      midiNumber: number
      width: number
    }) => void
    onKeyMouseLeave?: (note: number) => void
    playNote?: (note: number) => void
    renderNoteLabel?: (props: NoteLabelRenderProps) => ReactNode
    selectedNotes?: number[]
    stopNote?: (note: number) => void
    width: number
  }>

  export { ReactPiano as Piano }

  export type { NoteLabelRenderProps, NoteRange }
}
