#include <Arduino.h>

size_t print32(Print* pr, uint32_t n) {
  char buf[21];
  char *str = &buf[sizeof(buf) - 1];
  *str = '\0';
  do {
    uint32_t m = n;
    n /= 10;
    *--str = m - 10*n + '0';
  } while (n);
  pr->print(str);
}
size_t print32(Print* pr, int32_t n) {
  size_t s = 0;
  if (n < 0) {
    n = -n;
    s = pr->print('-');
  }  return s + print32(pr, (uint32_t)n);
}
size_t println32(Print* pr, int32_t n) {
  return print32(pr, n) + pr->println();
}
size_t println32(Print* pr, uint32_t n) {
  return print32(pr, n) + pr->println();
}