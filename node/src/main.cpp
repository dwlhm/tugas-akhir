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

Sim sim(Serial1, gateway, "103.150.197.37");

void setup()
{

  Serial.begin(9600);

  initSensor();

  initLCD();
  Serial.println("STARTING");

  sim.init();
  // Serial2.begin(9600);
}

void loop()
{

  SensorStruct data = readSensor();

  writeLCD(data);

  String dataString = stringifySensor(deviceId, data);

  deduplication.start(dataString);

  Serial.println(dataString);
  Serial.println(deduplication.indexOrder);
  String response = sim.sendMqtt(deduplication.indexOrder);

  Serial.println("RESPONSE: " + response);

  // delay(5000);

  deduplication.write(response);

  // delay(300000);
  delay(5000);
}
