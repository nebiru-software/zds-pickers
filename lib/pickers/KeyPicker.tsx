import { OctavePlayer, type OctavePlayerProps } from '../other/OctavePlayer'

type KeyPickerProps = OctavePlayerProps & {
  value: number
  onChange: (value: number) => void
}

const KeyPicker = (props: KeyPickerProps) => {
  console.log('KeyPicker', props)

  return <OctavePlayer {...props} activeNotes={[65]} />
}

KeyPicker.propTypes = {}

export { KeyPicker }
