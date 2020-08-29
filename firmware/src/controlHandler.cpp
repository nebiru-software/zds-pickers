#include "controlHandler.h"
#include "midiHandler.h"
#include "settings.h"
#include "sysExHandler.h"

#define CONTROLS_DEBUG_MODE false

#define NORMALLY_OFF 0
#define NORMALLY_ON 1

#define MOMENTARY 0
#define LATCHING 1

#define BUTTON_DOWN 0
#define BUTTON_UP 1

#define CC_OFF 0
#define CC_ON 127

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay    = 50;

#if CONTROLS_DEBUG_MODE
static void dumpControl(analog_input* jack) {
  Serial.print("Jack # ");
  Serial.println(jack->idx);
  Serial.print("Flags ");
  Serial.println(jack->flags);
  Serial.print("Cal High ");
  Serial.println(jack->calibrationHigh);
  Serial.print("Cal Low ");
  Serial.println(jack->calibrationLow);
  Serial.print("Active ");
  Serial.println(jack->active);
  Serial.print("Latching ");
  Serial.println(jack->latching);
  Serial.print("Polarity ");
  Serial.println(jack->polarity);
  Serial.print("Curve ");
  Serial.println(jack->curve);
  Serial.print("Type ");
  Serial.println(jack->controlType);
  Serial.print("Latched ");
  Serial.println(jack->latched);
  Serial.print("LED Pin ");
  Serial.println(jack->ledPin);
  Serial.print("Data Pin ");
  Serial.println(jack->dataPin);
  Serial.print("Status ");
  Serial.println(jack->status);
  Serial.print("Msg ");
  Serial.println(jack->status & 0xF0);
  Serial.print("Channel ");
  Serial.println(jack->status & 0x0F);
  Serial.print("Data ");
  Serial.println(jack->data);
}

#endif // if CONTROLS_DEBUG_MODE

static void broadcastCcMessage(analog_input* jack, midi::DataByte value) {
#if CONTROLS_DEBUG_MODE
  Serial.print("Broadcast CC ");
  Serial.print(jack->status & 0xF0);
  Serial.print(" for input ");
  Serial.print(jack->idx);
  Serial.print(" on channel ");
  Serial.print(jack->status & 0x0F);
  Serial.print(" Value: ");
  Serial.println(value);

// dumpControl(jack);
#endif // if CONTROLS_DEBUG_MODE

  midi_packet packet;

  packet.msgType = (midi::MidiType)(jack->status & 0xF0);
  packet.channel = (jack->status & 0x0F) + 1;
  packet.data1   = jack->data;
  packet.data2   = value;

  handleControlChange(&packet);
  processSerialPacket(&packet);
}

static void buttonStateChanged(analog_input* jack) {
  bool lightLED     = false;
  bool stateChanged = false;

#if CONTROLS_DEBUG_MODE
  Serial.print("State changed to ");
  Serial.print(jack->state);
  Serial.print(" for input ");
  Serial.println(jack->idx);
#endif // if CONTROLS_DEBUG_MODE

  if (!jack->latching) { // MOMENTARY:

    switch (jack->polarity) {
      case NORMALLY_OFF:
        lightLED = jack->state == BUTTON_DOWN;
        broadcastCcMessage(jack, jack->state == BUTTON_DOWN ? CC_ON : CC_OFF);
        stateChanged = true;
        break;
      case NORMALLY_ON:
        lightLED = jack->state == BUTTON_UP;
        broadcastCcMessage(jack, jack->state == BUTTON_UP ? CC_ON : CC_OFF);
        stateChanged = true;
        break;
    }
  } else { // LATCHING:

    // Only change state on button up
    if (jack->state == BUTTON_UP) {
      jack->latched = !jack->latched;

      lightLED = jack->latched;
      broadcastCcMessage(jack, jack->latched ? CC_ON : CC_OFF);
      stateChanged = true;
    }
  }

  if (stateChanged) {
    digitalWrite(jack->ledPin, lightLED);
    jack->ledLit = lightLED;

    if (clientIsConnected) {
      sendInternalState();
    }
  }
}

static void crankJack(analog_input* jack) {
  switch (jack->controlType) {
    case CONTROL_TYPE_BUTTON:
      bool pinReading = digitalRead(jack->dataPin);

      if (pinReading != jack->prevState) {
        lastDebounceTime = millis();
      }

      if ((millis() - lastDebounceTime) > debounceDelay) {
        if (pinReading != jack->state) {
          jack->state = pinReading;

          // fire action
          buttonStateChanged(jack);
        }
      }
      jack->prevState = pinReading;
      break;
  }
}

void initControls() {
  for (uint8_t i = 0; i < MAX_ANALOG_INPUTS; i++) {
    analog_input* jack = &analog_inputs[i];

    if (jack->active) {
      pinMode(jack->dataPin, INPUT_PULLUP);

      if (jack->ledPin != 255) {
        pinMode(jack->ledPin, OUTPUT);
      }
    }

#if CONTROLS_DEBUG_MODE

// dumpControl(jack);
#endif // if CONTROLS_DEBUG_MODE
  }

  sendInternalState();
}

void crankInputJacks() {
  for (uint8_t i = 0; i < MAX_ANALOG_INPUTS; i++) {
    analog_input* jack = &analog_inputs[i];

    if (jack->active) {
      crankJack(jack);
    }
  }
}
