#ifndef sysEx_h
#define sysEx_h

#include <Arduino.h>
#include <MidiBridge.h>

#define SYSEX_DEBUG_MODE false

typedef void (*packetFunction)(midiEventPacket_t);
typedef void (*sysexFunction)(byte  *data,
                              size_t size);

const uint8_t START_BYTE = 0xF0;
const uint8_t STOP_BYTE  = 0xF7;

void setupSysex(uint8_t deviceId,
                uint8_t deviceByte,
                packetFunction transmitByte,
                sysexFunction transmitSysex);

void sysexStart();

bool processUsbByte(midiEventPacket_t rx);

void sendSysEx(uint8_t *data,
               size_t size);

void assembleAndTransmitSysex(uint8_t *data,
                              size_t size);

#if SYSEX_DEBUG_MODE
void dumpDataToSerial(uint8_t *data,
                      size_t size);
#endif // if SYSEX_DEBUG_MODE

#endif // ifndef sysEx_h
