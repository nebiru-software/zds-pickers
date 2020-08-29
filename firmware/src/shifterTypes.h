#ifndef shifterTypes_h
#define shifterTypes_h

#include <Arduino.h>
#include <MIDI.h>

struct midi_message {
   midi::StatusByte status;
   midi::DataByte data;
};

struct shifter_entry {
   midi_message input;
   midi_message output;
};

struct shifter_group {
   midi::Channel channel;
   midi::DataByte cc_number;
   uint8_t num_entries;
   shifter_entry *entries = NULL;

   bool active;
};

typedef struct {
   midi::MidiType msgType;
   midi::Channel channel;
   midi::DataByte data1;
   midi::DataByte data2;
} midi_packet;

#endif // ifndef shifterTypes_h
