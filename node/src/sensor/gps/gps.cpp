#include <Arduino.h>
#include <sensor/gps/gps.h>
#include <TinyGPS++.h>

GPSData GPS::read() {
    while (this->serial->available() > 0){
    this->gps.encode(this->serial->read());
    if (this->gps.location.isUpdated()){
        return GPSData{
            lat: (float)this->gps.location.lat(),
            lon: (float)this->gps.location.lng()
        };
    };
  };
};