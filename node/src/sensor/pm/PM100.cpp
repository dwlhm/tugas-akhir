#include <Arduino.h>
#include <sensor/pm/PM100.h>

int16_t PM100::read() {

    uint8_t buf[9];
    uint8_t i = 0;
    
    while (this->serial->available()) {

        buf[i] = this->serial->read();
        i++;

    }

    if (i == 0) return -1;
    
    return buf[4]*256+buf[5];
}