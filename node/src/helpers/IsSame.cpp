#include <Arduino.h>
#include "struct/Fingerprint.h"

bool is_same(uint32_t a, uint32_t b) {
  return a == b;
}

bool compare(struct Fingerprint f1,struct Fingerprint f2) {
  if (
    is_same(f1.fingerprint_1,f2.fingerprint_1)
    ) {
    if (
    is_same(f1.fingerprint_2,f2.fingerprint_2)
    ) {
      return true;
    }
  }
  return false;
}
