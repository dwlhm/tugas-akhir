//******************************
 //*Abstract: Read value of PM1,PM2.5,PM10,
 //           Temperature and Humidity of ambient air
 //
 //*Version：V1.0
 //*Author：Dwi Ilham Maulana <hi@dwlhm.space>
 //*Date：February.12.2023
 //******************************
#include <Arduino.h>

// #include "helpers/MurmurHash3.h"
// #include "helpers/Print64.h"

// #include <Adafruit_Sensor.h>
// #include <DHT.h>
// #include <DHT_U.h>

// #define DHTPIN 7
// #define DHTTYPE    DHT22
// DHT_Unified dht(DHTPIN, DHTTYPE);
// uint32_t delayMS;

// #include "pm.h"

// int PM01Value;
// int PM2_5Value;
// int PM10Value;



void setup() {

  Serial.begin(9600);  

  // uint64_t seed = 1;
  // uint64_t hash_otpt[2]; // allocate 128 bits
  // const char *key = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ";
  // Serial.println(strlen(key));
  // MurmurHash3_x64_128(key, (uint64_t)strlen(key), seed, hash_otpt);
  // uint64_t hsh = hash_otpt;
  // Serial.print("hashed: ");
  // print64(&Serial, hash_otpt[0]);
  // print64(&Serial, hash_otpt[1]);
  // // Serial.print(String(hash_otpt[0]));
  // Serial.print(hsh);

  // Serial.println();
  // dht.begin();
  // sensor_t sensor;
  // dht.temperature().getSensor(p&sensor);
  // dht.humidity().getSensor(&sensor);

  // Serial1.begin(9600); 
  Serial2.begin(9600); 

}


void loop() {

  // delay(5000);
  // sensors_event_t event;
  String header = "";
  String value = "";

  // dht.temperature().getEvent(&event);
  // if (isnan(event.temperature)) {
  //   Serial.println(F("Error reading temperature"));
  // } else {
  //   Serial.print(F("Temperature:  "));
  //   Serial.print(event.temperature);
  //   header += "t";
  //   value += String(event.temperature);
  //   Serial.println(F(" °C"));
  // }

  // dht.humidity().getEvent(&event);
  // if (isnan(event.relative_humidity)) {
  //   Serial.println(F("Error reading humidity!"));
  // } else {
  //   Serial.print(F("Humidity: "));
  //   Serial.print(event.relative_humidity);
  //   header += "h";
  //   value += String(event.relative_humidity);
  //   Serial.println(F(" %"));
  // }

  // if(Serial1.find(0x42)){    
  //   Serial1.readBytes(buf,LENG);

  //   if(buf[0] == 0x4d){
  //     if(checkValue(buf,LENG)){
  //       PM01Value=transmitPM01(buf); 
  //       PM2_5Value=transmitPM2_5(buf);
  //       PM10Value=transmitPM10(buf);
  //       header += "120";
  //       value += String(PM01Value) 
  //             + String(PM2_5Value) 
  //             + String(PM10Value);

  //       Serial.print("PM1.0:  ");
  //       Serial.print(PM01Value);
  //       Serial.println(" ug/m3");
  //       Serial.print("PM2.5:  ");
  //       Serial.print(PM2_5Value);
  //       Serial.println(" ug/m3");
  //       Serial.print("PM1 0:  ");
  //       Serial.print(PM10Value);
  //       Serial.println(" ug/m3");
  //     }
  //   }
  // } else {
  //   Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
  // }

  int sensor_anemometer = analogRead(A0);
  float anemometer = sensor_anemometer * (5.0 / 1023.0);
  float level_anemometer = 6*anemometer;
  header += "v";
  value += level_anemometer;
  // Serial.print("Wind speed: ");
  // Serial.print(level_anemometer);
  // Serial.println(" level now");

  int sensor_arah_angin = analogRead(A1);
  float arah_angin = map(sensor_arah_angin, 0, 959, 0, 360);
  if (arah_angin == 360.00) {
    arah_angin = 0;
  }
  header += 'a';
  value += String(arah_angin);
  // Serial.print("Arah Angin: ");
  // Serial.print(arah_angin);
  // delay(1000);
  // Serial.println(" °");


  String msg = "{\"id\": \"bd950176\",\"data\": \"";
  msg += header;
  msg += "|";
  msg += value;
  msg += "\"}";
  Serial.print("[LoRa_msg] " + msg);
  Serial.print("/");
  Serial2.println(msg);
  
  for(int i=0; i<msg.length(); i++) {    
      char myChar = msg.charAt(i);        
      for(int i=7; i>=0; i--) {       
          byte bytes = bitRead(myChar,i);       
          Serial.print(bytes, BIN);     
      }     
      Serial.print(" ");  
  }
   
  Serial.println();
}