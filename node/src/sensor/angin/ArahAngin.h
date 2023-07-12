#ifndef ArahAngin_H
#define ArahAngin_H

#include <Arduino.h>

class ArahAngin {
private:
    uint8_t data;
    uint8_t echo;
public:
    ArahAngin(uint8_t echo, uint8_t data) {
        this->data = data;
        this->echo = echo;
    };
    void init() { pinMode(this->echo, INPUT_PULLUP); };
    int16_t read();
    bool isUnplugged() { return digitalRead(this->echo) > 0; }
};

#endif