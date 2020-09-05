// #include <MIDI.h>
#include "controlDefaults.h"
#include "controlHandler.h"
#include "settings.h"
#include "shifterTypes.h"
#include <EEPROM.h>

void resetControls() {
  const uint8_t CHANNEL = 9;
  const uint8_t NOTE_ON = 0x09;
  const uint8_t CC      = 0x0B;

  input_control jack;
  uint8_t       eepromIndex = LOCATION_OF_CONTROLS;

  for (uint8_t i = 0; i < MAX_INPUT_CONTROLS; i++) {
    jack.idx    = i;
    jack.active = true;
    jack.status = CC;
    jack.data   = 110 + i;

    // jack.flags = 1;
    jack.calibrationLow  = 0;
    jack.calibrationHigh = 127;
    jack.latching        = false;
    jack.polarity        = false;
    jack.curve           = 0;

    switch (i) {
      case 0:
      case 1:
      case 2:
        jack.controlType = CONTROL_TYPE_BUTTON;
        jack.status      = CC;
        break;

      case 3:
      case 4:
        jack.controlType = CONTROL_TYPE_POT;
        jack.status      = CC;
        break;

      case 5:
        jack.controlType = CONTROL_TYPE_TRIGGER;
        jack.status      = NOTE_ON;
        break;
    }

    jack.flags = jack.latching | (jack.polarity << 1) | (jack.curve << 2) |
                 (jack.controlType << 5);

    jack.status = CHANNEL | (jack.status << 4);

    EEPROM.update(eepromIndex++, jack.status);
    EEPROM.update(eepromIndex++, jack.data);
    EEPROM.update(eepromIndex++, jack.flags);
    EEPROM.update(eepromIndex++, jack.calibrationLow);
    EEPROM.update(eepromIndex++, jack.calibrationHigh);
  }
}
