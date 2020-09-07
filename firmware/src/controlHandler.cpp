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

unsigned long lastStartHitTime = 0;
unsigned long lastEndHitTime   = 0;
uint16_t      loopTimes        = 0;
const uint8_t triggerMaskTime  = 100;
const uint8_t pedalMaskTime    = 255;
const uint8_t scanTime         = 20;

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

static void broadcastCcMessage(input_control* jack, midi::DataByte value) {
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
      break;

    case CONTROL_TYPE_POT:
      broadcastCcMessage(jack, jack->reading);
      stateChanged = true;
      break;

    case CONTROL_TYPE_TRIGGER:
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
  // Analog inputs have an LSB (out of 10 bits) or so of noise,
  // leading to "chatter" in the change detector logic.
  // Shifting off the 2 LSBs to remove it
  // This also brings the value into the range 0-128
  uint16_t apinReading = analogRead(jack->dataPin);

  if ((apinReading > jack->rawThreshold) && (loopTimes == 0) &&
      (lastStartHitTime - lastEndHitTime < pedalMaskTime)) {
    uint16_t ccValue = map(apinReading, jack->rawThreshold, jack->rawSensitivity, 0, 127);
    if (abs(ccValue - jack->reading) > 1) {
      jack->reading = ccValue;

      Serial.print(" C ");
      Serial.print(ccValue);

      // fire action
      // buttonStateChanged(jack);
    }
  }
}

static void crankTrigger(input_control* jack) {
  uint16_t apinReading = analogRead(jack->dataPin);

  if (apinReading > jack->rawThreshold) {
    if (loopTimes == 0) {
      lastStartHitTime = millis();

      if (lastStartHitTime - lastEndHitTime < triggerMaskTime) {
        // We're still within the mask time from the last hit.
        // Ignore to avoid double hits
        return;
      } else {
        jack->reading = apinReading; // first peak
        loopTimes     = 1;           // start scan trigger
      }
    }
  }

  // peak scan start
  if (loopTimes > 0) {
    if (apinReading > jack->reading) {
      jack->reading = apinReading;
    }
    loopTimes++;

    // scan end
    if (millis() - lastStartHitTime >= scanTime) {
      lastEndHitTime = millis();
      // jack->reading =
      //     map(jack->reading, jack->rawThreshold, jack->rawSensitivity, 0, 127);

#if CONTROLS_DEBUG_MODE
      Serial.print("[Hit] velocity : ");
      Serial.print(jack->reading);
      Serial.print(", loopTimes : ");
      Serial.print(loopTimes);
      Serial.print(", ScanTime(ms) : ");
      Serial.println((lastEndHitTime - lastStartHitTime));
#endif // if CONTROLS_DEBUG_MODE

      Serial.print(" T ");
      Serial.print(jack->reading);

      // fire action
      // TODO: map() sensitivity
      buttonStateChanged(jack);

      loopTimes = 0;
    }
  }
}

static void crankJack(input_control* jack) {
  switch (jack->controlType) {
    case CONTROL_TYPE_BUTTON:
      crankButton(jack);
      break;

    case CONTROL_TYPE_POT:
      crankExpressionPedal(jack);
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
          pinMode(jack->dataPin, INPUT);
          break;
      }
    }

#if CONTROLS_DEBUG_MODE

// dumpControl(jack);
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
    }

    if (jack->active) {
      crankJack(jack);
    }
  }
}
