#include "sysEx.h"
#include "initializeEEPROM.h"
#include "midiHandler.h"
#include "settings.h"
#include <Arduino.h>
#include <EEPROM.h>
#include <MidiBridge.h>

#define SYSEX_DEBUG_MODE false

#define DEVICE_BYTE 1
#define VERSION_BYTE 2

bool       sysexReceiving = false;
uint8_t    sysexReceivingDeviceId;
static int count; // number of actual bytes we've received

static const int MAX_SYSEX_BYTES = 512;

static uint8_t rawData[MAX_SYSEX_BYTES];

static bool foundDevice;
static bool foundVersion;
static int  rawDataIndex;

void sendSimpleMessage(midi::DataByte msg, midi::DataByte value) {
  midi::DataByte data[2] = {msg, value};

  sendSysEx(data, 2);
}

static void sendModel() {
#if SYSEX_DEBUG_MODE
  Serial.println("Sending model.");
#endif // if SYSEX_DEBUG_MODE
  sendSimpleMessage(SYSEX_MSG_RECEIVE_MODEL, 2);
}

static void sendVersion(midi::DataByte* data, int size) {
#if SYSEX_DEBUG_MODE
  Serial.println("Sending version info.");
#endif // if SYSEX_DEBUG_MODE

  byte    i;
  uint8_t response[SERIAL_NUMBER_SIZE + 2];
  uint8_t serial[SERIAL_NUMBER_SIZE];
  uint8_t j = 0;

  if (!isRegistered()) {
    // We will register the suggested serial that was passed in rawData
    registerSerialNumber(data, 1);
  }

  // Load with the stored or newly registered serial number
  getSerialNumber(serial);

  // Include requested data (version)
  response[j++] = SYSEX_MSG_RECEIVE_VERSION;
  response[j++] = CURRENT_VERSION;

  // include the serial number
  for (i = 0; i < SERIAL_NUMBER_SIZE; i++) {
    response[j++] = serial[i];
  }

  sendSysEx(response, j);
}

void sendControls() {
  const uint8_t length = LOCATION_OF_GROUPS - LOCATION_OF_CONTROLS;

  midi::DataByte data[length + 1];
  uint16_t       j = 0;
  uint16_t       i = LOCATION_OF_CONTROLS;

  data[j++] = SYSEX_MSG_RECEIVE_CONTROLS;

  while (i < LOCATION_OF_GROUPS) {
    data[j++] = EEPROM.read(i++);
  }

#if SYSEX_DEBUG_MODE
  Serial.println("Sending controls.");
  dumpDataToSerial(data, j);
#endif // if SYSEX_DEBUG_MODE

  sendSysEx(data, j);
}

static uint16_t sizeOfGroupData() {
  uint16_t result = 0;

  for (uint8_t i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    result += 1;                                   // number of entries
    result += 1;                                   // Channel byte
    result += 1;                                   // CC byte
    result += (shifter_groups[i].num_entries * 4); // entries (4 bytes each)
  }
  return result;
}

void sendGroups() {
  uint16_t     groupsSize = sizeOfGroupData();
  const size_t length     = groupsSize + 1;
  uint16_t     j          = 0;

  midi::DataByte data[length];

  data[j++] = SYSEX_MSG_RECEIVE_GROUPS;

  for (uint16_t i = 0; i < groupsSize; i++) {
    data[j++] = EEPROM.read(LOCATION_OF_GROUPS + i);
  }

#if SYSEX_DEBUG_MODE
  Serial.println("Sending groups.");
  dumpDataToSerial(data, j);
#endif // if SYSEX_DEBUG_MODE

  sendSysEx(data, j);
}

void sendInternalState() {
  const size_t length = 3 + (MAX_INPUT_CONTROLS * 2) + MAX_SHIFTER_GROUPS;
  uint8_t      i, j;

  midi::DataByte data[length];

  data[0] = SYSEX_MSG_GET_STATE;
  data[1] = MAX_INPUT_CONTROLS;

  j = 2;

  for (i = 0; i < MAX_INPUT_CONTROLS; i++) {
    data[j++] = input_controls[i].active;
  }

  for (i = 0; i < MAX_INPUT_CONTROLS; i++) {
    data[j++] = input_controls[i].ledLit;
  }

  for (i = 0; i < MAX_SHIFTER_GROUPS; i++) {
    data[j++] = shifter_groups[i].active;
  }

  data[j++] = EEPROM.read(LOCATION_OF_FLAGS);

  sendSysEx(data, length);
}

static void receiveControls(midi::DataByte* data, size_t size) {
#if SYSEX_DEBUG_MODE
  Serial.println("Receiving controls.");
#endif // if SYSEX_DEBUG_MODE`

  // start from 1, first byte is command
  for (size_t i = 1; i < size; i++) {
#if SYSEX_DEBUG_MODE

    /*Serial.print("Writing ");
       Serial.print(data[i]);
       Serial.print(" into byte ");
       Serial.println(START_OF_CONTROLS + i - 1);*/
#endif // if SYSEX_DEBUG_MODE

    if (LOCATION_OF_CONTROLS + i - 1 < LOCATION_OF_GROUPS) {
      EEPROM.update(LOCATION_OF_CONTROLS + i - 1, data[i]);
    }
  }
}

static void performFactoryReset(bool restartToo) {
#if SYSEX_DEBUG_MODE
  Serial.print("Performing factory reset ");
  Serial.println(restartToo ? "HARD" : "SOFT");
#endif // if SYSEX_DEBUG_MODE

  resetSettings(restartToo); // In settings.h

  if (restartToo && clientIsConnected) {
    delay(500);
    sendControls();

    delay(500);
    sendGroups();

    delay(500);
    sendInternalState();
  }
}

static void sendBackup() {
  const uint8_t blocksize = 51; // Works out to be a 64 byte message
  uint16_t      eepromIdx = LOCATION_OF_FLAGS;

  midi::DataByte data[blocksize + 1];

#if SYSEX_DEBUG_MODE
  Serial.println("Sending backup.");
#endif // if SYSEX_DEBUG_MODE

  uint16_t blockIdx = 0;
  data[blockIdx++]  = SYSEX_MSG_BACKUP;

  while (eepromIdx <= MAX_SYSEX_BYTES) {
    data[blockIdx++] = EEPROM.read(eepromIdx++);

    if (blockIdx > blocksize) {
      sendSysEx(data, blockIdx);
      blockIdx         = 0;
      data[blockIdx++] = SYSEX_MSG_BACKUP;
    }
  }
  sendSysEx(data, blockIdx);
}

static void receiveBackup(midi::DataByte* data, size_t size) {
#if SYSEX_DEBUG_MODE
  Serial.println("Receiving backup.");
#endif // if SYSEX_DEBUG_MODE

  uint16_t startFrom = LOCATION_OF_FLAGS + (data[1] * data[2]);

  for (uint16_t i = 0; i < data[3]; i++) {
    if (startFrom + i < MAX_SYSEX_BYTES) {
      EEPROM.update(startFrom + i, data[i + 4]);
    }
  }

  if (startFrom + data[2] > MAX_SYSEX_BYTES) {
    // All done, reset.
    restart(true);
  }
}

void busy() {
  sendSimpleMessage(SYSEX_MSG_AVAILABILITY, 0);
}

void ready() {
  sendSimpleMessage(SYSEX_MSG_AVAILABILITY, 1);
}

static void unpackByte(uint8_t currentByte) {
  if (currentByte == STOP_BYTE) {
    return;
  }

  if (rawDataIndex < MAX_SYSEX_BYTES) {
    rawData[rawDataIndex] = currentByte;
    ++rawDataIndex;
  } else {
#if SYSEX_DEBUG_MODE
    Serial.println("ERROR! exceeded MAX_SYSEX_BYTES size!");
#endif // if SYSEX_DEBUG_MODE
  }
}

static void push(uint8_t value) {
  if (value == START_BYTE) {
    // nothing to do here
  } else if (value == STOP_BYTE) {
    // nothing to do here
  } else if (count == DEVICE_BYTE) {
    foundDevice            = true;
    sysexReceivingDeviceId = value;
  } else if (count == VERSION_BYTE) {
    foundVersion = value == CURRENT_VERSION;
  } else if (count > VERSION_BYTE) {
    switch (sysexReceivingDeviceId) {
      case SHIFTER_PRO_DEVICE_ID:
        unpackByte(value);
        break;

      default:

        // do nothing -- we handle passthrough in midiHandler.cpp
        break;
    }
  }
  ++count;
}

void sysexStart() {
  sysexReceiving         = true;
  foundDevice            = false;
  foundVersion           = false;
  sysexReceivingDeviceId = 0;
  count                  = 0; // reset data array
  rawDataIndex           = 0;

  push(START_BYTE);
}

void sysexStop() {
  sysexReceiving = false;

  push(STOP_BYTE);

#if SYSEX_DEBUG_MODE
  Serial.println("STOP BYTE RECEIVED");
  Serial.print(count);
  Serial.println(" bytes");
#endif // if SYSEX_DEBUG_MODE

#if SYSEX_DEBUG_MODE
  for (int i = 0; i < rawDataIndex; i++) {
    Serial.print(rawData[i]);
    Serial.print(" ");
  }
#endif // if SYSEX_DEBUG_MODE

  uint8_t data[rawDataIndex];
  size_t  messageLength;
  int     size;

  if ((rawDataIndex > 0) && foundDevice && (sysexReceivingDeviceId == SHIFTER_PRO_DEVICE_ID)) {
    // Probably a command from external app

    clientIsConnected = true;

    messageLength = unpack(rawData, data, count);
    size          = messageLength - 2;

#if SYSEX_DEBUG_MODE
    Serial.print("Looks like a command: ");
    Serial.print(data[0]);
    Serial.print(" message length is ");
    Serial.println(messageLength);

// Serial.print("Unpacked: ");

// for (int i = 0; i < count; i++) {
//     Serial.print(sysex[i]);
//     Serial.print(" ");
// }
// Serial.println("");
#endif // if SYSEX_DEBUG_MODE

    busy();

    switch (data[0]) {
      case SYSEX_MSG_GET_VERSION:

        if ((size == 10) || (size == 11)) {
          clientIsConnected = true;
          sendVersion(data, size);
        }
        break;
      case SYSEX_MSG_GET_MODEL:

        if (size == 1) {
          sendModel();

          delay(300);
          sendInternalState();
        }

        break;

      case SYSEX_MSG_RESTART:

        if (size == 1) {
          restart(true);

          if (clientIsConnected) {
            delay(500);
            sendControls();

            delay(500);
            sendGroups();

            delay(500);
            sendInternalState();
          }
        }

      case SYSEX_MSG_FACTORY_RESET:

        if (size == 2) {
          performFactoryReset(data[1]);
        }
        break;

      case SYSEX_MSG_GET_CONTROLS:

        if (size == 1) {
          sendControls();

          delay(500);
          sendInternalState();
        }
        break;

      case SYSEX_MSG_RECEIVE_CONTROLS:

        // 11 for just two controls; 31 for all six.
        if ((size == 11) || (size == 31)) {
          receiveControls(data, size);
        }

        restart(true);

        break;

      case SYSEX_MSG_GET_GROUPS:

        if (size == 1) {
          sendGroups();

          delay(500);
          sendInternalState();
        }
        break;

      case SYSEX_MSG_GET_STATE:

        if (size == 1) {
          sendInternalState();
        }
        break;

      case SYSEX_MSG_RECEIVE_FLAGS:

        if (size == 2) {
          EEPROM.update(LOCATION_OF_FLAGS, data[1]);
          restart(true);
        }
        break;

      case SYSEX_MSG_CHANGE_GROUP_CHANNEL:

        if (size == 3) {
          shifter_group* group;
          group          = &shifter_groups[data[1]];
          group->channel = data[2];
          saveGroups();

          // No need to restart
        }
        break;

      case SYSEX_MSG_CHANGE_GROUP_VALUE:

        if (size == 3) {
          shifter_group* group;
          group            = &shifter_groups[data[1]];
          group->cc_number = data[2];
          saveGroups();

          // No need to restart
        }
        break;

      case SYSEX_MSG_REMOVE_ENTRY:

        if (size == 3) {
          shifter_group* group;
          uint8_t        i;
          group = &shifter_groups[data[1]];

          for (i = data[2]; i < group->num_entries - 1; i++) {
            group->entries[i] = group->entries[i + 1];
          }

          group->num_entries = group->num_entries - 1;

          saveGroups();

          // No need to restart
        }
        break;

      case SYSEX_MSG_SAVE_ENTRY_EDIT:

        if (size == 7) {
          shifter_group* group;
          uint8_t        entryId;

          group = &shifter_groups[data[1]];

          // entryId will be 255 for "new" since we can't pass -1 over
          // sysex
          entryId = data[2] == 255 ? group->num_entries++ : data[2];

          if (data[2] == 255) {
            // Need to expand the array size by one
            size_t         newSize = group->num_entries;
            shifter_entry* newArr  = new shifter_entry[newSize];

            memcpy(newArr, group->entries, (newSize - 1) * sizeof(shifter_entry));

            delete[] group->entries;
            group->entries = newArr;
          }

          group->entries[entryId].input.status  = data[3];
          group->entries[entryId].input.data    = data[4];
          group->entries[entryId].output.status = data[5];
          group->entries[entryId].output.data   = data[6];

          saveGroups();

          // No need to restart
        }
        break;

      case SYSEX_MSG_BACKUP:

        if (size == 1) {
          sendBackup();
        }
        break;

      case SYSEX_MSG_RESTORE:

        if (size > 5) {
          receiveBackup(data, size);
        }

        break;
    }
  }

  ready();

#if SYSEX_DEBUG_MODE
  Serial.println("Done.");
#endif // if SYSEX_DEBUG_MODE
}

void sysexReceiveByte(uint8_t value) {
  if (sysexReceiving) {
    if (value == STOP_BYTE) {
      sysexStop();
    } else {
      push(value);
    }
  } else if (value == START_BYTE) {
    sysexStart();
  }
}

void sysexReceive(const midiEventPacket_t& rx) {
  if (!engineActive)
    return;

  if (rx.byte1 == START_BYTE) {
    sysexStart();
    sysexReceiveByte(rx.byte2);
    sysexReceiveByte(rx.byte3);
  } else {
    sysexReceiveByte(rx.byte1);
    sysexReceiveByte(rx.byte2);
    sysexReceiveByte(rx.byte3);
  }
}
