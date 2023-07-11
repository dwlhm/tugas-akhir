#ifndef PMDFRobotStruct_H
#define PMDFRobotStruct_H

#include <Arduino.h>

struct PMDFRobotStruct {
  int16_t pm1;
  int16_t pm25;
  int16_t pm10;
};

#endif