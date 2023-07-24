#include <Arduino.h>
#include <struct/SensorStruct.h>
#include <sensor/pm/PMDFRobot.h>
#include <sensor/pm/PM100.h>
#include <sensor/dht/DHTDFRobot.h>
#include <sensor/angin/KecepatanAngin.h>
#include <sensor/angin/ArahAngin.h>

PMDFRobot pmDFRobot(Serial1);
DHTDFRobot dht(new DHT_Unified(23, DHT22));
ArahAngin arahAngin(52, A7);
KecepatanAngin kecepatanAngin(53, A6);
PM100 pm100(Serial3);

void initSensor() {
    
    pmDFRobot.init();
    dht.init();
    arahAngin.init();
    kecepatanAngin.init();
    pm100.init();

}

SensorStruct readSensor() {

    return SensorStruct{
        pmDFRobot.read(),
        pm100.read(),
        dht.read(),
        kecepatanAngin.read(),
        arahAngin.read()
    };

}

String stringifySensor(String deviceId, SensorStruct data) {

    String sensorName = "";
    String sensorValue = "";

    if (data.dht.humidity >= 0) {
        sensorName += "h";
        sensorValue += data.dht.humidity;
        sensorValue += ",";
    }
    
    if (data.dht.temperature >= 0) {
        sensorName += "t";
        sensorValue += data.dht.temperature;
        sensorValue += ",";
    }
    
    if (data.pmDFRobot.pm1 >= 0) {
        sensorName += "1";
        sensorValue += data.pmDFRobot.pm1;
        sensorValue += ",";
    }
    
    if (data.pmDFRobot.pm25 >= 0) {
        sensorName += "2";
        sensorValue += data.pmDFRobot.pm25;
        sensorValue += ",";
    }
    
    if (data.pmDFRobot.pm10 >= 0) {
        sensorName += "0";
        sensorValue += data.pmDFRobot.pm10;
        sensorValue += ",";
    }
    
    if (data.pm100 >= 0) {
        sensorName += "3";
        sensorValue += data.pm100;
        sensorValue += ",";
    }
    
    if (data.arahAngin >= 0) {
        sensorName += "a";
        sensorValue += data.arahAngin;
        sensorValue += ",";
    }
    
    if (data.kecepatanAngin >= 0) {
        sensorName += "v";
        sensorValue += data.kecepatanAngin;
        sensorValue += ",";
    }

    return "{\"id\": \"" + deviceId + "\",\"data\": \"" + sensorName + "|" + sensorValue + "\"}";

};