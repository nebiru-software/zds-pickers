# zds-pickers 🎵

Picker controls that are common to ZendrumStudio apps - a React component library for MIDI/music applications.

## Overview

zds-pickers provides a comprehensive set of React components for building MIDI controller interfaces, music applications, and audio configuration UIs. The library focuses on picker-style controls that allow users to select values, notes, channels, and other musical parameters.

## Architecture

The library is organized into several key areas:

- **🎵 Music Components**: Piano interfaces, octave players, and audio providers
- **🎛️ Control Components**: Knobs, sliders, and interactive controls
- **🎯 Selection Components**: Dropdowns and pickers for various MIDI parameters
- **🔧 Utilities**: Shared components and helpers

## Key Features

- **TypeScript-first**: Full type safety with comprehensive interfaces
- **Audio Integration**: Built-in soundfont support for audio feedback
- **MIDI-Focused**: Components designed specifically for MIDI applications
- **Customizable**: Extensive theming and styling options
- **Accessible**: Keyboard navigation and screen reader support
- **Storybook Documentation**: Interactive component playground

## Quick Start

```bash
npm install zds-pickers react-select
```

Peer dependencies (`react`, `react-dom`, `react-select`, `classnames`, `zds-mappings`) must be installed in the host app. `react-select` was moved out of the package bundle in 4.1.x — add it explicitly if you use `Select`-based pickers.

```tsx
import { PianoPicker, KnobPicker, NotePicker } from 'zds-pickers'

function MyMIDIApp() {
  return (
    <div>
      <PianoPicker
        width={800}
        height={200}
        instrumentName="acoustic_grand_piano"
        onChange={(note) => console.log('Note played:', note)}
      />
      <KnobPicker
        label="Volume"
        min={0}
        max={127}
        value={64}
        onChange={(value) => console.log('Volume:', value)}
      />
    </div>
  )
}
```

## Component Documentation

**📚 All component examples, props, and usage patterns are documented in Storybook.**

Run `npm run sb` to access the interactive component playground with:
- Live examples of all components
- Interactive prop controls
- Multiple variants and states
- Copy-paste code snippets

### Available Components

**🎵 Music & Audio**
- `PianoPicker` - Full piano keyboard with soundfont integration
- `OctavePlayer` - Single octave piano interface
- `KeyPicker` - Octave-based MIDI note selection with highlighted key state

**🎛️ Controls**
- `KnobPicker` - Draggable knob with label and value display
- `ResponseCurvePicker` - Visual response curve selection
- `Knob` - Base knob component (from rotaryKnob)

**🎯 Selection**
- `NotePicker` - MIDI note selection with drum mapping support
- `ChannelPicker` - MIDI channel selection (1-16)
- `CCPicker` - MIDI Control Change number selection
- `StatusPicker` - MIDI status message selection
- `ChannelMappingPicker` - Channel mapping with drum kit presets
- `MappingPicker` - General mapping selection
- `PolarityPicker` - On/Off polarity selection
- `LatchPicker` - Latch mode selection
- `ValuePicker` - Generic value selection

**🔧 Utilities**
- `Select` - Generic select component with no-selection support
- `DefaultTooltip` - Tooltip component
- `SvgText` - SVG text rendering

## Audio Integration

The library includes `SoundfontProvider` for audio feedback:

```tsx
<SoundfontProvider
  audioContext={audioContext}
  instrumentName="acoustic_grand_piano"
  soundfont="MusyngKite"
  render={({ isLoading, playNote, stopNote }) => (
    <YourComponent
      playNote={playNote}
      stopNote={stopNote}
      disabled={isLoading}
    />
  )}
/>
```

## Development

### Setup
```bash
npm install
npm run dev          # Start Vite dev server
npm run sb           # Start Storybook
npm run build        # Build library
npm run lint         # Run Biome linter
```

### Storybook
**Primary documentation and testing environment** - all component examples, props, and usage patterns:
```bash
npm run sb
# Opens http://localhost:6006
```

Storybook serves as the single source of truth for:
- Component examples and variants
- Interactive prop controls
- Live code snippets
- Visual testing and development

### Building
The library builds to both CommonJS and ES modules:
- `dist/index.cjs.js` - CommonJS build
- `dist/index.es.js` - ES module build
- `dist/types/` - TypeScript definitions

## Peer dependencies

Install these in your application (they are not bundled with `zds-pickers`):

| Package | Version |
|---------|---------|
| `react` | >=18.0.0 |
| `react-dom` | >=18.0.0 |
| `react-select` | >=5.10.0 |
| `classnames` | >=2.5.1 |
| `zds-mappings` | 1.4.9 |

## Dependencies

### Core Dependencies
- **React 18+** - Component framework (peer)
- **TypeScript** - Type safety
- **D3.js** - Drag interactions and scaling
- **soundfont-player** - Audio playback
- **zds-react-piano** - Piano component
- **zds-mappings** - MIDI mappings

### Development Dependencies
- **Vite** - Build tool
- **Storybook** - Component documentation
- **Biome** - Linting and formatting
- **Tonal** - Music theory utilities

## Type Safety

All components are fully typed with TypeScript. Key interfaces:

```tsx
// Common picker props
interface BasePickerProps {
  disabled?: boolean
  label?: string
  shrinkLabel?: boolean
  value?: number | string
  onChange?: (value: number | string) => void
}

// Audio provider props
interface SoundfontProviderProps {
  audioContext: AudioContext
  instrumentName?: Soundfont.InstrumentName
  soundfont?: 'MusyngKite' | 'FluidR3_GM'
  render: (props: AudioRenderProps) => React.ReactNode
}
```

## Contributing

This is a single-developer library. The codebase follows these patterns:

- **Functional components** with hooks
- **TypeScript interfaces** for all props
- **Storybook stories** for each component
- **Biome** for consistent formatting
- **Modular exports** from index.ts

## License

MIT License - see LICENSE file for details.

## Repository

- **GitHub**: https://github.com/dkadrios/zds-pickers
- **NPM**: https://www.npmjs.com/package/zds-pickers
