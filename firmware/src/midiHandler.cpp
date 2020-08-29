#include "midiHandler.h"
#include "controlHandler.h"
#include "initializeEEPROM.h"
#include "midiLED.h"
#include "settings.h"
#include "shifterHandler.h"
#include "shifterTypes.h"
#include "sysEx.h"
#include "sysExHandler.h"
#include <Arduino.h>
#include <MIDI.h>
#include <MidiBridge.h>

#define MIDI_HANDLER_DEBUG_MODE false

USING_NAMESPACE_MIDI

// WARNING on leonardo / Pro Micro serial is Serial1 !!, Serial is USB
MIDIBRIDGE_CREATE_INSTANCE(HardwareSerial, Serial1, MIDI);

void serialTransmit(midiEventPacket_t tx) {
  MIDI.SendToSerial(tx);
}

void usbTransmitSysex(midi::DataByte* data, size_t size) {
  MidiUSB.write(data, size);
  MidiUSB.flush();
}

void setupMidi() {
  const uint8_t  DEVICE_BYTE       = 1;
  packetFunction transmitFunc      = &serialTransmit;
  sysexFunction  transmitSysexFunc = &usbTransmitSysex;

  MIDI.begin(MIDI_CHANNEL_OMNI);

  MIDI.turnThruOff();

  MIDI.setHandleSystemExclusive(sendSysEx);

  setupSysex(SHIFTER_DEVICE_ID, DEVICE_BYTE, transmitFunc, transmitSysexFunc);
}

bool crankUsbMidi() { // return true to have midi LED flash
  // MIDI IN over USB port
  // We're only really concerned with SysEx
  bool result = false;

  midiEventPacket_t rx;

  do {
    rx = MidiUSB.read();

    if (rx.header != 0) { // means data is present, don't confuse with
                          // midi_status, which is in byte1

      if (!processUsbByte(rx)) {
        // Pass everything through to serial DIN out
        MIDI.SendToSerial(rx);
      }
      result = true;
    }
  } while (rx.header != 0);

  return result;
}

// Returns true if a group intercepted the message.
bool handleControlChange(midi_packet* packet) {
  bool result = false;

  shifter_group* group;

  for (uint8_t i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];
    if ((group->channel + 1 == packet->channel) && (group->cc_number == packet->data1)) {
      group->active = packet->data2 != 0;
      result        = true;

      for (uint8_t j = 0; j < MAX_ANALOG_INPUTS; j++) {
        analog_input* jack = &analog_inputs[j];

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

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];
    Serial.print(group->active, DEC);
    Serial.print(" ");
  }
  Serial.println("");
#endif // if MIDI_HANDLER_DEBUG_MODE

  return result;
}

void broadcastPacket(midi_packet* packet) {
  if (serialMidiEnabled) {
    // Serial
    MIDI.send(packet->msgType, packet->data1, packet->data2, packet->channel);
  }

  if (usbMidiEnabled) { // || (packet->msgType >> 4 == midi::SystemExclusive))
                        // {
    // USB
    midiEventPacket_t usbPacket = {
        (midi::StatusByte)(packet->msgType >> 4),
        (midi::StatusByte)(packet->msgType | (packet->channel - 1)),
        packet->data1,
        packet->data2};
    // Serial.print("usb ");
    // Serial.print(usbPacket.header, DEC);
    // Serial.print(" ");
    // Serial.print(usbPacket.byte1, DEC);
    // Serial.print(" ");
    // Serial.print(usbPacket.byte2, DEC);
    // Serial.print(" ");
    // Serial.println(usbPacket.byte3, DEC);

    MidiUSB.sendMIDI(usbPacket);
    MidiUSB.flush();
  }
}

bool processSerialPacket(midi_packet* packet) {
  bool result, broadcast = false;

  switch (packet->msgType) {
    case midi::ControlChange: {
      result    = true;
      broadcast = true;

      if (!handleControlChange(packet)) {
        // If not one of our CCs, allow message to be shifted.
        broadcast = shiftPacket(packet);
      }

      break;
    }

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
  bool serialActivity = crankSerialMidi();
  bool usbActivity    = crankUsbMidi();

  if (serialActivity || usbActivity) {
    activityDetected();
  }

  processMidiLed();
}
