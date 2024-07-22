#ifndef SensorStruct_H
#define SensorStruct_H

#include <Arduino.h>
#include <struct/PMDFRobotStruct.h>
#include <struct/DHTDFRobotStruct.h>
#include <sensor/gps/gps.h>

struct SensorStruct {
    PMDFRobotStruct pmDFRobot;
    DHTDFRobotStruct dht;
    float kecepatanAngin;
    int16_t arahAngin;
    int32_t pm100;
    GPSData gps;
};

#endif
