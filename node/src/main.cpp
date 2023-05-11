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

const int metadata_size = 100;
int new_metadata = 0;

Fingerprint metadata[metadata_size];
bool duplicate = false;
int location = 0;
int metadata_length = 0;

unsigned long timeout;

String pointer_data[3];
int pointer_position = 0;
bool pointer_received = false;

void setup() {

  Serial.begin(9600);  
  Serial2.begin(9600); 
  Serial2.setTimeout(30000);

  Serial.println();
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  dht.humidity().getSensor(&sensor);

  Serial1.begin(9600); 

}


void loop() {
  
  sensors_event_t event;
  String header = "";
  String value = "";

  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature"));
  } else {
    // Serial.print(F("Temperature:  "));
    // Serial.print(event.temperature);
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
    // Serial.print(F("Humidity: "));
    // Serial.print(event.relative_humidity);
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
        // Serial.print("PM1.0:  ");
        // Serial.print(PM01Value);
        // Serial.println(" ug/m3");
        // Serial.print("PM2.5:  ");
        // Serial.print(PM2_5Value);
        // Serial.println(" ug/m3");
        // Serial.print("PM1 0:  ");
        // Serial.print(PM10Value);
        // Serial.println(" ug/m3");
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
  // Serial.print("Wind speed: ");
  // Serial.print(level_anemometer);
  // Serial.println(" level now");

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
  // Serial.print("Arah Angin: ");
  // Serial.print(arah_angin);
  // Serial.println(" °");


  String msg = "{\"id\": \"5d5bb1a0\",\"data\": \"";
  msg += header;
  msg += "|";
  msg += value;
  msg += "\"}";

  Serial.print("data: ");
  Serial.println(msg);

  uint32_t seed = 1;

  char *key = msg.c_str();
  const int length = strlen(key);
  Fingerprint new_metadata_repo[3];

  Serial.print("message: ");
  String lora_message = "";

  if (length > 0) {
    if (length >> 5) {
      for (int i = 0; i < length; i = i+32) { 
        char *str = substr(key, i, i + 32);
        if (i +32 > length) {
          str = substr(key,i, length);
        }
        char *half_str = substr(str, 0, 16);
        // Serial.print("half_str: ");
        // Serial.println(half_str);
        // Serial.print("str: ");
        // Serial.println(str);

        uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str, (uint32_t)strlen(half_str), seed);
        uint32_t fingerprint_2 = MurmurHash3_x86_32(str, (uint32_t)strlen(str), seed);
          for (Fingerprint m : metadata) {
            if (is_same(m.fingerprint_1, fingerprint_1)) {
              Serial.print("fingerprint_1 of ");
              Serial.print(m.location);
              Serial.println(": -passed");
              if (is_same(m.fingerprint_2, fingerprint_2)) {
                location = m.location;
                duplicate = true;
                Serial.print("fingerprint_2 of ");
                Serial.print(m.location);
                Serial.println(": -passed");
                break;
              }
            }
          }  

          if (duplicate) {
            Serial.print(location);
            Serial.print(";");
            lora_message += String(location);
            lora_message += ";";
            duplicate = false;
          } else {
            new_metadata_repo[new_metadata] = Fingerprint{
              fingerprint_1,
              fingerprint_2,
              new_metadata
            };
            Serial.print(str);
            Serial.print(";");
            lora_message += str;
            lora_message += ";";
            new_metadata++;
          } 
        
      }
      Serial.println("");
      Serial2.println(lora_message);

    }
  }

  timeout = micros();
  Serial2.flush();
  delay(5000); //delay to allow byte to arrive in input buffer

  while (Serial2.available()) {
    delay(2); //delay to allow byte to arrive in input buffer
    char c = Serial2.read();

    if (c == ';') pointer_received = true;

    if (
      c != '\u0012' 
      && c != ',' 
      && c != '\0' 
      && c != ';' 
      && !pointer_received
      ) pointer_data[pointer_position] += c;
        
    if (c == ',') pointer_position++;

  }
  
  if (pointer_received) {
    Serial.print("new_metadata: ");
    Serial.println(new_metadata);
    Serial.print("metadata_length: ");
    Serial.println(metadata_length);
    for (int i = 0; i < new_metadata; i++) {
      metadata[metadata_length] = Fingerprint{
        new_metadata_repo[i].fingerprint_1,
        new_metadata_repo[i].fingerprint_2,
        pointer_data[i].toInt()
      };
      Serial.print("metadata ");
      Serial.print(metadata_length);
      Serial.println(": ");
      Serial.println(metadata[metadata_length].fingerprint_2);
      Serial.println(metadata[metadata_length].location);
      metadata_length++;
    }
    
    pointer_data[0] = "";
    pointer_data[1] = "";
    pointer_data[2] = "";
    pointer_position = 0;
    pointer_received = false;
    new_metadata = 0;
  } 
  delay(2000);
   
  Serial.println();
}