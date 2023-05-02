//******************************
 //*Abstract: Read value of PM1,PM2.5,PM10,
 //           Temperature and Humidity of ambient air
 //
 //*Version：V1.0
 //*Author：Dwi Ilham Maulana <hi@dwlhm.space>
 //*Date：February.12.2023
 //******************************
#include <Arduino.h>

#include "helpers/MurmurHash3.h"
#include "helpers/IsSame.h"
#include "struct/Fingerprint.h"
#include "helpers/Substr.h"
#include "helpers/Print32.h"

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

const int metadata_size = 10;


Fingerprint metadata[metadata_size];
bool duplicate = false;
int location = 0;
int metadata_length = 0;

unsigned long timeout;

void setup() {

  Serial.begin(9600);  
  Serial2.begin(9600); 
  Serial2.setTimeout(30000);

  // Serial.println();
  // dht.begin();
  // sensor_t sensor;
  // dht.temperature().getSensor(p&sensor);
  // dht.humidity().getSensor(&sensor);

  // Serial1.begin(9600); 

}


void loop() {
  
  delay(1000);
  sensors_event_t event;
  String header = "";
  String value = "";

  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature"));
  } else {
    Serial.print(F("Temperature:  "));
    Serial.print(event.temperature);
    header += "t";
    // value += String(event.temperature);
    
    Serial.println(F(" °C"));
  }
  float rand_temp = random(0,10000)/500.0;
    value += String(rand_temp);
    value += ",";

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  } else {
    Serial.print(F("Humidity: "));
    Serial.print(event.relative_humidity);
    header += "h";
    // value += String(event.relative_humidity);
    
    Serial.println(F(" %"));
  }
  float rand_hum = random(0,10000)/1000.0;
    value += String(rand_hum);
    value += ",";

  if(Serial1.find(0x42)){    
    Serial1.readBytes(buf,LENG);

    if(buf[0] == 0x4d){
      if(checkValue(buf,LENG)){
        PM01Value=transmitPM01(buf); 
        PM2_5Value=transmitPM2_5(buf);
        PM10Value=transmitPM10(buf);
        header += "120";
        // value += String(PM01Value) 
        //       + ","
        //       + String(PM2_5Value)  
        //       + ","
        //       + String(PM10Value) 
        //       + ",";
        int rand_pm1 = random(0,50);
        int rand_pm2 = random(0,50);
        int rand_pm0 = random(0,50);
        value += String(rand_pm1) 
              + ","
              + String(rand_pm2)  
              + ","
              + String(rand_pm0) 
              + ",";
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
  float level_anemometer = 6*anemometer;
  header += "v";
  // value += level_anemometer 
  //       + ",";
  float rand_kecepatan = random(0,10000)/1000.0;
  value += String(rand_kecepatan);
  value += ",";
  Serial.print("Wind speed: ");
  Serial.print(level_anemometer);
  Serial.println(" level now");

  int sensor_arah_angin = analogRead(A1);
  float arah_angin = map(sensor_arah_angin, 0, 959, 0, 360);
  if (arah_angin == 360.00) {
    arah_angin = 0;
  }
  header += 'a';
  // value += String(arah_angin) 
  //       + ",";
  int rand_arah = random(0,360);
  value += String(rand_arah);
  value += ",";
  Serial.print("Arah Angin: ");
  Serial.print(arah_angin);
  delay(1000);
  Serial.println(" °");


  String msg = "{\"id\": \"bd950176\",\"data\": \"";
  msg += header;
  msg += "|";
  msg += value;
  msg += "\"}";

  uint32_t seed = 1;

char *key = msg.c_str();
  const int length = strlen(key);

  if (length > 0) {
    if (length >> 5) {
      for (int i = 0; i < length; i = i+32) { 
        char *str = substr(key, i, i + 32);
        if (i +32 > length) {
          str = substr(key,i, length);
        }
        char *half_str = substr(str, 0, 16);

        uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str, (uint32_t)strlen(half_str), seed);
        uint32_t fingerprint_2 = MurmurHash3_x86_32(str, (uint32_t)strlen(str), seed);
          for (Fingerprint m : metadata) {
            if (is_same(m.fingerprint_1, fingerprint_1)) {
              location = m.location;
              duplicate = true;
              break;
            }
          }  

          if (duplicate || metadata_length > metadata_size) {
            Serial.print(location);
            Serial.print(";");
            Serial2.print(location);
            Serial2.print(";");
          } else {
            metadata[metadata_length] = Fingerprint{
              fingerprint_1,
              fingerprint_2,
              metadata_length
            };
            Serial.print(str);
            Serial.print(";");
            Serial2.print(str);
            Serial2.print(";");
            metadata_length++;
          } 
        
      }
      Serial2.println("");

    }
  }

  timeout = micros();

  while (micros() - timeout < 10000000) {
    if (Serial2.available() > 0) {
      String post = Serial2.readString();
      Serial.print("dari lora: ");
      int server_location = post.substring(3,6).toInt();
      Serial.println(server_location);
      break;
    } else {
      Serial.println("Coba lagi...");
      Serial.println(timeout);
    }
    delay(100);
  }
  delay(2000);
   
  Serial.println();
}