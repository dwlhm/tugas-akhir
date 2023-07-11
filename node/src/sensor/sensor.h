#ifndef sensor_H
#define sensor_H

#include <Arduino.h>
#include <struct/SensorStruct.h>

void initSensor();

SensorStruct readSensor();

String stringifySensor(String deviceId, SensorStruct data);

#endif