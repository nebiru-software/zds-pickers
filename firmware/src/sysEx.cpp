#include "sysEx.h"
#include "initializeEEPROM.h"
#include "sysExHandler.h"
#include <Arduino.h>

static uint8_t rawData[MAX_BYTES];

static bool    sysexReceiving = false;
static uint8_t sysexReceivingDeviceId;
static bool    foundDevice;
static bool    foundVersion;
static uint8_t foundDeviceId;
static int     count; // number of actual bytes we've received
static int     pushIndex;
static int     streamIndex;
static byte    highBits;

static uint8_t desiredDeviceId;
static uint8_t desiredDeviceByte;

static packetFunction transmitByteFunc;
static sysexFunction  transmitSysexFunc;

static void push(uint8_t value);

void setupSysex(uint8_t deviceId, uint8_t deviceByte, packetFunction transmitByte, sysexFunction transmitSysex) {
  desiredDeviceId   = deviceId;
  desiredDeviceByte = deviceByte;
  transmitByteFunc  = transmitByte;
  transmitSysexFunc = transmitSysex;
}

#if SYSEX_DEBUG_MODE
void dumpDataToSerial(uint8_t* data, size_t size) {
  for (size_t i = 0; i < size; i++) {
    Serial.print(data[i]);
    Serial.print(" ");
  }
  Serial.println("");
}

#endif // if SYSEX_DEBUG_MODE

void sysexStart() {
  sysexReceiving = true;
  foundDevice    = false;
  foundVersion   = false;
  foundDeviceId  = 0;
  count          = 0; // reset data array

#if SYSEX_DEBUG_MODE
  Serial.println("CLEAR SYSEX BUFFER");
#endif // if SYSEX_DEBUG_MODE

  push(START_BYTE);
}

static void unpackByte(uint8_t b) {
  if (b == STOP_BYTE) {
    return;
  }

  if (pushIndex < MAX_BYTES) {
    uint8_t rank = streamIndex % 8; // We split the data in runs of 8 bytes

    if (rank == 0) {
      // Start of the run Get the high bits
      highBits = b;
    } else {
      rawData[pushIndex] = b | ((highBits & (1 << (rank - 1))) ? 0x80 : 0);
      ++pushIndex;
    }
  } else {
#if SYSEX_DEBUG_MODE
    Serial.println("ERROR! exceeded MAX_BYTES size!");
#endif // if SYSEX_DEBUG_MODE
  }

  ++streamIndex;
}

static void push(uint8_t value) {
  if (value == START_BYTE) {
    // nothing to do here
  } else if (value == STOP_BYTE) {
    // nothing to do here
  } else if (count == desiredDeviceByte) {
    foundDevice   = true;
    foundDeviceId = value;
    streamIndex   = 0;
    pushIndex     = 0;
  } else if (count > desiredDeviceByte) {
    if (foundDeviceId == desiredDeviceId) {
      unpackByte(value);
    } else {
      // do nothing -- we handle passthrough in midiHandler.cpp
    }
  }
  ++count;
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
  if (count > 6) { // More than just a simple command
    dumpDataToSerial(rawData, pushIndex);
  }
#endif // if SYSEX_DEBUG_MODE

  if ((pushIndex > 0) &&
      ((rawData[0] < 20) || (rawData[0] == SYSEX_MSG_FACTORY_RESET) ||
       (rawData[0] == SYSEX_MSG_RESTART) || (rawData[0] == SYSEX_MSG_RESTORE))) {
    // Probably a command from external app
    processMessage(rawData, pushIndex);
  }
}

static uint8_t passThroughBuffer[3];
static uint8_t passThroughBufferIndex = 0;
void           flushBuffer(const uint8_t header) {
  midiEventPacket_t tx;

  tx.header = header;
  tx.byte1  = passThroughBuffer[0];
  tx.byte2  = passThroughBuffer[1];
  tx.byte3  = passThroughBuffer[2];

  transmitByteFunc(tx);

  passThroughBufferIndex = 0;
}

void bufferByte(const uint8_t currentByte) {
  switch (passThroughBufferIndex) {
    case 0:
      passThroughBuffer[0] = currentByte;
      ++passThroughBufferIndex;

      if (currentByte == STOP_BYTE) {
        flushBuffer(0x06);
      }
      break;
    case 1:
      passThroughBuffer[1] = currentByte;
      ++passThroughBufferIndex;

      if (currentByte == STOP_BYTE) {
        flushBuffer(0x06);
      }
      break;
    case 2:
      passThroughBuffer[2] = currentByte;

      if (currentByte == STOP_BYTE) {
        flushBuffer(0x06); // TODO is 6 correct?
      } else {
        flushBuffer(0x04);
      }
      break;
  }
}

void passThroughSysEx(const midiEventPacket_t& rx) {
  bufferByte(rx.byte1);

  if (rx.header != 0x0F) {
    bufferByte(rx.byte2);
    bufferByte(rx.byte3);
  }
}

void sysexReceiveByte(uint8_t value) {
  if (sysexReceiving) {
    if (value == STOP_BYTE) {
      sysexStop();
    } else {
      push(value);
    }
  }
}

void sysexReceive(const midiEventPacket_t& rx) {
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

bool processUsbByte(midiEventPacket_t rx) {
  if (sysexReceiving || (rx.byte1 == START_BYTE)) {
    sysexReceive(rx);

    if (sysexReceivingDeviceId != desiredDeviceId) {
      passThroughSysEx(rx);
    }

    if (!sysexReceiving) {
      sysexReceivingDeviceId = 0;
    }
    return true;
  } else {
    return false;
  }
}

void sendSysEx(uint8_t* data, size_t size) {
  if ((data == NULL) || (size == 0))
    return;

#if SYSEX_DEBUG_MODE
  Serial.print("sendSysEx (size ");
  Serial.print(size);
  Serial.print("): ");
  dumpDataToSerial(data, size);
#endif // if SYSEX_DEBUG_MODE

  // Properly frame the midi bytes.
  // This ensures we send a continuous stream over USB.

  size_t         midiDataSize = (size + 2) / 3 * 4;
  uint8_t        midiData[midiDataSize];
  const uint8_t* d              = data;
  uint8_t*       p              = midiData;
  size_t         bytesRemaining = size;

  while (bytesRemaining > 0) {
    switch (bytesRemaining) {
      case 1:
        *p++           = 5; // SysEx ends with following single byte
        *p++           = *d;
        *p++           = 0;
        *p             = 0;
        bytesRemaining = 0;
        break;
      case 2:
        *p++           = 6; // SysEx ends with following two bytes
        *p++           = *d++;
        *p++           = *d;
        *p             = 0;
        bytesRemaining = 0;
        break;
      case 3:
        *p++           = 7; // SysEx ends with following three bytes
        *p++           = *d++;
        *p++           = *d++;
        *p             = *d;
        bytesRemaining = 0;
        break;
      default:
        *p++ = 4; // SysEx starts or continues
        *p++ = *d++;
        *p++ = *d++;
        *p++ = *d++;
        bytesRemaining -= 3;
        break;
    }
  }

  /*#if SYSEX_DEBUG_MODE
     Serial.print("Frame aligned: ");
     dumpDataToSerial(midiData, midiDataSize);
   #endif // if SYSEX_DEBUG_MODE*/

  transmitSysexFunc(midiData, midiDataSize);
}

void assembleAndTransmitSysex(uint8_t* data, size_t size) {
  size_t   expandedSize = size + 5 + (int)ceil(size / 7.0);
  uint8_t  response[expandedSize];
  uint8_t  i, j, c;
  uint16_t r = 0;

  response[r++] = START_BYTE;
  response[r++] = SHIFTER_DEVICE_ID;
  response[r++] = CURRENT_VERSION;

  if (size) {
    for (i = 0; i < size;) {
      for (j = 0, c = 0; j < 7 && i < size; ++j) {
        // collect d7 bits from next seven bytes
        if (data[i++] & 0x80) {
          // if d7 set
          c |= 1 << j; // collect it
        }
      }
      response[r++] = c; // send d7 byte

      while (j) {
        // send the seven bytes (or whatever was left at the end)
        response[r++] = data[i - j--] & ~0x80; // with d7 clear
      }
    }
  }

  response[r++] = STOP_BYTE;

  sendSysEx(response, r);
}
