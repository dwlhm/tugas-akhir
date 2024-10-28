#include <Arduino.h>
#include <sensor/sensor.h>
#include <lcd/lcd.h>
#include <struct/SensorStruct.h>
#include <sim/Sim.h>
#include <struct/GatewayStruct.h>
#include <deduplication/Deduplication.h>

Deduplication deduplication(10);

// // String deviceId = "759b21ae";
// Arduino Pro -> Gateway 2 -> lab
GatewayStruct gateway = GatewayStruct{
    "c85e7441",
    "13a6e232",
    "88e60ac85b1f2b09",
};
String deviceId = "1e485c3b";

// Arduino Mega -> Gateway 1 -> Parkir
// GatewayStruct gateway = GatewayStruct{
//     "c0c854f5",
//     "9eb83532",
//     "2a5e3018f48de4e6",
// };
// String deviceId = "879e8833";

// Arduino Pro -> Gateway 4
// GatewayStruct gateway = GatewayStruct{
//     "0e8fd054",
//     "23b06c84",
//     "02de7f96679c23c6",
// };
// String deviceId = "9a6cfdde";

// Arduino Pro -> Gateway 5 -> Gudang
// GatewayStruct gateway = GatewayStruct{
//     "83930168",
//     "b8e3d85f",
//     "f101ceaab24e3dc7",
// };
// String deviceId = "c1151e2a";

Sim sim(Serial1, gateway, "103.150.197.37");
Sim sim(Serial1, gateway, "103.150.197.37");

void setup() {

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

  // Serial.println(dataString);

  Serial.println(dataString);
  // Serial.println(deduplication.indexOrder);
  String response = sim.sendMqtt(dataString);


  Serial.print("response: ");
  Serial.println(response);
    //Serial2.println(deduplication.indexOrder);

  // delay(5000);

  // deduplication.write(response);

  // delay(300000);
  delay(30000);
}
