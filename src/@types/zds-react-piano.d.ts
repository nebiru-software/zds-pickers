declare module 'zds-react-piano' {
  type NoteRange = {
    first: number
    last: number
  }

  const ReactPiano: React.ComponentType<{
    disabled?: boolean
    keyWidthToHeight: number
    noteRange: NoteRange
    width: number
  }>

  export { ReactPiano as Piano }

  export type { NoteRange }
}
