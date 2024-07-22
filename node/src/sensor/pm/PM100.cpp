#include <Arduino.h>
#include <sensor/pm/PM100.h>

int32_t PM100::read() {

    uint8_t buf[9];

    delay(100);    
    if (this->serial->read() == 170) {
      this->serial->readBytes(buf, 9);
    } else return -1;
    
    return buf[4]*256+buf[5];
}