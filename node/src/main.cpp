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
#include "struct/Fingerprint.h"

#include <sensor.h>

void data_deduplication(String data);

const int metadata_size = 10;
int metadata_length = 0;
Fingerprint metadata[30];

String pointer_data[5];
int pointer_position = 0;
bool pointer_received = false;

String device_id = "7d80e4e0";

int hitungan = 0;
  int new_metadata = 0;
  Fingerprint new_metadata_repo[5];

void setup() {

  Serial.begin(9600);  
  Serial2.begin(9600); 
  Serial2.setTimeout(30000);

  sensor_begin();

  Serial.println();
  

}


void loop() {

  String sensorData = sensor(device_id);

  Serial.print("sensorData: ");
  Serial.println(sensorData);

  data_deduplication(sensorData);

  delay(5000); 

  Serial.print("pointer: ");
  while (Serial2.available()) {
    delay(2); 
    char c = Serial2.read();

    if (c == ';') pointer_received = true;

    if (
      c != '\u0012' 
      && c != ',' 
      && c != '\0' 
      && c != ';' 
      && !pointer_received
      ) {
        pointer_data[pointer_position] += c;
        Serial.print(c);
      }
        
    if (c == ',') pointer_position++;

  }
  
  if (pointer_received) {
    Serial.println();
    Serial.print("new_metadata: ");
    Serial.println(new_metadata);
    for (int i = 0; i < new_metadata; i++) {
      metadata[metadata_length] = Fingerprint{
        new_metadata_repo[i].fingerprint_1,
        new_metadata_repo[i].fingerprint_2,
        pointer_data[i].toInt()
      };
      metadata_length++;
    }
    
    pointer_data[0] = "";
    pointer_data[1] = "";
    pointer_data[2] = "";
    pointer_position = 0;
    pointer_received = false;
    new_metadata = 0;
  } 

  Serial.print("metadata_length: ");
  Serial.println(metadata_length);

  hitungan++;
  Serial.println();
  Serial.print("perulangan ke-");
  Serial.println(hitungan);
}

void data_deduplication(String data) { 
    String result = "";
    int data_length = data.length();
    int location = 0;
    bool duplicate = false;

    if (data_length > 0) {
        if (data_length >> 5) {
            for (int i = 0; i < data_length; i = i+32) { 
                String str = data.substring(i, i + 32);
                
                if (i +32 > data_length) str = data.substring(i, data_length);

                String half_str = data.substring(0, 16);

                uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str.c_str(), (uint32_t)half_str.length(), 1);
                uint32_t fingerprint_2 = MurmurHash3_x86_32(str.c_str(), (uint32_t)str.length(), 1);
                
                for (Fingerprint m : metadata) {
                    if (m.fingerprint_1 == fingerprint_1) {
                        if (m.fingerprint_2 == fingerprint_2) {
                            location = m.location;
                            duplicate = true;
                            break;
                        }
                    }
                }  

                if (duplicate) {
                    result += String(location);
                    result += ";";
                    duplicate = false;
                } else {
                    result += str;
                    if (str.length() >> 5)  result += ";";

                    if (metadata_length < metadata_size) {
                        new_metadata_repo[new_metadata] = Fingerprint{
                            fingerprint_1,
                            fingerprint_2,
                            new_metadata
                        };
                        new_metadata++;
                    }
                }
            }

            Serial.print("result: ");
            Serial.println(result);
            Serial2.println(result);
        }
    }
}
