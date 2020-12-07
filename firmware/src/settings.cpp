/*
    E E P R O M   M E M O R Y   M A P

    0
        Version number.  We store this in memory to compare to the hardcoded
        value later on.  This is to be able to detect firmware upgrades and
        take any necessary actions.

    1 - 14
        Serial number

    15 - 19
        15 is settings flags, rest are reserved

    20 - 49
        Input controls.  Six controls are stored sequentially.  These currently
        consume 5 bytes each, for a total of 30.

    50 - ~512
        Groups, 4 total. Each group needs three bytes for the number of entries,
        channel # and CC #.  Whatever's left (460B) is devoted to entries.
        Each entry needs 4 bytes which gives us a max of 115 entries.
        We've capped it at 112 in order to give us a little breathing room at
        the end.
 */

#include "settings.h"
#include "controlDefaults.h"
#include "controlHandler.h"
#include "groupDefaults.h"
#include "initializeEEPROM.h"
#include "midiLED.h"
#include "shifterTypes.h"
#include "sysEx.h"
#include <Arduino.h>
#include <EEPROM.h>
#include <ResponsiveAnalogRead.h>

#define SETTINGS_DEBUG_MODE false

#define CHANNEL_MASK 0x0F // 00001111 (from input_control->status)
#define STATUS_MASK 0xF0  // 11110000 (from input_control->status)

#define LATCHING_MASK 1            // 00000001 (from input_control->flags)
#define POLARITY_MASK 2            // 00000010 (from input_control->flags)
#define CURVE_MASK 28              // 00011100 (from input_control->flags)
#define CONTROL_TYPE_MASK 96       // 01100000 (from input_control->flags)
#define ACTIVITY_LED_MASK 3        // 00000011
#define SERIAL_MIDI_ENABLED_MASK 4 // 00000100
#define USB_MIDI_ENABLED_MASK 8    // 00001000

input_control input_controls[MAX_INPUT_CONTROLS];

shifter_group shifter_groups[MAX_SHIFTER_GROUPS];

bool engineActive      = false;
bool clientIsConnected = false;

bool serialMidiEnabled = true;
bool usbMidiEnabled    = true;

static int eepromIndex = 0;

// cppcheck-suppress unusedFunction
void hardReset(bool preserveSerial) {
  if (preserveSerial) {
    for (uint16_t i = LOCATION_OF_CONTROLS; i < MAX_BYTES; i++) {
      EEPROM.update(i, 255);
    }
  } else {
    for (uint16_t i = 0; i < MAX_BYTES; i++) {
      EEPROM.update(i, 255);
    }
  }
}

static uint8_t nextByte() {
  return EEPROM.read(eepromIndex++);
}

static void writeNextByte(uint8_t value) {
  EEPROM.update(eepromIndex++, value);
}

static void loadMIDIMessage(midi_message* message) {
  message->status = nextByte();
  message->data   = nextByte();
}

// #if SETTINGS_DEBUG_MODE
static void dumpMIDIMessage(midi_message* message) {
  Serial.print(" Channel:");
  Serial.print(message->status & CHANNEL_MASK);
  Serial.print(" Status:");
  Serial.print(message->status & STATUS_MASK);
  Serial.print(" Value:");
  Serial.print(message->data);
}

// #endif // if SETTINGS_DEBUG_MODE

static bool loadInput(input_control* jack, uint8_t idx) {
  loadMIDIMessage(jack);

  jack->idx = idx;

  jack->flags       = nextByte();
  jack->threshold   = nextByte();
  jack->sensitivity = nextByte();
  jack->active      = true; //(idx < 4); // || proModel;
  jack->latching    = jack->flags & LATCHING_MASK;
  jack->polarity    = (jack->flags & POLARITY_MASK) >> 1;
  jack->curve       = (jack->flags & CURVE_MASK) >> 2;
  jack->controlType = (jack->flags & CONTROL_TYPE_MASK) >> 5;

  jack->prevState = NULL;
  jack->state     = 0;
  jack->reading   = 0;
  jack->latched   = false;
  jack->ledLit    = false;

  if (jack->latching) {
    jack->latched = !jack->polarity;
  }

  switch (idx) {
    case 0:
      jack->dataPin = 2;
      jack->ledPin  = 5;
      break;
    case 1:
      jack->dataPin = 3;
      jack->ledPin  = 6;
      break;
    case 2:
      jack->dataPin = 4;
      jack->ledPin  = 7;
      break;
    case 3:
      jack->dataPin = 16;
      jack->ledPin  = 255;
      jack->analog  = ResponsiveAnalogRead(16, false);
      jack->analog.setAnalogResolution(1023);
      jack->analog.enableEdgeSnap();
      break;
    case 4:
      jack->dataPin = 15;
      jack->ledPin  = 255;
      jack->analog  = ResponsiveAnalogRead(15, false);
      jack->analog.setAnalogResolution(1023);
      jack->analog.enableEdgeSnap();
      break;
    case 5:
      jack->dataPin   = 17;
      jack->ledPin    = 255;
      jack->scanState = 0;
      break;
    case 6:
      jack->dataPin   = 18;
      jack->ledPin    = 255;
      jack->scanState = 0;
      break;
  }

  jack->rawThreshold   = map(jack->threshold, 0, 127, 0, 1023);
  jack->rawSensitivity = map(jack->sensitivity, 0, 127, 0, 1023);

  return true;
}

static void loadInputs() {
#if SETTINGS_DEBUG_MODE
  Serial.print("Loading ");
  Serial.print(MAX_INPUT_CONTROLS);
  Serial.println(" inputs...  ");
#endif // if SETTINGS_DEBUG_MODE

  for (uint8_t i = 0; i < MAX_INPUT_CONTROLS; i++) {
    if (!loadInput(&input_controls[i], i)) {
      break;
    }

    // #if SETTINGS_DEBUG_MODE
    Serial.print("Input #");
    Serial.print(i);
    dumpMIDIMessage(&input_controls[i]);
    Serial.print(" Active:");
    Serial.print(input_controls[i].active);
    Serial.print(" Flags:");
    Serial.print(input_controls[i].flags);
    Serial.print(" Type:");
    Serial.print(input_controls[i].controlType);
    Serial.print(" Threshold:");
    Serial.print(input_controls[i].rawThreshold);
    Serial.print(" Sensitivity:");
    Serial.println(input_controls[i].rawSensitivity);
    // #endif // if SETTINGS_DEBUG_MODE
  }

#if SETTINGS_DEBUG_MODE
  Serial.println("Done.");
#endif // if SETTINGS_DEBUG_MODE
}

static void loadShifterEntry(shifter_entry* entry) {
  loadMIDIMessage(&entry->input);
  loadMIDIMessage(&entry->output);
}

static void loadShifterEntries(shifter_entry* entries, const uint8_t count) {
#if SETTINGS_DEBUG_MODE
  Serial.print("Loading ");
  Serial.print(count);
  Serial.print(" entries...  ");
#endif // if SETTINGS_DEBUG_MODE

  for (uint8_t i = 0; i < count; i++) {
    loadShifterEntry(&entries[i]);

#if SETTINGS_DEBUG_MODE
    Serial.print("Input #");
    Serial.print(i);
    dumpMIDIMessage(&entries[i].input);
    Serial.print("  Output: ");
    dumpMIDIMessage(&entries[i].output);
    Serial.println("");
#endif // if SETTINGS_DEBUG_MODE
  }

#if SETTINGS_DEBUG_MODE
  Serial.println("Done.");
#endif // if SETTINGS_DEBUG_MODE
}

static void loadGroups() {
  uint8_t        i;
  shifter_group* group;

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group              = &shifter_groups[i];
    group->num_entries = nextByte();
    group->entries     = new shifter_entry[group->num_entries];
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group          = &shifter_groups[i];
    group->channel = nextByte();
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group            = &shifter_groups[i];
    group->cc_number = nextByte();
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    group = &shifter_groups[i];
    loadShifterEntries(group->entries, group->num_entries);

    group->active = false;
  }
}

void saveGroups() {
  uint8_t i, j;

  eepromIndex = LOCATION_OF_GROUPS;

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    writeNextByte(shifter_groups[i].num_entries);
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    writeNextByte(shifter_groups[i].channel);
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    writeNextByte(shifter_groups[i].cc_number);
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    for (j = 0; j < shifter_groups[i].num_entries; j++) {
      writeNextByte(shifter_groups[i].entries[j].input.status);
      writeNextByte(shifter_groups[i].entries[j].input.data);
      writeNextByte(shifter_groups[i].entries[j].output.status);
      writeNextByte(shifter_groups[i].entries[j].output.data);
    }
  }
}

void loadSettings(bool dueToReset) {
  eepromIndex = LOCATION_OF_GROUPS;
  loadGroups();

  eepromIndex = LOCATION_OF_CONTROLS;
  loadInputs();

  uint8_t flags = EEPROM.read(LOCATION_OF_FLAGS);

  setupMidiLed(flags & ACTIVITY_LED_MASK);

  serialMidiEnabled = flags & SERIAL_MIDI_ENABLED_MASK;
  usbMidiEnabled    = flags & USB_MIDI_ENABLED_MASK;

  if (dueToReset) {
#if SETTINGS_DEBUG_MODE
    Serial.println("Sending settings via SysEx");
#endif // if SETTINGS_DEBUG_MODE

    // Send basic settings out over SysEx so client app refreshes
    sendInternalState();
  }
}

void startup() {
  engineActive = false;

  loadSettings(false);

  delay(200);

  initControls();

  engineActive = true;
}

void restart(bool dueToReset) {
  loadSettings(dueToReset);
  delay(200);
#if SETTINGS_DEBUG_MODE
  Serial.println("Initializing controls");
#endif // if SETTINGS_DEBUG_MODE
       // init_controls();
}

void resetSettings(bool andRestart) {
  uint16_t i;
  uint8_t  start = LOCATION_OF_CONTROLS;

  // To ensure we never send a value exceeding 127 over sysex, set all bytes
  // to 0 (leave serial intact)
  for (i = start; i < MAX_BYTES; i++) {
    EEPROM.update(i, 0);
  }

  resetControls();

  resetGroups();

  EEPROM.update(LOCATION_OF_FLAGS, 12); // 00001100

  if (andRestart) {
    restart(true);
  }
}

void initSettings() {
  engineActive = false;

  delay(200);

  if (initEEPROM()) {
    resetSettings(true);
  } else {
    startup();
  }

  engineActive = true;
}

void getSerialNumber(uint8_t* serial) {
  if (serial == NULL)
    return;

  for (uint8_t i = 0; i < SERIAL_NUMBER_SIZE; i++) {
    serial[i] = EEPROM.read(LOCATION_OF_SERIAL_NUMBER + i);
  }
}

bool isRegistered() {
  bool result   = false;
  bool badBytes = false;

  for (uint8_t i = 0; i < SERIAL_NUMBER_SIZE; i++) {
    uint8_t val = EEPROM.read(LOCATION_OF_SERIAL_NUMBER + i);

    /**
     * TODO
     * Is it worth pulling in the std::regexp library for this?
     * Serial numbers should match /[a-z]|[A-Z]|[\d-_]/g
     */

    if (val > 0) {
      if ((val == 45) || (val == 95) || ((val >= 65) && (val <= 90)) ||
          ((val >= 97) && (val <= 122)) || ((val >= 48) && (val <= 57))) {
        result = true;
      } else {
        badBytes = true;
      }
    }
  }
  return result && !badBytes;
}

void registerSerialNumber(uint8_t* data, uint8_t start) {
  for (uint8_t i = 0; i < SERIAL_NUMBER_SIZE; i++) {
    EEPROM.update(LOCATION_OF_SERIAL_NUMBER + i, data[start + i]);
  }
}

void validateFirmwareVersion() {
  uint8_t stored_version = EEPROM.read(0);

  if (stored_version != CURRENT_VERSION) {
    // Here we can take any required actions during an upgrade.

    EEPROM.update(0, CURRENT_VERSION);
  }
}
