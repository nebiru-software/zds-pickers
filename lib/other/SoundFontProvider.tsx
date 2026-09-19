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

// Also ensure it's on globalThis (browser sync + Node/SSR; avoid bare `global`)
if (typeof globalThis !== 'undefined' && !globalThis.MIDI) {
  globalThis.MIDI =
    typeof window !== 'undefined' && window.MIDI
      ? window.MIDI
      : { Soundfont: {} }
}

// CRITICAL: Import at top level to ensure bundler processes it
// Import bundled soundfont to avoid CSP issues in Electron apps
// NOTE: This adds ~2.2MB to the bundle size. Currently all consumers need piano,
// but if future web apps don't need audio, consider making this import conditional
// or implementing lazy loading to reduce bundle size for audio-free use cases.
import '../soundfonts/acoustic_grand_piano-mp3'

const isDefined = <T,>(item: T) =>
  item !== undefined && item !== null && !Number.isNaN(item)

const midiToNoteName = (midiNumber: number | string): string => {
  const num =
    typeof midiNumber === 'string'
      ? Number.parseInt(midiNumber, 10)
      : midiNumber
  return Note.fromMidi(num)
}

/**
 * Key-up release, in seconds — the same 0.3 s soundfont-player's own envelope
 * uses on the remote path. Pausing the element outright cut the sample
 * mid-waveform, which clicked on every key-up and made a glissando sound
 * like a row of switches.
 */
const RELEASE_SECONDS = 0.3
// setTargetAtTime is exponential, so it needs a time constant rather than a
// duration: five of them leave <1% of the level by the time the element stops.
const RELEASE_TIME_CONSTANT = RELEASE_SECONDS / 5

const createBundledPlayer = (
  audioContext: AudioContext,
  soundfontData: Record<string, string>,
): Soundfont.Player => {
  const player = {
    play: (note: string | number, velocity?: number) => {
      const noteName = midiToNoteName(note)
      const noteData = soundfontData[noteName]
      if (!noteData) {
        return { stop: () => {} } as Soundfont.Player
      }

      // Still streamed by an <audio> element — no decode, so no first-note
      // latency — but routed through a gain node so the release can ramp.
      const audio = new Audio(noteData)
      const source = audioContext.createMediaElementSource(audio)
      const gain = audioContext.createGain()
      gain.gain.value = (velocity ?? 127) / 127
      source.connect(gain).connect(audioContext.destination)
      audio.play()

      let stopped = false

      return {
        stop: () => {
          if (stopped) return
          stopped = true

          const now = audioContext.currentTime
          gain.gain.cancelScheduledValues(now)
          gain.gain.setValueAtTime(gain.gain.value, now)
          gain.gain.setTargetAtTime(0, now, RELEASE_TIME_CONSTANT)

          window.setTimeout(() => {
            audio.pause()
            source.disconnect()
            gain.disconnect()
          }, RELEASE_SECONDS * 1000)
        },
      } as Soundfont.Player
    },
    stop: () => [] as AudioNode[],
  }
  return player as Soundfont.Player
}

const loadBundledOrRemoteInstrument = (
  audioContext: AudioContext,
  instrumentName: Soundfont.InstrumentName,
  format: SoundfontProviderProps['format'],
  soundfont: SoundfontProviderProps['soundfont'],
  hostname: string | undefined,
): Promise<Soundfont.Player> => {
  const soundfontData = window.MIDI?.Soundfont?.[instrumentName]
  if (soundfontData) {
    return Promise.resolve(createBundledPlayer(audioContext, soundfontData))
  }

  // biome-ignore lint/suspicious/noConsole: intentional diagnostics for missing bundled soundfont
  console.warn(
    `[zds-pickers] Bundled soundfont "${instrumentName}" not found; falling back to remote load.`,
  )

  if (isDefined(hostname)) {
    return Soundfont.instrument(audioContext, instrumentName, {
      format,
      soundfont,
      nameToUrl: (name: string, sf: string, fmt: string) =>
        `${hostname}/${sf}/${name}-${fmt}.js`,
    })
  }

  return Soundfont.instrument(audioContext, instrumentName, {
    format,
    soundfont,
  })
}

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

  // No instrument means silent, not loading — starting true would leave a
  // muted keyboard disabled forever, since nothing ever loads to clear it.
  const [isLoading, setIsLoading] = useState(Boolean(instrumentName))
  const [activeAudioNodes, setActiveAudioNodes] = useState<
    Record<number, Soundfont.Player>
  >({})
  const [instrument, setInstrument] = useState<Soundfont.Player | null>(null)

  const loadInstrument = useCallback(
    (nm: Soundfont.InstrumentName) => {
      setInstrument(null)
      setIsLoading(true)

      if (!instrumentName) {
        setIsLoading(false)
        return
      }

      if (isDefined(hostname)) {
        Soundfont.instrument(audioContext, nm, {
          format,
          soundfont,
          nameToUrl: (name: string, sf: string, fmt: string) =>
            `${hostname}/${sf}/${name}-${fmt}.js`,
        })
          .then(newInstrument => {
            setInstrument(newInstrument)
          })
          .catch(error => {
            // biome-ignore lint/suspicious/noConsole: intentional diagnostics for load failures
            console.error(
              `[zds-pickers] Failed to load soundfont "${nm}" from ${hostname}:`,
              error,
            )
            setIsLoading(false)
          })
        return
      }

      loadBundledOrRemoteInstrument(
        audioContext,
        nm,
        format,
        soundfont,
        hostname,
      )
        .then(newInstrument => {
          setInstrument(newInstrument)
        })
        .catch(error => {
          // biome-ignore lint/suspicious/noConsole: intentional diagnostics for load failures
          console.error(
            `[zds-pickers] Failed to load soundfont "${nm}":`,
            error,
          )
          setIsLoading(false)
        })
    },
    [audioContext, format, hostname, instrumentName, soundfont],
  )

  useEffect(() => {
    if (instrumentName) {
      loadInstrument(instrumentName)
      return
    }
    // Unset after a load (muting): drop the loaded player so playNote no-ops.
    setInstrument(null)
    setIsLoading(false)
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
        setActiveAudioNodes(prev => ({ ...prev, [midiNumber]: audioNode }))
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
      setActiveAudioNodes(prev => {
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
      setActiveAudioNodes({})
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
