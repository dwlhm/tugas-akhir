#include <Arduino.h>

#include <sensor/angin/ArahAngin.h>

int16_t ArahAngin::read() {

    if (this->isUnplugged()) { return -1; }

    int16_t arah_angin = (0.3504*analogRead(this->data))+0.2038;
    if (arah_angin >= 360.00) {
        arah_angin = 0;
    }
    
    return arah_angin;
}