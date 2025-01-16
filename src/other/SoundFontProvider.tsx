// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import { useCallback, useEffect, useState } from 'react'
import Soundfont from 'soundfont-player'
// import '../temp/acoustic_grand_piano-mp3'

const isDefined = <T,>(item: T) =>
  item !== undefined && item !== null && !Number.isNaN(item)

type SoundfontProviderProps = {
  audioContext: AudioContext
  format?: 'mp3' | 'ogg'
  hostname?: string
  instrumentName: Soundfont.InstrumentName
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
        }).then(newInstrument => {
          setInstrument(newInstrument)
        })
      } else if (isDefined(instrumentName)) {
        // the host app has already injected the soundfont into global space
        Soundfont.instrument(audioContext, instrumentName).then(
          newInstrument => {
            setInstrument(newInstrument)
          },
        )
      } else {
        // sound must be disabled
        setIsLoading(false)
      }
    },
    [audioContext, format, hostname, instrumentName, soundfont],
  )

  useEffect(() => {
    loadInstrument(instrumentName)
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

export default SoundfontProvider
