//******************************
 //*Abstract: Read value of PM1,PM2.5,PM10,
 //           Temperature and Humidity of ambient air
 //
 //*Version：V1.0
 //*Author：Dwi Ilham Maulana <hi@dwlhm.space>
 //*Date：February.12.2023
 //******************************
#include <Arduino.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 7
#define DHTTYPE    DHT22
DHT_Unified dht(DHTPIN, DHTTYPE);
uint32_t delayMS;


#include "pm.h"

int PM01Value;
int PM2_5Value;
int PM10Value;




void setup() {

  Serial.begin(9600);  

  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  dht.humidity().getSensor(&sensor);
  delayMS = sensor.min_delay / 1000;

  Serial1.begin(9600); 

}


void loop() {

  delay(delayMS);
  sensors_event_t event;

  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature"));
  } else {
    Serial.print(F("Temperature:  "));
    Serial.print(event.temperature);
    Serial.println(F(" °C"));
  }

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  } else {
    Serial.print(F("Humidity: "));
    Serial.print(event.relative_humidity);
    Serial.println(F(" %"));
  }

  if(Serial1.find(0x42)){    
    Serial1.readBytes(buf,LENG);

    if(buf[0] == 0x4d){
      if(checkValue(buf,LENG)){
        PM01Value=transmitPM01(buf); 
        PM2_5Value=transmitPM2_5(buf);
        PM10Value=transmitPM10(buf);

        Serial.print("PM1.0:  ");
        Serial.print(PM01Value);
        Serial.println(" ug/m3");
        Serial.print("PM2.5:  ");
        Serial.print(PM2_5Value);
        Serial.println(" ug/m3");
        Serial.print("PM1 0:  ");
        Serial.print(PM10Value);
        Serial.println(" ug/m3");
      }
    }
  } else {
    Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
  }

  int sensor_anemometer = analogRead(A0);
  float anemometer = sensor_anemometer * (5.0 / 1023.0);
  int level_anemometer = 6*anemometer;//The level of wind speed is proportional to the output voltage.
  Serial.print("Wind speed: ");
  Serial.print(level_anemometer);
  Serial.println(" level now");

  int sensor_arah_angin = analogRead(A1);
  float voltage = (sensor_arah_angin / 1023.0) * 5.0;
  float arah_angin = sensor_arah_angin * ((5.0/1024.0)*360/5) ;
  arah_angin = map(sensor_arah_angin, 0, 959, 0, 360);
  if (arah_angin == 360.00) {
    arah_angin = 0;
  }
  Serial.print("Arah Angin: ");
  Serial.print(arah_angin);
  Serial.println(" °");

  Serial.println();
}