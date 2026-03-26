# ø co. / orchid – Browser Chord Synthesizer

A sophisticated, browser-based chord synthesizer inspired by the Orchid hardware device. Generate rich harmonic textures with intuitive controls, real-time visual feedback, and multiple performance modes.

## Features

### Core Harmonic Engine
- **Chord Type Selection**: Major, Minor, Suspended, Diminished
- **Chord Extensions**: 6th, Minor 7th, Major 7th, 9th
- **Voicing Control**: Three inversion modes for rich harmonic texture
- **Bass Voicing**: Independent control over the lowest note
- **Single-Octave Keyboard**: Play notes A-L (C-D)

### Performance Modes
- **Strum**: Upward/downward guitar-like strumming with humanization
- **Arpeggiator**: Cyclical note sequencing through the current voicing
- **Pattern**: Harmonic ostinato with preset rhythmic patterns
- **Harp**: Smooth harmonic sweep across voicings

### Audio Features
- Real-time Web Audio synthesis with oscillator pool management
- ADSR envelope shaping on all notes
- Master volume and BPM controls
- Multi-voice polyphonic synthesis (up to 12 voices)

### Visual Feedback
- **Harmonic Visualization**: Chord notes displayed as points in circular harmonic space
- **Real-Time Readout**: Displays current chord name, voicing, bass note, and mode
- **Interactive Buttons**: Visual feedback on active states
- **Canvas-Based Display**: Smooth, responsive visualization

## Controls

### Keyboard Shortcuts

**Note Selection (A-L)**
- `A` → C
- `S` → D
- `D` → E
- `F` → F
- `G` → G
- `H` → A
- `J` → B
- `K` → C (octave up)
- `L` → D (octave up)

**Chord Type (1-4)**
- `1` → Major
- `2` → Minor
- `3` → Suspended
- `4` → Diminished

**Extensions (Q-R)**
- `Q` → Toggle 6th
- `W` → Toggle Minor 7th
- `E` → Toggle Major 7th
- `R` → Toggle 9th

**Performance Control**
- `SPACE` → Play current chord with active performance mode
- `T` → Strum mode
- `A` → Arpeggiator mode
- `P` → Pattern mode
- `↑/↓ Arrow Keys` → Increase/Decrease voicing

### Mouse Controls
- **Click Buttons**: Activate chord types, extensions, notes, and performance modes
- **Sliders**: Adjust BPM (40–200) and Volume (0–100)

## Inspiration & Reference

Based on the Orchid hardware synthesizer by Telepathic Instruments:
- Intuitive chord generation with harmonic intelligence
- Real-time performance modes for dynamic expression
- Voice-leading algorithms for smooth harmonic transitions
- Designed for musicians of all skill levels

## Design Principles

1. **Single-Source Harmonic Truth**: All controls modify a unified harmonic structure from a root note
2. **Spatial Interaction Zones**: Left side for harmony, right side for performance
3. **Context-Aware Controls**: Show relevant parameters based on active mode
4. **Real-Time Visual Feedback**: Audio and visual state update synchronously
5. **Input Parity**: Keyboard, mouse, and touch feel equally responsive

## Technical Implementation

- **Framework**: Vanilla JavaScript with Web Audio API
- **Audio Synthesis**: Sine wave oscillators with ADSR envelopes
- **Visualization**: HTML5 Canvas with real-time harmonic display
- **Aesthetic**: mir-gallery visual language (dark theme, accent colors, monospace typography)
- **Browser Support**: Modern browsers with Web Audio API support (Chrome, Firefox, Safari, Edge)

## Getting Started

1. Open `orchid.html` in a modern web browser
2. Select a note (A-L keys or click keyboard)
3. Choose chord type (1-4 keys or click buttons)
4. Add extensions (Q-R keys) for complexity
5. Select performance mode (buttons on right panel)
6. Press Space or click performance mode to play
7. Adjust BPM and Volume as desired

## Future Enhancements

- MIDI input/output support
- Additional performance modes (bass generator, arpeggio hold)
- Effects processing (reverb, delay, chorus)
- Sound preset system
- Recording and loop functionality
- Responsive mobile interface

## Credits

**Design Philosophy**: Expert roundtable featuring music theory specialist, interactive UX designer, creative technologist, and visual design lead

**Reference**: Omnichord and Orchid user manuals for harmonic theory and interface design

**Aesthetic**: mir-gallery design system by Julia Compton

---

Created as part of the Mir-Gallery project. Experiment, explore, and discover the infinite expressions of harmony.
