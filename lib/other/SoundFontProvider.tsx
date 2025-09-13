// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import { useCallback, useEffect, useState } from 'react'
import Soundfont from 'soundfont-player'
import { Note } from 'tonal'

// Type for the MIDI global object
interface MIDIGlobal {
  Soundfont: Record<string, Record<string, string>>
}

// Extend global interfaces to include MIDI
declare global {
  interface Window {
    MIDI?: MIDIGlobal
  }
  var MIDI: MIDIGlobal | undefined
  namespace globalThis {
    var MIDI: MIDIGlobal | undefined
  }
}
// Ensure MIDI global exists before importing soundfont
if (typeof window !== 'undefined') {
  if (!window.MIDI) {
    window.MIDI = { Soundfont: {} }
  }
}

// Also ensure it's available globally (not just on window)
if (typeof globalThis !== 'undefined') {
  if (!globalThis.MIDI) {
    globalThis.MIDI = window.MIDI || { Soundfont: {} }
  }
}

// Also set it on the global object for Node.js compatibility
if (typeof global !== 'undefined') {
  if (!global.MIDI) {
    global.MIDI = window.MIDI || { Soundfont: {} }
  }
}

// CRITICAL: Import at top level to ensure bundler processes it
// Import bundled soundfont to avoid CSP issues in Electron apps
// NOTE: This adds ~2.2MB to the bundle size. Currently all consumers need piano,
// but if future web apps don't need audio, consider making this import conditional
// or implementing lazy loading to reduce bundle size for audio-free use cases.
import '../soundfonts/acoustic_grand_piano-mp3'

const isDefined = <T,>(item: T) =>
  item !== undefined && item !== null && !Number.isNaN(item)

type SoundfontProviderProps = {
  audioContext: AudioContext
  format?: 'mp3' | 'ogg'
  hostname?: string
  instrumentName?: Soundfont.InstrumentName
  onChange?: (midiNumber: number) => void
  render: (props: {
    isLoading: boolean
    playNote: (midiNumber: number) => void
    stopNote: (midiNumber: number) => void
    stopAllNotes: () => void
  }) => React.ReactNode
  soundfont?: 'MusyngKite' | 'FluidR3_GM'
}

const SoundfontProvider = (props: SoundfontProviderProps) => {
  const {
    audioContext,
    format,
    hostname,
    instrumentName,
    onChange,
    render,
    soundfont,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [activeAudioNodes, setActiveAudioNodes] = useState<
    Record<number, Soundfont.Player>
  >({})
  const [instrument, setInstrument] = useState<Soundfont.Player | null>(null)

  const loadInstrument = useCallback(
    (nm: Soundfont.InstrumentName) => {
      // Re-trigger loading state
      setInstrument(null)

      if (isDefined(hostname)) {
        // pull from an url
        Soundfont.instrument(audioContext, nm, {
          format,
          soundfont,
          nameToUrl: (name: string, sf: string, fmt: string) =>
            `${hostname}/${sf}/${name}-${fmt}.js`,
        }).then((newInstrument) => {
          setInstrument(newInstrument)
        })
      } else if (instrumentName) {
        // the host app has already injected the soundfont into global space
        // Try to create a player directly from our bundled soundfont data
        const soundfontData = window.MIDI?.Soundfont?.[instrumentName]
        if (soundfontData) {
          // MIDI note number to note name conversion using Tonal
          const midiToNoteName = (midiNumber: number | string): string => {
            const num =
              typeof midiNumber === 'string'
                ? Number.parseInt(midiNumber, 10)
                : midiNumber
            return Note.fromMidi(num)
          }

          // Create a simple player that can play notes from our bundled data
          const player = {
            play: (note: string | number, velocity?: number) => {
              // Convert MIDI note number to note name if needed
              const noteName = midiToNoteName(note)
              const noteData = soundfontData[noteName]
              if (noteData) {
                // Create audio from the data URL
                const audio = new Audio(noteData)
                audio.volume = (velocity || 127) / 127
                audio.play()

                // Return a compatible object with stop method
                return {
                  stop: () => {
                    audio.pause()
                    audio.currentTime = 0
                  },
                }
              }
              return null
            },
            stop: () => {
              // Simple stop implementation
            },
          }
          setInstrument(player as Soundfont.Player)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } else {
        // sound must be disabled
        setIsLoading(false)
      }
    },
    [audioContext, format, hostname, instrumentName, soundfont],
  )

  useEffect(() => {
    if (instrumentName) {
      loadInstrument(instrumentName)
    }
  }, [instrumentName, loadInstrument])

  useEffect(() => {
    if (isDefined(instrumentName)) {
      setIsLoading(!instrument)
    }
  }, [instrument, instrumentName])

  const playNote = (midiNumber: number) => {
    if (instrument) {
      audioContext.resume().then(() => {
        const audioNode = instrument.play(String(midiNumber))
        setActiveAudioNodes((prev) => ({ ...prev, [midiNumber]: audioNode }))
      })
    }
  }

  const stopNote = (midiNumber: number) => {
    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return
      }
      const audioNode = activeAudioNodes[midiNumber]
      audioNode.stop()
      setActiveAudioNodes((prev) => {
        const { [midiNumber]: _, ...rest } = prev
        return rest
      })
    })
    onChange?.(midiNumber)
  }

  // Clear any residual notes that don't get called with stopNote
  const stopAllNotes = () => {
    audioContext.resume().then(() => {
      const nodes = Object.values(activeAudioNodes)
      for (const node of nodes) {
        if (node) {
          node.stop()
        }
      }
      setActiveAudioNodes(nodes)
    })
  }

  return render({
    isLoading,
    playNote,
    stopNote,
    stopAllNotes,
  })
}

// https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3.js
// https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/.js

export { SoundfontProvider }

export type { SoundfontProviderProps }
