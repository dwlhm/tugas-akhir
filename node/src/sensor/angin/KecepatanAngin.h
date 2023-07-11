#ifndef KecepatanAngin_H
#define KecepatanAngin_H

#include <Arduino.h>

class KecepatanAngin {
private:
    uint8_t data;
    uint8_t echo;
public:
    KecepatanAngin(uint8_t echo, uint8_t data) {
        this->data = data;
        this->echo = echo;
    };
    void init() { pinMode(this->echo, INPUT_PULLUP); }
    float read();
};

#endif