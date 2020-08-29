// #include <MIDI.h>
#include <EEPROM.h>
#include "controlDefaults.h"
#include "settings.h"
#include "shifterTypes.h"
#include "controlHandler.h"

void resetControls() {
  const uint8_t CHANNEL = 9;
  const uint8_t NOTE_ON = 0x09;
  const uint8_t CC      = 0x0B;

  analog_input  jack;
  uint8_t       eepromIndex = LOCATION_OF_CONTROLS;

  for (uint8_t i = 0; i < MAX_ANALOG_INPUTS; i++) {
    jack.idx    = i;
    jack.active = true;
    jack.status = CC;
    jack.data   = 110 + i;

    // jack.flags = 1;
    jack.calibrationLow = 0;
    jack.calibrationLow = 127;
    jack.latching       = false;
    jack.polarity       = false;
    jack.curve          = 0;
    jack.controlType    = CONTROL_TYPE_BUTTON;

    switch (i) {
      case 0:
      case 1:
          break;

      case 2:
          jack.active = proModel;
          break;

      case 3:
      case 4:
      case 5:
          jack.controlType = CONTROL_TYPE_TRIGGER;
          jack.active      = proModel;
          jack.status      = NOTE_ON;
          break;
    }

    jack.flags = jack.latching |
        (jack.polarity << 1) |
        (jack.curve << 2) |
        (jack.controlType << 5);

    jack.status = CHANNEL | (jack.status << 4);

    EEPROM.update(eepromIndex++, jack.status);
    EEPROM.update(eepromIndex++, jack.data);
    EEPROM.update(eepromIndex++, jack.flags);
    EEPROM.update(eepromIndex++, jack.calibrationLow);
    EEPROM.update(eepromIndex++, jack.calibrationHigh);
  }
}
