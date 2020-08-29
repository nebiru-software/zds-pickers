#include "memory.h"
#include <Arduino.h>
#include <EEPROM24LC256_512.h>
#include <Wire.h>

EEPROM256_512 mem_1;

void setupMemory() {
  Wire.begin();
  mem_1.begin(0, 0);
}

uint8_t readByte(unsigned int addr) {
  return mem_1.readByte(addr);
}

void writeByte(unsigned int addr, uint8_t value) {
  Serial.println(mem_1.getPageSize());
  mem_1.writeByte(addr, value);
}

void updateByte(unsigned int addr, uint8_t value) {
  uint8_t currentValue = mem_1.readByte(addr);
  if (currentValue != value) {
    mem_1.writeByte(addr, value);
  }
}
