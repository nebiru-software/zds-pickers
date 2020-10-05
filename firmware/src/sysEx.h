#ifndef sysEx_h
#define sysEx_h

#include <Arduino.h>
#include <MidiBridge.h>

#define SYSEX_MSG_GET_VERSION 0x01      // 1
#define SYSEX_MSG_RECEIVE_VERSION 0x02  // 2
#define SYSEX_MSG_GET_CONTROLS 0x03     // 3
#define SYSEX_MSG_RECEIVE_CONTROLS 0x04 // 4
#define SYSEX_MSG_GET_GROUPS 0x05       // 5
// Only use SYSEX_MSG_RECEIVE_GROUPS for receiving a full dump
// e.g. restoring from a backup file
#define SYSEX_MSG_RECEIVE_GROUPS 0x06       // 6
#define SYSEX_MSG_GET_MODEL 0x07            // 7
#define SYSEX_MSG_RECEIVE_MODEL 0x08        // 8
#define SYSEX_MSG_GET_STATE 0x09            // 9
#define SYSEX_MSG_RECEIVE_FLAGS 0x0A        // 10
#define SYSEX_MSG_CHANGE_GROUP_CHANNEL 0x0B // 11
#define SYSEX_MSG_CHANGE_GROUP_VALUE 0x0C   // 12
#define SYSEX_MSG_SAVE_ENTRY_EDIT 0x0D      // 13
#define SYSEX_MSG_REMOVE_ENTRY 0x0E         // 14
#define SYSEX_MSG_AVAILABILITY 0x0F         // 15
#define SYSEX_MSG_BACKUP 0x10               // 16
#define SYSEX_MSG_RESTORE 0x11              // 17

#define SYSEX_MSG_RESTART 0x7D       // 125
#define SYSEX_MSG_FACTORY_RESET 0x7E // 126

const uint8_t SHIFTER_PRO_DEVICE_ID = 110;

const uint8_t START_BYTE = 0xF0;
const uint8_t STOP_BYTE  = 0xF7;

void processMessage(uint8_t* data, size_t size);

void sendSimpleMessage(midi::DataByte msg, midi::DataByte value);

void sendInternalState();

void sysexReceiveByte(uint8_t value);

#endif // ifndef sysEx_h
