#ifndef KecepatanAngin_H
#define KecepatanAngin_H

#include <Arduino.h>

class KecepatanAngin {
private:
    uint8_t data;
public:
    KecepatanAngin(uint8_t data) {
        this->data = data;
    };
    void init() { pinMode(this->data, INPUT); }
    float read();
};

#endif