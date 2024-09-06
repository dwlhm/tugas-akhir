#ifndef GPS_H
#define GPS_H

#include <Arduino.h>
#include <AltSoftSerial.h>
#include <TinyGPS++.h>

struct GPSData {
    float lat;
    float lon;
};

class GPS {
    private:
        AltSoftSerial* serial;
        TinyGPSPlus gps;
    public:
        GPS(AltSoftSerial &serial) {
            this->serial = &serial;
        };
        void init() {
            this->serial->begin(9600);
        };
        GPSData read();
};

#endif