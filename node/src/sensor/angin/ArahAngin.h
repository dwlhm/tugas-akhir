#ifndef ArahAngin_H
#define ArahAngin_H

#include <Arduino.h>

class ArahAngin {
private:
    uint8_t data;
public:
    ArahAngin(uint8_t data) {
        this->data = data;
    };
    void init() { pinMode(this->data, INPUT); };
    int16_t read();
};

#endif