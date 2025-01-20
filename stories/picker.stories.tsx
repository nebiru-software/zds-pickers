import type { Meta, StoryObj } from '@storybook/react'
import type * as Soundfont from 'soundfont-player'
import { getMapping } from 'zds-mappings'
import { Statuses, statusOptions } from '../lib/midi/export.ts'
import OctavePlayer from '../lib/other/OctavePlayer.tsx'
import CCPicker from '../lib/pickers/CCPicker.tsx'
import ChannelMappingPicker from '../lib/pickers/ChannelMappingPicker.tsx'
import ChannelPicker from '../lib/pickers/ChannelPicker.tsx'
import Knob from '../lib/pickers/Knob.tsx'
import KnobPicker from '../lib/pickers/KnobPicker.tsx'
import LatchPicker from '../lib/pickers/LatchPicker.tsx'
import MappingPicker from '../lib/pickers/MappingPicker.tsx'
import NotePicker from '../lib/pickers/NotePicker.tsx'
import PianoPicker from '../lib/pickers/PianoPicker.tsx'
import PolarityPicker from '../lib/pickers/PolarityPicker.tsx'
import ResponseCurve from '../lib/pickers/ResponseCurve.tsx'
import ResponseCurvePicker from '../lib/pickers/ResponseCurvePicker.tsx'
import StatusPicker from '../lib/pickers/StatusPicker.tsx'
import ValuePicker from '../lib/pickers/ValuePicker.tsx'

const meta: Meta = {
  title: 'Pickers',
}

const gmMapping = getMapping('General MIDI')

const CCPickerStory: StoryObj<typeof CCPicker> = {
  render: args => <CCPicker {...args} />,
  args: {
    disabled: false,
    label: 'CC #',
    shrinkLabel: false,
    value: 7,
  },
}

const ChannelPickerStory: StoryObj<typeof ChannelPicker> = {
  render: args => <ChannelPicker {...args} />,
  args: {
    disabled: false,
    label: 'Channel',
    shrinkLabel: false,
    value: 9,
  },
}

const ChannelMappingPickerStory: StoryObj<typeof ChannelMappingPicker> = {
  render: args => <ChannelMappingPicker {...args} />,
  args: {
    channels: [
      '',
      'No Mapping',
      '',
      'Alesis DM Pro',
      '',
      '',
      '',
      'BFD3',
      '',
      '',
      'Roland TD-20',
      'Roland TD-30 Perc 1 (Latin)',
      '',
      '',
      '',
      '',
    ].map((label, value) => ({ label, value })),
    disabled: false,
    label: 'Channel',
    shrinkLabel: false,
    value: 7,
  },
}

const KnobStory: StoryObj<typeof Knob> = {
  render: args => <Knob {...args} />,
  args: {
    disabled: false,
    max: 127,
    min: 0,
    value: 45,
    wheelEnabled: false,
  },
}

const KnobPickerStory: StoryObj<typeof KnobPicker> = {
  render: args => <KnobPicker {...args} />,
  args: {
    disabled: false,
    includePicker: true,
    label: 'Sensitivity',
    max: 127,
    min: 0,
    shrinkLabel: false,
    // size: 35,
    value: 87,
    wheelEnabled: false,
  },
}

const LatchPickerStory: StoryObj<typeof LatchPicker> = {
  render: args => <LatchPicker {...args} />,
  args: {
    disabled: false,
    label: 'Mode',
    shrinkLabel: false,
    value: 0,
  },
}

const MappingPickerStory: StoryObj<typeof MappingPicker> = {
  render: args => <MappingPicker {...args} />,
  args: {
    allowClearing: true,
    disabled: false,
    label: 'Mapping',
    preserveMenuWidth: false,
    shrinkLabel: false,
    value: 'EZDrummer',
  },
}

const NotePickerStory1: StoryObj<typeof NotePicker> = {
  render: args => <NotePicker {...args} />,
  args: {
    channel: 0,
    disabled: false,
    isMelodicMode: false,
    label: 'Note #',
    mapping: gmMapping,
    shrinkLabel: false,
    value: 38,
  },
}

const NotePickerStory2: StoryObj<typeof NotePicker> = {
  render: args => <NotePicker {...args} />,
  args: {
    channel: 0,
    disabled: false,
    isMelodicMode: false,
    label: 'No mapping',
    shrinkLabel: false,
    value: 38,
  },
}

const NotePickerStory3: StoryObj<typeof NotePicker> = {
  render: args => <NotePicker {...args} />,
  args: {
    channel: 0,
    disabled: false,
    isMelodicMode: false,
    label: 'Action button',
    mapping: gmMapping,
    // selectProps: {
    //   actionButton: (
    //     <button
    //       onClick={e => {
    //         window.alert('click')
    //       }}>
    //       ?
    //     </button>
    //   ),
    // },
    shrinkLabel: false,
    value: 38,
  },
}

const OctavePlayerStory: StoryObj<typeof OctavePlayer> = {
  render: args => <OctavePlayer {...args} />,
  args: {
    instrumentName: {
      control: { type: 'select' },
      options: [undefined, 'acoustic_grand_piano'],
    } as unknown as Soundfont.InstrumentName,
    height: 100,
    width: 200,
    octave: 4,
  },
}

// # NotePicker
// <Canvas withToolbar>
//   <Story
//     height={120}
//     name="NotePicker"
//   >
//     <NotePicker
//       channel={number('channel', 0, 'NotePicker')}
//       disabled={boolean('disabled', false, 'NotePicker')}
//       isMelodicMode={boolean('isMelodicMode', false, 'NotePicker')}
//       label={text('label', 'Note #', 'NotePicker')}
//       mapping={gmMapping}
//       onChange={action('handleChange')}
//       shrinkLabel={boolean('shrinkLabel', false, 'NotePicker')}
//       value={number('value', 38, {}, 'NotePicker')}
//     />
//     <br />
//     <NotePicker
//       channel={number('channel', 0, 'NotePicker2')}
//       disabled={boolean('disabled', false, 'NotePicker2')}
//       isMelodicMode={boolean('isMelodicMode', false, 'NotePicker2')}
//       label="No mapping"
//       onChange={action('handleChange2')}
//       shrinkLabel={boolean('shrinkLabel', false, 'NotePicker')}
//       value={number('value', 38, {}, 'NotePicker2')}
//     />
//     <br />
//     <NotePicker
//       channel={number('channel', 0, 'NotePicker3')}
//       disabled={boolean('disabled', false, 'NotePicker3')}
//       isMelodicMode={boolean('isMelodicMode', false, 'NotePicker3')}
//       label="Action button"
//       mapping={gmMapping}
//       onChange={action('handleChange3')}
//       selectProps={{actionButton:<button onClick={e=>{
//         console.log('click')
//         }}>?</button>}}
//       shrinkLabel={boolean('shrinkLabel', false, 'NotePicker')}
//       value={number('value', 38, {}, 'NotePicker3')}
//     />
//   </Story>
// </Canvas>

const PianoPickerStory: StoryObj<typeof PianoPicker> = {
  render: args => <PianoPicker {...args} />,
  args: {
    instrumentName: 'acoustic_grand_piano',
    height: 100,
    width: 1000,
  },
}

const PolarityPickerStory: StoryObj<typeof PolarityPicker> = {
  render: args => <PolarityPicker {...args} />,
  args: {
    disabled: false,
    label: 'Polarity',
    labelOff: 'Normally Off',
    labelOn: 'Normally On',
    shrinkLabel: false,
    value: 0,
  },
}

const ResponseCurveStory: StoryObj<typeof ResponseCurve> = {
  render: args => <ResponseCurve {...args} />,
  args: {
    disabled: false,
    inverted: false,
    value: 0,
  },
}

const ResponseCurvePickerStory: StoryObj<typeof ResponseCurvePicker> = {
  render: args => <ResponseCurvePicker {...args} />,
  args: {
    disabled: false,
    inverted: false,
    label: 'Response',
    shrinkLabel: false,
    value: 0,
  },
}

const StatusPickerStory: StoryObj<typeof StatusPicker> = {
  render: args => <StatusPicker {...args} />,
  args: {
    disabled: false,
    label: 'Status Msg',
    shrinkLabel: false,
    statuses: statusOptions,
    value: Statuses.noteOn,
  },
}

const ValuePickerStory: StoryObj<typeof ValuePicker> = {
  render: args => <ValuePicker {...args} />,
  args: {
    disabled: false,
    highToLow: false,
    label: 'Value',
    max: 127,
    min: 0,
    shrinkLabel: false,
  },
}

export {
  ChannelPickerStory as ChannelPicker,
  ChannelMappingPickerStory as ChannelMappingPicker,
  CCPickerStory as ContinuousChangePicker,
  KnobStory as Knob,
  KnobPickerStory as KnobPicker,
  LatchPickerStory as LatchPicker,
  MappingPickerStory as MappingPicker,
  NotePickerStory1 as NotePickerSimple,
  NotePickerStory2 as NotePickerNoMapping,
  NotePickerStory3 as NotePickerActionButton,
  OctavePlayerStory as OctavePlayer,
  PianoPickerStory as PianoPicker,
  PolarityPickerStory as PolarityPicker,
  ResponseCurveStory as ResponseCurve,
  ResponseCurvePickerStory as ResponseCurvePicker,
  StatusPickerStory as StatusPicker,
  ValuePickerStory as ValuePicker,
}

export default meta
