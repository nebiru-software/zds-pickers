#ifndef settings_h
#define settings_h

#include "controlHandler.h"
#include "shifterTypes.h"

const uint8_t SERIAL_NUMBER_SIZE = 14;

#define MAX_INPUT_CONTROLS 9
#define MAX_SHIFTER_GROUPS 6
#define MAX_SHIFTER_RECORDS 480

#define ACTIVITY_LED_MODE_NORMALLY_ON 0
#define ACTIVITY_LED_MODE_NORMALLY_OFF 1
#define ACTIVITY_LED_MODE_ALWAYS_ON 2
#define ACTIVITY_LED_MODE_ALWAYS_OFF 3

const uint8_t VERSION_LOCACTION         = 0;
const uint8_t LOCATION_OF_SERIAL_NUMBER = 1;
const int16_t LOCATION_OF_FLAGS         = 15;
const uint8_t LOCATION_OF_CONTROLS      = 20;

const uint8_t LOCATION_OF_GROUPS = 100;

extern input_control input_controls[MAX_INPUT_CONTROLS];
extern shifter_group shifter_groups[MAX_SHIFTER_GROUPS];

extern bool engineActive;
extern bool clientIsConnected;

extern bool serialMidiEnabled;
extern bool usbMidiEnabled;

void initSettings();
void resetSettings(bool restartToo);
void restart(bool dueToReset);
void hardReset(bool preserveSerial);
void validateFirmwareVersion();
void saveGroups();

void getSerialNumber(uint8_t* serial);
bool isRegistered();
void registerSerialNumber(uint8_t* serial, uint8_t start);

#endif // ifndef settings_h
