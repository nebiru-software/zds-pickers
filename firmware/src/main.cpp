#define PERFORM_HARD_RESET false
#define PRESERVE_SERIAL false

#if PERFORM_HARD_RESET
#  include <EEPROM.h>
#endif // if PERFORM_HARD_RESET

#include "controlHandler.h"
#include "midiHandler.h"
#include "settings.h"

void setup() {
#if PERFORM_HARD_RESET
  hardReset(PRESERVE_SERIAL);
#else  // if PERFORM_HARD_RESET
  //
  delay(400);
  validateFirmwareVersion();

  setupMidi();

  initSettings();
#endif // if PERFORM_HARD_RESET
}

void loop() {
#if !PERFORM_HARD_RESET
  if (engineActive) {
    // Process inputs first as they can generate MIDI events
    crankInputJacks();

    crankMidi();
  }
#else  // if !PERFORM_HARD_RESET

  /*
   * Dump the contents of EEPROM to serial every 5 seconds
   */
  delay(5000);

  for (uint16_t i = 1; i < 512; i++) {
    Serial.print(EEPROM.read(i));
    Serial.print(" ");
  }
  Serial.println(".");
#endif // if PERFORM_HARD_RESET
}
