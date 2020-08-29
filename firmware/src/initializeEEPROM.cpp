#include "initializeEEPROM.h"
#include <Arduino.h>
#include <EEPROM.h>

bool initEEPROM() {
  // Byte zero is firmware -- check byte 1 for first run

  /*
      For some odd reason, some batches of Sparkfun ProMicros ship with the
      first byte of EEPROM _NOT_ set to 255.  In this case, the last byte
      usually is, so try both.
  */
  if ((EEPROM.read(0) == 255) || (EEPROM.read(511) == 255)) {
    // First time ran

#if SETTINGS_DEBUG_MODE
    Serial.println("first run -- clearing EEPROM.");
#endif // if SETTINGS_DEBUG_MODE

    // To ensure we never send a value exceeding 127 over sysex,
    // set all bytes to 0
    for (uint16_t i = 1; i < MAX_BYTES; i++) {
      EEPROM.update(i, 0);
    }

    return true;
  }
  return false;
}
