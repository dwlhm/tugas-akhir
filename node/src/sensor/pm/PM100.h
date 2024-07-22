#ifndef pm100_H
#define pm100_H

#include <Arduino.h>
#include <SoftwareSerial.h>

class PM100
{
private:
    SoftwareSerial* serial;
public:
    PM100(SoftwareSerial& serial) {
        this->serial = &serial;
    };
    void init() {
        this->serial->begin(9600);
        this->serial->setTimeout(1500);
    };
    int32_t read();
    
};

#endif