#include <Arduino.h>
#include <struct/DHTDFRobotStruct.h>

#include <sensor/dht/DHTDFRobot.h>

void DHTDFRobot::init() {
    this->dht->begin();
}

DHTDFRobotStruct DHTDFRobot::read() {

    DHTDFRobotStruct result;
    
    delay(50);

    this->dht->temperature().getEvent(&event);
    if (isnan(event.temperature)) {
        result.temperature = -1;
    } else {
        result.temperature = event.temperature;
    }

    this->dht->humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
        result.humidity = -1;
    } else {
        result.humidity = event.relative_humidity;
    }

    return result;
}
