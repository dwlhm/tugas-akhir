#ifndef pm100_H
#define pm100_H

#include <Arduino.h>

class PM100
{
private:
    HardwareSerial* serial;
public:
    PM100(HardwareSerial& serial) {
        this->serial = &serial;
    };
    void init() {
        this->serial->begin(9600);
        this->serial->setTimeout(1500);
    };
    int32_t read();
    
};

#endif