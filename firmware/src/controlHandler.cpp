#include "controlHandler.h"
#include "midiHandler.h"
#include "midiLED.h"
#include "settings.h"
#include "sysEx.h"
#include <Metro.h>
#include <ResponsiveAnalogRead.h>

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

unsigned long lastStartHitTime = 0;
unsigned long lastEndHitTime   = 0;
uint16_t      loopTimes        = 0;
const uint8_t triggerMaskTime  = 100;
const uint8_t pedalMaskTime    = 255;
const uint8_t scanTime         = 60; // 20;

/**
 * We don't check the analog jacks on every loop.
 */
static class Metro analog_check_metro(20);

#if CONTROLS_DEBUG_MODE
static void dumpControl(input_control* jack) {
  Serial.print("Jack # ");
  Serial.println(jack->idx);
  Serial.print("Flags ");
  Serial.println(jack->flags);
  Serial.print("Cal High ");
  Serial.println(jack->sensitivity);
  Serial.print("Cal Low ");
  Serial.println(jack->threshold);
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

static void broadcastMidiMessage(input_control* jack, midi::DataByte value) {
#if CONTROLS_DEBUG_MODE
  Serial.print("Broadcast CC/Note ");
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

  if (jack->status == CC) {
    handleControlChange(&packet);
  }

  processSerialPacket(&packet);
}

static void buttonStateChanged(input_control* jack) {
  bool lightLED     = false;
  bool stateChanged = false;

#if CONTROLS_DEBUG_MODE
  // Serial.print("State changed to ");
  // Serial.print(jack->state);
  // Serial.print(" for input ");
  // Serial.println(jack->idx);
#endif // if CONTROLS_DEBUG_MODE

  switch (jack->controlType) {
    case CONTROL_TYPE_BUTTON:
      if (!jack->latching) { // MOMENTARY:

        switch (jack->polarity) {
          case NORMALLY_OFF:
            lightLED = jack->state == BUTTON_DOWN;
            broadcastMidiMessage(jack, jack->state == BUTTON_DOWN ? CC_ON : CC_OFF);
            stateChanged = true;
            break;
          case NORMALLY_ON:
            lightLED = jack->state == BUTTON_UP;
            broadcastMidiMessage(jack, jack->state == BUTTON_UP ? CC_ON : CC_OFF);
            stateChanged = true;
            break;
        }
      } else { // LATCHING:

        // Only change state on button up
        if (jack->state == BUTTON_UP) {
          jack->latched = !jack->latched;

          lightLED = jack->latched;
          broadcastMidiMessage(jack, jack->latched ? CC_ON : CC_OFF);
          stateChanged = true;
        }
      }
      break;

    case CONTROL_TYPE_POT:
      broadcastMidiMessage(jack, jack->reading);
      stateChanged = true;
      break;

    case CONTROL_TYPE_TRIGGER:
      broadcastMidiMessage(jack, jack->reading);
      activityDetected();
      break;
  }

  if (stateChanged) {
    if (jack->ledPin != 255) {
      digitalWrite(jack->ledPin, lightLED);
      jack->ledLit = lightLED;
    }

    if (clientIsConnected) {
      sendInternalState();
    }
  }
}

static void crankButton(input_control* jack) {
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
}

static void crankExpressionPedal(input_control* jack) {
  jack->analog.update();

  if (jack->analog.hasChanged()) {
    uint16_t apinReading = jack->analog.getValue();
    jack->reading = map(apinReading, jack->rawThreshold, jack->rawSensitivity, 0, 127);

    // fire action
    buttonStateChanged(jack);

#if CONTROLS_DEBUG_MODE
    Serial.print(apinReading);
    Serial.print("\tCC ");
    Serial.print(jack->reading);
    Serial.println("");
#endif // if CONTROLS_DEBUG_MODE
  }
}

static void crankTrigger(input_control* jack) {
  uint16_t apinReading = analogRead(jack->dataPin);

  if (jack->scanState == 0) {
    // IDLE state: if any reading is above a threshold, begin peak
    if (apinReading > jack->rawThreshold) {
      jack->scanState = 1;
      jack->scanPeak  = apinReading;
      jack->scanTime  = 0;
    }
  } else if (jack->scanState == 1) {
    // Peak Tracking state: for 10 ms, capture largest reading
    if (apinReading > jack->scanPeak) {
      jack->scanPeak = apinReading;
    }
    if (jack->scanTime >= 10) {
      jack->reading =
          map(jack->scanPeak, jack->rawThreshold, jack->rawSensitivity, 0, 127);
      jack->scanState = 2;
      jack->scanTime  = 0;

#if CONTROLS_DEBUG_MODE
      Serial.print("[Hit] ");
      Serial.print("pin: ");
      Serial.print(jack->dataPin);
      Serial.print(", raw: ");
      Serial.print(jack->scanPeak);
      Serial.print(", thresh: ");
      Serial.print(jack->rawThreshold);
      Serial.print(", sens: ");
      Serial.print(jack->rawSensitivity);
      Serial.print(", velocity: ");
      Serial.print(jack->reading);
      Serial.println();
#endif // if CONTROLS_DEBUG_MODE

      buttonStateChanged(jack);
    }
  } else {
    // Ignore Aftershock state: wait for things to be quiet again
    if (apinReading > jack->rawThreshold) {
      jack->scanTime = 0; // keep resetting timer if above threshold
    } else if (jack->scanTime > 30) {
      jack->scanState = 0; // go back to idle after 30 ms below threshold
    }
  }
}

static void crankJack(input_control* jack) {
  switch (jack->controlType) {
    case CONTROL_TYPE_BUTTON:
      crankButton(jack);
      break;

    case CONTROL_TYPE_POT:
      if (analog_check_metro.check()) {
        crankExpressionPedal(jack);
      }
      break;

    case CONTROL_TYPE_TRIGGER:
      crankTrigger(jack);
      break;
  }
}

void initControls() {
  for (uint8_t i = 0; i < MAX_INPUT_CONTROLS; i++) {
    input_control* jack = &input_controls[i];

    if (jack->active) {
      switch (jack->controlType) {
        case CONTROL_TYPE_BUTTON:
          pinMode(jack->dataPin, INPUT_PULLUP);
          if (jack->ledPin != 255) {
            pinMode(jack->ledPin, OUTPUT);
          }
          break;
        case CONTROL_TYPE_TRIGGER:
        case CONTROL_TYPE_POT:
          break;
      }
    }

#if CONTROLS_DEBUG_MODE
    dumpControl(jack);
#endif // if CONTROLS_DEBUG_MODE
  }

  sendInternalState();
}

void crankInputJacks() {
  input_control* jack;
  for (uint8_t i = 0; i < MAX_INPUT_CONTROLS; i++) {
    switch (i) {
      case 0:
        jack = &input_controls[0];
        break;
      case 1:
        jack = &input_controls[3];
        break;
      case 2:
        jack = &input_controls[1];
        break;
      case 3:
        jack = &input_controls[4];
        break;
      case 4:
        jack = &input_controls[2];
        break;
      case 5:
        jack = &input_controls[5];
        break;
      case 6:
        jack = &input_controls[6];
        break;
    }

    if (jack->active) {
      crankJack(jack);
    }
  }
}
