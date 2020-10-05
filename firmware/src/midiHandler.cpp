#include "midiHandler.h"
#include "controlHandler.h"
#include "initializeEEPROM.h"
#include "midiLED.h"
#include "settings.h"
#include "shifterHandler.h"
#include "shifterTypes.h"
#include "sysEx.h"
#include <Arduino.h>
#include <MIDI.h>
#include <MidiBridge.h>

#define MIDI_HANDLER_DEBUG_MODE false

MIDI_CREATE_INSTANCE(HardwareSerial, Serial1, MIDI);

void setupMidi() {
  MIDI.begin(MIDI_CHANNEL_OMNI);

  MIDI.setHandleSystemExclusive(sendSysEx);
  MIDI.turnThruOff();

  usbMIDI.setHandleSystemExclusive(receiveUsbSysEx);
}

void receiveUsbSysEx(const byte* data, uint16_t length, bool last) {
  for (int i = 0; i < length; i++) {
    sysexReceiveByte(data[i]);
  }

  // Passthrough to Serial DIN connection
  MIDI.sendSysEx(length, data, true);
}

bool crankUsbMidi() { // return true to have midi LED flash
  bool result = false;

  // If we don't flush the buffer by reading, the host will lock up.
  // https://forum.pjrc.com/threads/24179-Teensy-3-Ableton-Analog-CC-causes-midi-crash
  while (usbMIDI.read()) {
    result = true;
  }

  return result;
}

void broadcastPacket(midi_packet* packet) {
  if (serialMidiEnabled) {
    // Serial
    MIDI.send(packet->msgType, packet->data1, packet->data2, packet->channel);
  }

  if (usbMidiEnabled) {
    // USB
    usbMIDI.send(packet->msgType, packet->data1, packet->data2, packet->channel, 0);
    usbMIDI.send_now();
  }
}

bool processSerialPacket(midi_packet* packet) {
  bool result, broadcast = false;

  switch (packet->msgType) {
    case midi::SystemExclusive: {
      // blink to show SysEx is being received / passing through
      // We handle SysEx separately by connecting to the callback
      // MIDI.setHandleSystemExclusive().
      // This basically just funnels Serial Sysex through to USB via
      // sendSysEx()
      // TODO: pass Thru to serial out
      result = true;
      break;
    }

    case midi::ControlChange: {
      result    = true;
      broadcast = true;

      if (!handleControlChange(packet)) {
        // If not one of our CCs, allow message to be shifted.
        broadcast = shiftPacket(packet);
      }

      break;
    }

    case midi::NoteOn:
    case midi::NoteOff:
    case midi::AfterTouchPoly:
    case midi::ProgramChange:
    case midi::AfterTouchChannel: {
      result = true;

      broadcast = shiftPacket(packet);
      break;
    }

    case midi::PitchBend:
    case midi::TimeCodeQuarterFrame:
    case midi::SongPosition:
    case midi::SongSelect:
    case midi::TuneRequest:
    case midi::Clock:
    case midi::Start:
    case midi::Continue:
    case midi::Stop:
    case midi::ActiveSensing:
    case midi::SystemReset:

      // TODO: pass Thru to serial out
      result    = false;
      broadcast = true;
      break;

    case midi::InvalidType:
      result    = false;
      broadcast = false;
      break;

    default:
      result    = false;
      broadcast = false;
      break;
  }

  if (broadcast) {
    broadcastPacket(packet);
  }

  return result;
}

bool crankSerialMidi() { // return true to have midi LED flash
  bool result = false;

  midi_packet packet;

  while (MIDI.read()) {
    packet.msgType = MIDI.getType();
    packet.channel = MIDI.getChannel();
    packet.data1   = MIDI.getData1();
    packet.data2   = MIDI.getData2();

    result = processSerialPacket(&packet) || result;
  }

  return result;
}

void crankMidi() {
  bool usbActivity    = crankUsbMidi();
  bool serialActivity = crankSerialMidi();

  if (usbActivity || serialActivity) {
    activityDetected();
  }

  processMidiLed();
}

size_t unpack(uint8_t* data, uint8_t* sysex, size_t len) {
  const uint8_t MIDI_SYSEX_FIRST_BYTE = 1;
  const uint8_t NV_VERSION            = 2;
  size_t        c;
  size_t        i;
  size_t        workingByte;
  size_t        count      = 0;
  size_t        sysexState = MIDI_SYSEX_FIRST_BYTE;
  size_t        cnt        = 0;

  for (i = 0; i < len; i++) {
    c = data[i];

    switch (sysexState) {
      case MIDI_SYSEX_FIRST_BYTE:
        workingByte = c;
        count       = 0;
        sysexState  = NV_VERSION;
        break;

      case NV_VERSION:
        sysex[cnt++] = c | (workingByte & (1 << count) ? 0x80 : 0);

        if (++count == 7) {
          sysexState = MIDI_SYSEX_FIRST_BYTE;
        }
        break;

        // default:
    }
  }
  return cnt;
}

size_t pack(uint8_t* data, uint8_t* sysex, size_t len, size_t maxSysexSize) {
  size_t cnt = 0;
  size_t i;
  size_t j;
  size_t c;

  sysex[cnt++] = SHIFTER_PRO_DEVICE_ID;
  sysex[cnt++] = CURRENT_VERSION;

  for (i = 0; i < len;) {
    for (j = 0, c = 0; j < 7 && i < len; ++j) {
      if (data[i++] & 0x80) {
        c |= 1 << j;
      }
    }

    sysex[cnt++] = c;

    while (j && cnt < maxSysexSize) {
      sysex[cnt++] = data[i - j--] & ~0x80;
    }
  }

  return cnt;
}

void sendSysEx(byte* data, size_t len) {
  if ((data == NULL) || (len == 0))
    return;

  size_t  maxSysexSize = ceil(len * 0.143 + 2 + len);
  uint8_t sysex[maxSysexSize];
  size_t  cnt = pack(data, sysex, len, maxSysexSize);

#if MIDI_HANDLER_DEBUG_MODE
  Serial.print("Packed: ");
  Serial.print(cnt);
  Serial.print(" Max size:");
  Serial.println(maxSysexSize);

// for (size_t i = 0; i < len; i++) {
//     Serial.print(data[i]);
//     Serial.print(" ");
// }
// Serial.println("");
#endif // if MIDI_HANDLER_DEBUG_MODE

  usbMIDI.sendSysEx(cnt, sysex, 0);
}

// ***************************************************

// Returns true if a group intercepted the message.
bool handleControlChange(midi_packet* packet) {
  bool result = false;

  shifter_group* group;

  for (uint8_t i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];
    if ((group->channel + 1 == packet->channel) && (group->cc_number == packet->data1)) {
      group->active = packet->data2 != 0;
      result        = true;

      for (uint8_t j = 0; j < MAX_INPUT_CONTROLS; j++) {
        input_control* jack = &input_controls[j];

#if MIDI_HANDLER_DEBUG_MODE
        if (jack->active) {
          Serial.print("Checking jack: ");
          Serial.print(jack->active, DEC);
          Serial.print(" ");
          Serial.print(jack->status & 0x0F, DEC);
          Serial.print(" ");
          Serial.print(group->channel, DEC);
          Serial.print(" ");
          Serial.print(jack->data, DEC);
          Serial.print(" ");
          Serial.println(group->cc_number, DEC);
        }
#endif

        if (jack->active && (jack->status & 0x0F) == (group->channel) &&
            jack->data == group->cc_number) {
          jack->latched = group->active;
          digitalWrite(jack->ledPin, group->active);
          jack->ledLit = group->active;

          if (clientIsConnected) {
            sendInternalState();
          }
        }
      }
    }
  }

#if MIDI_HANDLER_DEBUG_MODE
  Serial.print("CC received: #");
  Serial.print(packet->data1, DEC);
  Serial.print(" on channel ");
  Serial.print(packet->channel, DEC);

  if (result) {
    Serial.print(" -- One of ours");
  } else {
    Serial.print(" -- Not one of ours");
  }

  Serial.print(".  Group active statuses:");

  for (uint8_t i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];
    Serial.print(group->active, DEC);
    Serial.print(" ");
  }
  Serial.println("");
#endif // if MIDI_HANDLER_DEBUG_MODE

  return result;
}
