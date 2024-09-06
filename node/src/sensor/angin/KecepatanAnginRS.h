#ifndef KecepatanAnginRS_H
#define KecepatanAnginRS_H

#include <Arduino.h>

class KecepatanAnginRS {
    private:
        HardwareSerial* serial;
        uint8_t re;
        uint8_t de;
        byte msg[8] = {0x03, 0x03, 0x00, 0x00, 0x00, 0x02, 0xC4, 0x0B};
        byte value[11];
    public:
        KecepatanAnginRS(HardwareSerial &serial, uint8_t RE,uint8_t DE) {
            this->serial = &serial;
            this->re = RE;
            this->de = DE;
        };
        void init() {
            this->serial->begin(4800);
            pinMode(this->re, OUTPUT);
            pinMode(this->de,OUTPUT);
        };
        float read();
};

#endif