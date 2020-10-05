#ifndef midiHandler_h
#define midiHandler_h

#include "shifterTypes.h"
#include <MIDI.h>

void setupMidi();

void crankMidi();

void   sendSysEx(byte* data, size_t size);
void   receiveUsbSysEx(const byte* data, uint16_t length, bool last);
size_t unpack(uint8_t* data, uint8_t* sysex, size_t len);

bool handleControlChange(midi_packet* packet);
bool processSerialPacket(midi_packet* packet);

const uint8_t NOTE_ON = 0x09;
const uint8_t CC      = 0x0B;

#endif // ifndef midiHandler_h
