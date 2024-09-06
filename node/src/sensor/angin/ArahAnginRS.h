#ifndef ArahAnginRS_H
#define ArahAnginRS_H

#include <Arduino.h>

class ArahAnginRS {
    private:
        HardwareSerial* serial;
        uint8_t re;
        uint8_t de;
        byte msg[8] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x02, 0xC4, 0x0B};
        byte value[11];
    public:
        ArahAnginRS(HardwareSerial &serial, uint8_t RE,uint8_t DE) {
            this->serial = &serial;
            this->re = RE;
            this->de = DE;
        };
        void init() {
            this->serial->begin(4800);
            pinMode(this->re, OUTPUT);
            pinMode(this->de,OUTPUT);
        };
        int16_t read();
};

#endif