#include <Arduino.h>
#include <AltSoftSerial.h>
#include <SoftwareSerial.h>

#include <struct/SensorStruct.h>
#include <sensor/pm/PMDFRobot.h>
#include <sensor/pm/PM100.h>
#include <sensor/dht/DHTDFRobot.h>
#include <sensor/angin/KecepatanAngin.h>
#include <sensor/angin/ArahAngin.h>
#include <sensor/gps/gps.h>
#include <sensor/angin/ArahAnginRS.h>
#include <sensor/angin/KecepatanAnginRS.h>

SoftwareSerial serial(50, 51);
PMDFRobot pmDFRobot(serial);
DHTDFRobot dht(new DHT_Unified(23, DHT22));
ArahAngin arahAngin(A7);
KecepatanAngin kecepatanAngin(A6);
// PM100 pm100(serial);
// AltSoftSerial altser;
// GPS gps(altser);
// ArahAnginRS arahanginrs(Serial2, 40, 41);
// KecepatanAnginRS kecepatanAnginRS(Serial3, 42, 43);

void initSensor()
{

    // kecepatanAngin.init();
    pmDFRobot.init();
    dht.init();
    // arahAngin.init();
    // pm100.init();
    // gps.init();
    // arahanginrs.init();
    // kecepatanAnginRS.init();
}

SensorStruct readSensor()
{

    return SensorStruct{
        // PMDFRobotStruct{
        //     (int16_t)random(10, 12),
        //     (int16_t)random(20, 22),
        //     (int16_t)random(30, 32),
        // },
        // DHTDFRobotStruct{
        //     (int8_t)random(25, 27),
        //     (int8_t)random(60, 62),
        // }
        //   (int32_t)random(60,71),
        //   GPSData{
        //     (float)random(0,3),
        //     (float)random(0,3),
        //   }

        pmDFRobot.read(),
        dht.read(),
        // kecepatanAngin.read(),
        // arahAngin.read(),
        // pm100.read(),
        // gps.read(),
    };
}

String stringifySensor(String deviceId, SensorStruct data)
{

    String sensorName = "";
    String sensorValue = "";

    if (data.dht.humidity >= 0)
    {
        sensorName += "h";
        sensorValue += data.dht.humidity;
        sensorValue += ",";
    }

    if (data.dht.temperature >= 0)
    {
        sensorName += "t";
        sensorValue += data.dht.temperature;
        sensorValue += ",";
    }

    if (data.pmDFRobot.pm1 >= 0)
    {
        sensorName += "1";
        sensorValue += data.pmDFRobot.pm1;
        sensorValue += ",";
    }

    if (data.pmDFRobot.pm25 >= 0)
    {
        sensorName += "2";
        sensorValue += data.pmDFRobot.pm25;
        sensorValue += ",";
    }

    if (data.pmDFRobot.pm10 >= 0)
    {
        sensorName += "0";
        sensorValue += data.pmDFRobot.pm10;
        sensorValue += ",";
    }

    // if (data.kecepatanAngin >= 0) {
    // sensorName += "v";
    // sensorValue += data.kecepatanAngin;
    // sensorValue += ",";
    // }

    // if (data.pm100 >= 0)
    // {
    //     sensorName += "3";
    //     sensorValue += data.pm100;
    //     sensorValue += ",";
    // }

    // if (data.arahAngin >= 0) {
    // sensorName += "a";
    // sensorValue += data.arahAngin;
    // sensorValue += ",";
    // }

    // if (data.gps.lat) {
    // sensorName += "l";
    // sensorValue += String(data.gps.lat, 8);
    // sensorValue += ",";
    // }

    // if (data.gps.lon >= 0) {
    // sensorName += "o";
    // sensorValue += String(data.gps.lon, 8);
    // sensorValue += ",";
    // }

    return "{\"id\": \"" + deviceId + "\",\"data\": \"" + sensorName + "|" + sensorValue + "\"}";
};
