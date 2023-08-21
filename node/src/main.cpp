#include <Arduino.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <deduplication/Deduplication.h>

Deduplication deduplication(4);

String deviceId = "759b21ae";

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

    Serial.println();
    Serial.print(F("IndexOrder: "));
    Serial.println(deduplication.indexOrder);
    Serial2.println(deduplication.indexOrder);

    delay(3000);

    deduplication.write(Serial2);

    delay(60000);

}