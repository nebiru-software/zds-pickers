// https://github.com/PaulStoffregen/Teensyduino_Examples/blob/master/USB_MIDI/MIDI_name/name.c

// To give your project a unique name, this code must be
// placed into a .c file (its own tab).  It can not be in
// a .cpp file or your main sketch (the .ino file).

#include "usb_names.h"

// Edit these lines to create your own name.  The length must
// match the number of characters in your custom name.

#define PRODUCT_NAME   { 'Z', 'D', 'S', ' ', 'S', 'h', 'i', 'f', 't', 'e', 'r', ' ', 'P', 'r', 'o' }
#define PRODUCT_NAME_LEN  15

#define MANUFACTURER_NAME   { 'N', 'e', 'b', 'i', 'r', 'u', ' ', 'S', 'o', 'f', 't', 'w', 'a', 'r', 'e' }
#define MANUFACTURER_NAME_LEN  15

// Do not change this part.  This exact format is required by USB.

struct usb_string_descriptor_struct usb_string_product_name = {
    2 + PRODUCT_NAME_LEN * 2,
    3,
    PRODUCT_NAME
};

struct usb_string_descriptor_struct usb_string_manufacturer_name = {
    2 + MANUFACTURER_NAME_LEN * 2,
    3,
    MANUFACTURER_NAME
};
