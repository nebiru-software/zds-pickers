#ifndef controlHandler_h
#define controlHandler_h

#include "shifterTypes.h"

#define CONTROL_TYPE_BUTTON 0
#define CONTROL_TYPE_POT 1
#define CONTROL_TYPE_TRIGGER 2

struct input_control : midi_message {
  // 5 bytes total (2 inherited from midi_message)

  // Stored items (EEPROM)
  uint8_t flags;
  uint8_t calibrationLow;
  uint8_t calibrationHigh;

  // Not stored.  Activates based on the "pro" pin jumper.
  bool active;

  uint8_t idx;

  bool    latching;
  uint8_t polarity;
  uint8_t curve;

  uint8_t dataPin;
  uint8_t ledPin;

  uint8_t controlType;

  bool     prevState;
  bool     state;
  uint16_t reading;
  bool     latched;
  bool     ledLit;

  unsigned long lastStartHitTime;
  unsigned long lastEndHitTime;
  uint16_t      loopTimes;
  uint8_t       maskTime;
  uint8_t       scanTime;
};

extern void initControls();
extern void crankInputJacks();

#endif // ifndef controlHandler_h