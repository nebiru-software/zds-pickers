#ifndef midiHandler_h
#define midiHandler_h

#include "shifterTypes.h"
#include <MIDI.h>

void setupMidi();

void crankMidi();

bool handleControlChange(midi_packet* packet);
bool processSerialPacket(midi_packet* packet);

#endif // ifndef midiHandler_h
