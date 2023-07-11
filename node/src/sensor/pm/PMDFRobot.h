#ifndef PMDFRobot_H
#define PMDFRobot_H

#include <struct/PMDFRobotStruct.h>

class PMDFRobot
{
private:
    HardwareSerial* serial;
    char checkValue(unsigned char *thebuf, char leng);
    int16_t transmitPM01(unsigned char *thebuf);
    int16_t transmitPM2_5(unsigned char *thebuf);
    int16_t transmitPM10(unsigned char *thebuf);
public:
    PMDFRobot(HardwareSerial &serialArg) {
        this->serial = &serialArg;
    };
    void init() { 
        this->serial->begin(9600);
        this->serial->setTimeout(1500);
    }
    PMDFRobotStruct read();
};

#endif