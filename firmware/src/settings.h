#ifndef settings_h
#define settings_h

#include "controlHandler.h"
#include "shifterTypes.h"

const uint8_t SERIAL_NUMBER_SIZE = 14;

#define MAX_ANALOG_INPUTS 6
#define MAX_SHIFTER_GROUPS 4
#define MAX_SHIFTER_RECORDS 112

#define ACTIVITY_LED_MODE_NORMALLY_ON 0
#define ACTIVITY_LED_MODE_NORMALLY_OFF 1
#define ACTIVITY_LED_MODE_ALWAYS_ON 2
#define ACTIVITY_LED_MODE_ALWAYS_OFF 3

const uint8_t VERSION_LOCACTION         = 0;
const uint8_t LOCATION_OF_SERIAL_NUMBER = 1;
const int16_t LOCATION_OF_FLAGS         = 15;
const uint8_t LOCATION_OF_CONTROLS      = 20;
const uint8_t LOCATION_OF_GROUPS        = 50;

extern analog_input analog_inputs[MAX_ANALOG_INPUTS];
extern shifter_group shifter_groups[MAX_SHIFTER_GROUPS];

extern bool engineActive;
extern bool proModel;
extern bool clientIsConnected;

extern bool serialMidiEnabled;
extern bool usbMidiEnabled;

void          initSettings();
void          resetSettings(bool restartToo);
void          reset();
void          hardReset(bool preserveSerial);
void          validateFirmwareVersion();
void          saveGroups();
shifter_entry createEntry();

bool          isProModel();
void          getSerialNumber(uint8_t *serial);
bool          isRegistered();
void          registerSerialNumber(uint8_t *serial,
                                   uint8_t start);

#endif // ifndef settings_h
