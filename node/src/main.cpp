#include <Arduino.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <deduplication/Deduplication.h>

Deduplication deduplication(4);

// String deviceId = "759b21ae";
String deviceId = "7d80e4e0";

void setup() {

    Serial.begin(9600);

    initSensor();

    initLCD();

    Serial2.begin(9600);

}

void loop() {

    SensorStruct data = readSensor();

    writeLCD(data);

    String dataString = stringifySensor(deviceId, data);

    Serial.println(dataString);

    deduplication.start(dataString);

    Serial2.println(dataString);

    delay(3000);

    deduplication.write(Serial2);

    delay(300000);

}