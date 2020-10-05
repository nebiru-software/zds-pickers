#include "shifterHandler.h"
#include "midiHandler.h"
#include "settings.h"
#include "shifterTypes.h"

#define SHIFTER_HANDLER_DEBUG_MODE false

shifter_group* group;
shifter_entry* entry;

midi::StatusByte inputStatus;
midi::Channel    inputChannel;

midi::StatusByte outputStatus;
midi::Channel    outputChannel;

midi_packet noteOnPacket;

// Return false to stop the packet from being broadcast
bool shiftPacket(midi_packet* packet) {
  /**
   * NOTES:
   * packet->channel is NOT zero indexed.
   * Our entries ARE, so there will always be an offset.
   * Be careful with that.
   */
  bool    result = true;
  uint8_t i, j, num_entries;

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];

    if (group->active) {
      num_entries = group->num_entries;

#if SHIFTER_HANDLER_DEBUG_MODE
      Serial.print("Group ");
      Serial.print(i, DEC);
      Serial.print(" active with ");
      Serial.print(num_entries, DEC);
      Serial.println(" entry(s)");
#endif // if SHIFTER_HANDLER_DEBUG_MODE

      for (j = 0; j < num_entries; j++) {
        entry = &group->entries[j];

        inputStatus  = entry->input.status & 0xF0;
        inputChannel = entry->input.status & 0x0F;

        outputStatus  = entry->output.status & 0xF0;
        outputChannel = entry->output.status & 0x0F;

#if SHIFTER_HANDLER_DEBUG_MODE
        Serial.print("Checking entry #");
        Serial.print(j, DEC);
        Serial.print(" channel ");
        Serial.print(inputChannel, DEC);
        Serial.print(" and value ");
        Serial.print(entry->input.data, DEC);
        Serial.print(" against packet channel ");
        Serial.print(packet->channel - 1, DEC);
        Serial.print(" and value ");
        Serial.println(packet->data1, DEC);
#endif // if SHIFTER_HANDLER_DEBUG_MODE

        if ((inputChannel == packet->channel - 1) &&
            ((entry->input.data) == packet->data1)) {
          // Superficial match.  Channel and note num are right
          // Now check status.

#if SHIFTER_HANDLER_DEBUG_MODE
          Serial.print("Match on entry #");
          Serial.print(j, DEC);
          Serial.print(" for value ");
          Serial.println(packet->data1);
#endif // if SHIFTER_HANDLER_DEBUG_MODE

          if (packet->msgType == midi::NoteOff) {
            // Handle the note off version of a note on entry if present

            if ((inputStatus == midi::NoteOn) &&
                ((outputStatus == midi::NoteOn) || (outputStatus == midi::NoteOff))) {
              packet->channel = outputChannel + 1;

              if (outputStatus == midi::NoteOff) {
                // Broadcast the note off for the stacked note
                noteOnPacket.msgType = midi::NoteOff;
                noteOnPacket.data2   = packet->data2;
                noteOnPacket.channel = outputChannel + 1;
                noteOnPacket.data1   = entry->output.data;
                processSerialPacket(&noteOnPacket);
              } else {
                // Perform shift
                packet->data1 = entry->output.data;
              }
            } else {
              // This is an orphaned note off.  Do not broadcast
              result = false;
            }
          } else if (packet->msgType == inputStatus) {
            if (outputStatus == midi::NoteOff) {
              /* Note stack entry
                 We'll first broadcast the note on here.
                 The shifted packet is already the note off,
                 so it will broadcast when we return true. */

              noteOnPacket.msgType = midi::NoteOn;
              noteOnPacket.data2   = packet->data2;
              noteOnPacket.channel = outputChannel + 1;
              noteOnPacket.data1   = entry->output.data;
              processSerialPacket(&noteOnPacket);
            } else {
              // Perform shift
              packet->msgType = (midi::MidiType)(outputStatus);
              packet->channel = outputChannel + 1;
              packet->data1   = entry->output.data;
            }
          }
        }
      }
    }
  }
  return result;
}
