#include <Arduino.h>
#include <struct/SensorStruct.h>
#include <sensor/pm/PMDFRobot.h>
#include <sensor/pm/pm100.h>
#include <sensor/dht/DHTDFRobot.h>
#include <sensor/angin/KecepatanAngin.h>
#include <sensor/angin/ArahAngin.h>

PMDFRobot pmDFRobot(Serial1);
DHTDFRobot dht(new DHT_Unified(23, DHT22));
ArahAngin arahAngin(53, A1);
KecepatanAngin kecepatanAngin(54, A6);

void initSensor() {
    
    pmDFRobot.init();
    dht.init();
    arahAngin.init();
    kecepatanAngin.init();

}

SensorStruct readSensor() {

    return SensorStruct{
        pmDFRobot.read(),
        readPM100(),
        dht.read(),
        kecepatanAngin.read(),
        arahAngin.read()
    };

}

String stringifySensor(String deviceId, SensorStruct data) {

    String sensorName = "";
    String sensorValue = "";

    if (data.dht.humidity > 0) {
        sensorName += "h";
        sensorValue += data.dht.humidity;
    }
    
    if (data.dht.temperature > 0) {
        sensorName += "t";
        sensorValue += data.dht.humidity;
    }
    
    if (data.pmDFRobot.pm1 > 0) {
        sensorName += "1";
        sensorValue += data.pmDFRobot.pm1;
    }
    
    if (data.pmDFRobot.pm25 > 0) {
        sensorName += "2";
        sensorValue += data.pmDFRobot.pm1;
    }
    
    if (data.pmDFRobot.pm10 > 0) {
        sensorName += "0";
        sensorValue += data.pmDFRobot.pm10;
    }
    
    if (data.pm100 > 0) {
        sensorName += "3";
        sensorValue += data.pm100;
    }
    
    if (data.arahAngin > 0) {
        sensorName += "a";
        sensorValue += data.arahAngin;
    }
    
    if (data.kecepatanAngin > 0) {
        sensorName += "v";
        sensorValue += data.kecepatanAngin;
    }

    return "{\"id\": \"" + deviceId + "\",\"data\": \"" + sensorName + "|" + sensorValue + "\"}";

};