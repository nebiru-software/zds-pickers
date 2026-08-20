import { describe, expect, it } from 'vitest'
import { formatPitchName, midiNoteLabel, pitchClassLabel } from './noteNames'

describe('formatPitchName', () => {
  it('rewrites ASCII flats to the Unicode glyph', () => {
    expect(formatPitchName('Db')).toBe('D♭')
    expect(formatPitchName('Bb4')).toBe('B♭4')
  })

  it('rewrites ASCII sharps to the Unicode glyph', () => {
    expect(formatPitchName('F#')).toBe('F♯')
    expect(formatPitchName('C#2')).toBe('C♯2')
  })

  it('leaves naturals and empty names alone', () => {
    expect(formatPitchName('G')).toBe('G')
    expect(formatPitchName('')).toBe('')
  })
})

describe('pitchClassLabel', () => {
  it('defaults to flat spelling with no override', () => {
    expect(pitchClassLabel(61)).toBe('D♭')
    expect(pitchClassLabel(70)).toBe('B♭')
    expect(pitchClassLabel(60)).toBe('C')
  })

  it('uses the caller supplied chroma-indexed names', () => {
    const sharps = [
      'C',
      'C♯',
      'D',
      'D♯',
      'E',
      'F',
      'F♯',
      'G',
      'G♯',
      'A',
      'A♯',
      'B',
    ]
    expect(pitchClassLabel(61, sharps)).toBe('C♯')
    expect(pitchClassLabel(66, sharps)).toBe('F♯')
    // Any octave of the same chroma resolves to the same label
    expect(pitchClassLabel(49, sharps)).toBe('C♯')
  })

  it('supports mixed spelling within one label set', () => {
    // G melodic minor legitimately needs both B♭ and F♯
    const gMelodicMinor: string[] = []
    gMelodicMinor[10] = 'B♭'
    gMelodicMinor[6] = 'F♯'
    expect(pitchClassLabel(70, gMelodicMinor)).toBe('B♭')
    expect(pitchClassLabel(66, gMelodicMinor)).toBe('F♯')
  })

  it('falls back to the default name for missing entries', () => {
    const sparse: string[] = []
    sparse[6] = 'F♯'
    expect(pitchClassLabel(61, sparse)).toBe('D♭')
  })
})

describe('midiNoteLabel', () => {
  it('renders name with octave using flats', () => {
    expect(midiNoteLabel(61)).toBe('D♭4')
    expect(midiNoteLabel(70)).toBe('B♭4')
    expect(midiNoteLabel(60)).toBe('C4')
    expect(midiNoteLabel(0)).toBe('C-1')
  })
})
