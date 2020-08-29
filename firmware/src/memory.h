#ifndef memory_h
#define memory_h

#include <Arduino.h>

void setupMemory();

uint8_t readByte(unsigned int addr);

void writeByte(unsigned int addr, uint8_t data);

void updateByte(unsigned int addr, uint8_t data);

#endif // ifndef memory_h
