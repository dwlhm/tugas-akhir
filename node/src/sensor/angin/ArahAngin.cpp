#include <Arduino.h>

#include <sensor/angin/ArahAngin.h>

int16_t ArahAngin::read() {

    delay(50);
    
    int16_t arah_angin = (0.3504*analogRead(this->data))+0.2038;
    if (arah_angin >= 360.00) {
        arah_angin = 0;
    }

    Serial.println(arah_angin);
    
    return arah_angin;
}