#include <Arduino.h>
#include <Servo.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <deduplication/Deduplication.h>

Servo myServo;

Deduplication deduplication(10);

String deviceId = "7d80e4e0";

void setup() {

    Serial.begin(9600);

    initSensor();

    myServo.attach(44);

    initLCD();

    Serial2.begin(9600);

}

void loop() {

    SensorStruct data = readSensor();

    myServo.write(data.arahAngin/2);

    writeLCD(data);

    String dataString = stringifySensor(deviceId, data);

    Serial.print(F("DataString: "));
    Serial.println(dataString);

    deduplication.start(dataString);

    Serial.println();

    Serial.print(F("IndexOrder: "));
    Serial.println(deduplication.indexOrder);

    Serial2.println(deduplication.indexOrder);

    delay(1000);

    deduplication.write(Serial2);

}