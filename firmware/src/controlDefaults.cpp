// #include <MIDI.h>
#include "controlDefaults.h"
#include "controlHandler.h"
#include "midiHandler.h"
#include "settings.h"
#include "shifterTypes.h"
#include <EEPROM.h>

void resetControls() {
  const uint8_t CHANNEL = 9;

  input_control jack;
  uint8_t       eepromIndex = LOCATION_OF_CONTROLS;

  for (uint8_t i = 0; i < MAX_INPUT_CONTROLS; i++) {
    jack.idx         = i;
    jack.status      = CC;
    jack.controlType = 0;
    jack.threshold   = 0;
    jack.sensitivity = 127;
    jack.latching    = true;
    jack.polarity    = false;
    jack.curve       = 0;

    switch (i) {
      case 0:
      case 1:
      case 2:
        jack.controlType = CONTROL_TYPE_BUTTON;
        jack.data        = 110 + i;
        jack.status      = CC;
        break;

      case 3:
        jack.data = 7;
      case 4:
        jack.controlType = CONTROL_TYPE_POT;
        jack.data        = 64;
        jack.status      = CC;
        jack.threshold   = 0;
        break;

      case 5:
        jack.data = 35;
      case 6:
        jack.data = 36;
      case 7:
        jack.data = 42;
      case 8:
        jack.controlType = CONTROL_TYPE_TRIGGER;
        jack.data        = 46;
        jack.status      = NOTE_ON;
        jack.threshold   = 1;
        jack.sensitivity = 24;
        break;
    }

    jack.flags = jack.latching | (jack.polarity << 1) | (jack.curve << 2) |
                 (jack.controlType << 5);

    jack.status = CHANNEL | (jack.status << 4);

    EEPROM.update(eepromIndex++, jack.status);
    EEPROM.update(eepromIndex++, jack.data);
    EEPROM.update(eepromIndex++, jack.flags);
    EEPROM.update(eepromIndex++, jack.threshold);
    EEPROM.update(eepromIndex++, jack.sensitivity);
  }
}
