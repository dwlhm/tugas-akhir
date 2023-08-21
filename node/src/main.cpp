#include <Arduino.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <deduplication/Deduplication.h>

Deduplication deduplication(10);

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

    Serial.print(F("DataString: "));
    Serial.println(dataString);

    deduplication.start(dataString);

    delay(60000);

    deduplication.write(Serial2);

}