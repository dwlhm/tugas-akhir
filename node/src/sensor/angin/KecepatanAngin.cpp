#include <Arduino.h>

#include <sensor/angin/KecepatanAngin.h>

float KecepatanAngin::read() {

    delay(50);
    
    float anemometer = (analogRead(this->data) - 51.174)/44.952;
    if (anemometer < 0) anemometer = 0;

    return anemometer;
}