#ifndef SensorStruct_H
#define SensorStruct_H

#include <Arduino.h>
#include <struct/PMDFRobotStruct.h>
#include <struct/DHTDFRobotStruct.h>

struct SensorStruct {
    PMDFRobotStruct pmDFRobot;
    int16_t pm100;
    DHTDFRobotStruct dht;
    float kecepatanAngin;
    int16_t arahAngin;
};

#endif