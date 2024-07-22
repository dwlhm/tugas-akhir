#include <Arduino.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <sim/Sim.h>
#include <struct/GatewayStruct.h>
#include <deduplication/Deduplication.h>

Deduplication deduplication(10);

// // String deviceId = "759b21ae";
GatewayStruct gateway = GatewayStruct{
    "83930168",
    "b8e3d85f",
    "f101ceaab24e3dc7",
};
String deviceId = "c1151e2a";

Sim sim(Serial, gateway, "103.150.197.37");

void setup() {

  initSensor();

  initLCD();

  sim.init();

    //Serial2.begin(9600);

}

void loop() {

  SensorStruct data = readSensor();

  writeLCD(data);

  String dataString = stringifySensor(deviceId, data);

    // Serial.println(dataString);

    //deduplication.start(dataString);

  //Serial.println(dataString);
  String response = sim.sendMqtt(dataString);

    // Serial.println("RESPONSE: " + response);
    //Serial2.println(deduplication.indexOrder);

    //delay(5000);

    //deduplication.write(Serial2);

  //delay(300000);
  delay(5000);

}
