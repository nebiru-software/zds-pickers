// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Soundfont from 'soundfont-player'
import { isDefined } from './utils'
// import '../temp/acoustic_grand_piano-mp3'

const SoundfontProvider = (props) => {
  const {
    audioContext,
    format,
    hostname,
    instrumentName,
    render,
    soundfont,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [activeAudioNodes, setActiveAudioNodes] = useState({})
  const [instrument, setInstrument] = useState(null)

  const loadInstrument = useCallback((nm) => {
    // Re-trigger loading state
    setInstrument(null)

    if (isDefined(hostname)) {
      // pull from an url
      Soundfont.instrument(audioContext, nm, {
        format,
        soundfont,
        nameToUrl: (name, sf, fmt) => `${hostname}/${sf}/${name}-${fmt}.js`,
      }).then((newInstrument) => {
        setInstrument(newInstrument)
      })
    } else if (isDefined(instrumentName)) {
      // the host app has already injected the soundfont into global space
      Soundfont
        .instrument(audioContext, instrumentName)
        .then((newInstrument) => {
          setInstrument(newInstrument)
        })
    } else {
      // sound must be disabled
      setIsLoading(false)
    }
  }, [audioContext, format, hostname, instrumentName, soundfont])

  useEffect(() => {
    loadInstrument(instrumentName)
  }, [instrumentName, loadInstrument])

  useEffect(() => {
    if (isDefined(instrumentName)) {
      setIsLoading(!instrument)
    }
  }, [instrument, instrumentName])

  const playNote = (midiNumber) => {
    audioContext.resume().then(() => {
      const audioNode = instrument.play(midiNumber)
      setActiveAudioNodes(prev => ({ ...prev, [midiNumber]: audioNode }))
    })
  }

  const stopNote = (midiNumber) => {
    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return
      }
      const audioNode = activeAudioNodes[midiNumber]
      audioNode.stop()
      setActiveAudioNodes(prev => ({ ...prev, [midiNumber]: null }))
    })
  }

  // Clear any residual notes that don't get called with stopNote
  const stopAllNotes = () => {
    audioContext.resume().then(() => {
      const nodes = Object.values(activeAudioNodes)
      nodes.forEach((node) => {
        if (node) {
          node.stop()
        }
      })
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

SoundfontProvider.propTypes = {
  audioContext: PropTypes.instanceOf(window.AudioContext),
  format: PropTypes.oneOf(['mp3', 'ogg']),
  hostname: PropTypes.string,
  instrumentName: PropTypes.string,
  render: PropTypes.func.isRequired,
  soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
}

SoundfontProvider.defaultProps = {
  format: undefined, // mp3,
  hostname: undefined, // https://d1pzp51pvbm36p.cloudfront.net
  instrumentName: undefined, // acoustic_grand_piano
  soundfont: undefined, // MusyngKite,
  // soundfont: 'FluidR3_GM',
}

// https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3.js
// https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/.js

export default SoundfontProvider
