import type { Meta, StoryObj } from '@storybook/react'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react'
import type * as Soundfont from 'soundfont-player'
import { getMapping } from 'zds-mappings'
import { Statuses, statusOptions } from '../lib/midi/export'
import { OctavePlayer } from '../lib/other/OctavePlayer'
import { CCPicker } from '../lib/pickers/CCPicker'
import { ChannelMappingPicker } from '../lib/pickers/ChannelMappingPicker'
import { ChannelPicker } from '../lib/pickers/ChannelPicker'
import { Knob } from '../lib/pickers/Knob'
import { KnobPicker } from '../lib/pickers/KnobPicker'
import { LatchPicker } from '../lib/pickers/LatchPicker'
import { MappingPicker } from '../lib/pickers/MappingPicker'
import { NotePicker } from '../lib/pickers/NotePicker'
import { PianoPicker } from '../lib/pickers/PianoPicker'
import { PolarityPicker } from '../lib/pickers/PolarityPicker'
import { ResponseCurve } from '../lib/pickers/ResponseCurve'
import { ResponseCurvePicker } from '../lib/pickers/ResponseCurvePicker'
import { StatusPicker } from '../lib/pickers/StatusPicker'
import { ValuePicker } from '../lib/pickers/ValuePicker'

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

const ChannelPickerUndefinedStory: StoryObj<typeof ChannelPicker> = {
  render: args => <ChannelPicker {...args} />,
  args: {
    disabled: false,
    label: 'Channel',
    shrinkLabel: false,
    value: undefined,
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
    actionButton: (
      <button
        type="button"
        onClick={() => {
          window.alert('click')
        }}>
        ?
      </button>
    ),
    shrinkLabel: false,
    value: 38,
  },
}

const NotePickerStory4: StoryObj<typeof NotePicker> = {
  render: args => <NotePicker {...args} />,
  args: {
    channel: 0,
    disabled: false,
    isMelodicMode: false,
    label: 'Note #',
    mapping: gmMapping,
    shrinkLabel: false,
    value: undefined,
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
  ChannelPickerUndefinedStory as ChannelPickerNoValue,
  ChannelMappingPickerStory as ChannelMappingPicker,
  CCPickerStory as ContinuousChangePicker,
  KnobStory as Knob,
  KnobPickerStory as KnobPicker,
  LatchPickerStory as LatchPicker,
  MappingPickerStory as MappingPicker,
  NotePickerStory1 as NotePickerSimple,
  NotePickerStory2 as NotePickerNoMapping,
  NotePickerStory3 as NotePickerActionButton,
  NotePickerStory4 as NotePickerNoValue,
  OctavePlayerStory as OctavePlayer,
  PianoPickerStory as PianoPicker,
  PolarityPickerStory as PolarityPicker,
  ResponseCurveStory as ResponseCurve,
  ResponseCurvePickerStory as ResponseCurvePicker,
  StatusPickerStory as StatusPicker,
  ValuePickerStory as ValuePicker,
}

export default meta
