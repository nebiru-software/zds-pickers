#ifndef sysExHandler_h
#define sysExHandler_h

#include <Arduino.h>
#include <MidiBridge.h>
#include <MIDI.h>

const uint8_t SHIFTER_DEVICE_ID = 108;

#define SYSEX_MSG_GET_VERSION          0x01
#define SYSEX_MSG_RECEIVE_VERSION      0x02

#define SYSEX_MSG_GET_CONTROLS         0x03
#define SYSEX_MSG_RECEIVE_CONTROLS     0x04

#define SYSEX_MSG_GET_GROUPS           0x05

// Only use SYSEX_MSG_RECEIVE_GROUPS for receiving a full dump
// e.g. restoring from a backup file
#define SYSEX_MSG_RECEIVE_GROUPS       0x06

#define SYSEX_MSG_GET_MODEL            0x07
#define SYSEX_MSG_RECEIVE_MODEL        0x08

#define SYSEX_MSG_GET_STATE            0x09

#define SYSEX_MSG_RECEIVE_FLAGS        0x0A

#define SYSEX_MSG_CHANGE_GROUP_CHANNEL 0x0B
#define SYSEX_MSG_CHANGE_GROUP_VALUE   0x0C
#define SYSEX_MSG_SAVE_ENTRY_EDIT      0x0D
#define SYSEX_MSG_REMOVE_ENTRY         0x0E

#define SYSEX_MSG_AVAILABILITY         0x0F

#define SYSEX_MSG_BACKUP               0x10
#define SYSEX_MSG_RESTORE              0x11

#define SYSEX_MSG_RESTART              0x7D
#define SYSEX_MSG_FACTORY_RESET        0x7E

void processMessage(uint8_t *data,
                    size_t size);

void sendSimpleMessage(midi::DataByte msg,
                       midi::DataByte value);

void sendInternalState();

#endif // ifndef sysExHandler_h
