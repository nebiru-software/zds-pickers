#include <Arduino.h>
#include "midiLED.h"
#include "settings.h"
#include <Metro.h>

#define MIDI_LED_PIN 4

static class Metro midi_led_metro(25); // LED blink interval timer

bool               midi_led_next_state;
bool               midi_led_current_state;
bool               midi_led_next_state_1;
bool               midi_led_next_state_2;

uint8_t            ledMode;

void setupMidiLed(uint8_t mode) {
   ledMode = mode;
   pinMode(MIDI_LED_PIN, OUTPUT);

   if ((mode == ACTIVITY_LED_MODE_NORMALLY_OFF) ||
       (mode == ACTIVITY_LED_MODE_ALWAYS_OFF)) {
      // MIDI LED State.  0 = off; 1 = on next cycle
      midi_led_next_state_1 = LOW;
      midi_led_next_state_2 = HIGH;
   } else {
      midi_led_next_state_1 = HIGH;
      midi_led_next_state_2 = LOW;
   }
   midi_led_next_state    = midi_led_next_state_1;
   midi_led_current_state = midi_led_next_state_1;

   digitalWrite(MIDI_LED_PIN, midi_led_next_state);
}

void activityDetected() {
   midi_led_next_state = midi_led_next_state_2;
}

void processMidiLed() {
   if ((ledMode != ACTIVITY_LED_MODE_ALWAYS_ON) &&
       (ledMode != ACTIVITY_LED_MODE_ALWAYS_OFF)) {
      if (midi_led_metro.check()) {
         if (midi_led_next_state == midi_led_next_state_2) {
            if (midi_led_current_state == midi_led_next_state_1) {
               digitalWrite(MIDI_LED_PIN, midi_led_next_state_2);
               midi_led_current_state = midi_led_next_state_2;
            }
            midi_led_next_state = midi_led_next_state_1;
         } else {
            if (midi_led_current_state == midi_led_next_state_2) {
               digitalWrite(MIDI_LED_PIN, midi_led_next_state_1);
               midi_led_current_state = midi_led_next_state_1;
            }
         }
      }
   }
}
