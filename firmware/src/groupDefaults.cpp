#include "groupDefaults.h"
#include "settings.h"
#include <EEPROM.h>

void resetGroups() {
  uint8_t  i;
  uint16_t eepromIndex = LOCATION_OF_GROUPS;

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    // Number of entries
    EEPROM.update(eepromIndex++, 0);
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    // Channel
    EEPROM.update(eepromIndex++, 9);
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    // CC Number
    EEPROM.update(eepromIndex++, 110 + i);
  }
}
