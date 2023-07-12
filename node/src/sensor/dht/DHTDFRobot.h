#ifndef DHTDFRobot_H
#define DHTDFRobot_H

#include <struct/DHTDFRobotStruct.h>

#include <DHT_U.h>

class DHTDFRobot
{
private:
    DHT_Unified* dht;
    sensors_event_t event;
public:
    DHTDFRobot(DHT_Unified *dht) {
        this->dht = dht;
    };
    void init();
    DHTDFRobotStruct read();
};

#endif