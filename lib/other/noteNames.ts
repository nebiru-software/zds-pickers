import { Midi, Note } from 'tonal'

const { midiToNoteName } = Midi

/**
 * Rewrites ASCII accidentals in a note name to their Unicode glyphs, so
 * labels read as `D♭` / `F♯` rather than `Db` / `F#`.
 */
const formatPitchName = (name: string) =>
  name.replace(/([A-G])b/g, '$1♭').replace(/([A-G])#/g, '$1♯')

/**
 * Pitch class (no octave) for a MIDI note, as a display label.
 *
 * `noteLabels`, when supplied, is a chroma-indexed array of names — index 0 is
 * C, index 1 is C♯/D♭, and so on. It lets a caller impose key-aware spelling
 * (a scale may legitimately need both B♭ and F♯), which a single sharps/flats
 * flag cannot express. Missing entries fall back to the default flat spelling.
 */
const pitchClassLabel = (
  midiNumber: number,
  noteLabels?: readonly string[],
): string =>
  noteLabels?.[((midiNumber % 12) + 12) % 12] ??
  formatPitchName(Note.pitchClass(Note.fromMidi(midiNumber) ?? ''))

/**
 * Note name with octave for a MIDI note, flats by default (`70` → `B♭4`).
 */
const midiNoteLabel = (note: number): string =>
  formatPitchName(midiToNoteName(note, { sharps: false }))

export { formatPitchName, midiNoteLabel, pitchClassLabel }
