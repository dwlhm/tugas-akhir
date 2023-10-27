#include <Arduino.h>
#include <sensor/pm/PM100.h>

int32_t PM100::read() {

    int buf[9];
    uint8_t i = 0;

    delay(100);    
    while (this->serial->available() && i < 9) {

        buf[i] = this->serial->read();
        i++;

    }

    if (i == 0) return -1;
    
    return buf[4]*256+buf[5];
}