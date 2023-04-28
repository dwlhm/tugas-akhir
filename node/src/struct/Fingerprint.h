#include <Arduino.h>

struct Fingerprint {
  uint32_t fingerprint_1;
  uint32_t fingerprint_2;
  int location;
};