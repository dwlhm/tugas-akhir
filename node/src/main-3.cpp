// //******************************
//  //*Abstract: Read value of PM1,PM2.5,PM10,
//  //           Temperature and Humidity of ambient air
//  //
//  //*Version：V1.0
//  //*Author：Dwi Ilham Maulana <hi@dwlhm.space>
//  //*Date：February.12.2023
//  //******************************
// #include <Arduino.h>

// #include <Adafruit_GFX.h>
// #include <MCUFRIEND_kbv.h>   
// MCUFRIEND_kbv tft;

// #include "helpers/MurmurHash3.h"

// struct Fingerprint {
//   uint32_t fingerprint_1;
//   uint32_t fingerprint_2;
//   String location;
// };

// #include <Adafruit_Sensor.h>
// #include <DHT.h>
// #include <DHT_U.h>
// #include <Servo.h>


// char checkValue(unsigned char *thebuf, char leng)
// {
//   char receiveflag=0;
//   int16_t receiveSum=0;

//   for(int16_t i=0; i<(leng-2); i++){
//   receiveSum=receiveSum+thebuf[i];
//   }
//   receiveSum=receiveSum + 0x42;

//   if(receiveSum == ((thebuf[leng-2]<<8)+thebuf[leng-1]))  
//   {
//     receiveSum = 0;
//     receiveflag = 1;
//   }
//   return receiveflag;
// }

// int16_t transmitPM01(unsigned char *thebuf)
// {
//   int16_t PM01Val;
//   PM01Val=((thebuf[3]<<8) + thebuf[4]); 
//   return PM01Val;
// }

// int16_t transmitPM2_5(unsigned char *thebuf)
// {
//   int16_t PM2_5Val;
//   PM2_5Val=((thebuf[5]<<8) + thebuf[6]);
//   return PM2_5Val;
//   }

// int16_t transmitPM10(unsigned char *thebuf)
// {
//   int16_t PM10Val;
//   PM10Val=((thebuf[7]<<8) + thebuf[8]); 
//   return PM10Val;
// }

// Servo myServo;

// unsigned char buf[31];
// #define LENG 31

// DHT_Unified dht(23, DHT22);
// sensors_event_t event;

// String sensor(String device_id);
// void sensor_begin();

// void data_deduplication(String data);

// const int metadata_size = 10;
// int metadata_length = 0;
// Fingerprint metadata[30];

// String pointer_data[5];
// int pointer_position = 0;
// bool pointer_received = false;

// String device_id = "7d80e4e0";

// int hitungan = 0;
// int new_metadata = 0;
// Fingerprint new_metadata_repo[5];

// #define	BLACK   0x0000
// #define WHITE   0xFFFF

// void setup() {

//   Serial.begin(9600);  
//   Serial2.begin(9600); 

//   sensor_begin();

//   myServo.attach(44);
  
//   uint16_t ID = tft.readID();
//   if (ID == 0xD3D3) ID = 0x9481; //force ID if write-only display
//   tft.begin(ID);
//   tft.setRotation(1);
//   tft.fillScreen(WHITE);

// }

// void loop() {
  
//   tft.setTextColor(BLACK);
//   tft.setTextSize(2);
//   tft.setCursor(50, 30);
//   tft.print("PM 1.0");
//   tft.setCursor(200, 30);
//   tft.print("PM 2.5");
//   tft.setCursor(370, 30);
//   tft.print("PM 10");
//   tft.setCursor(50, 130);
//   tft.print("Temperature");
//   tft.setCursor(250, 130);
//   tft.print("Humidity");
//   tft.setCursor(50, 230);
//   tft.print("Kecepatan Angin");
//   tft.setCursor(250, 230);
//   tft.print("Arah Angin");
//   tft.setTextSize(3);

//     String header = "";
//     // String error = "";
//     String value = "";

//     // dht temperature
//     tft.fillRect(40, 170, 300, 40, WHITE);
//     dht.temperature().getEvent(&event);
//     if (isnan(event.temperature)) {
//         Serial.println(F("Error reading temperature"));
//         // error += "t";
//     } else {
//         header += "t";
//         value += String(event.temperature);
//         Serial.print("temperature: ");
//         Serial.println(event.temperature);
//         tft.setCursor(50, 180);
//         tft.print(event.temperature);
//     }
    
//     // dht humidity
//     dht.humidity().getEvent(&event);
//     if (isnan(event.relative_humidity)) {
//         Serial.println(F("Error reading humidity!"));
//         // error += "h";
//     } else {
//         header += "h";
//         value += String(event.relative_humidity);
//         Serial.print("humidity: ");
//         Serial.println(event.relative_humidity);
//         tft.setCursor(250, 180);
//         tft.print(event.relative_humidity);
//     }

//     // pm1.0, pm2.5, pm10
//      if(Serial1.find(0x42)){    
//   Serial1.readBytes(buf,LENG);

//   if(buf[0] == 0x4d){
//     if(checkValue(buf,LENG)){
//       header += "120";
//       value += String(transmitPM01(buf)) 
//         + ","
//         + String(transmitPM2_5(buf))  
//         + ","
//         + String(transmitPM10(buf)) 
//         + ",";
//       // value += String(random(10,20)) 
//       //   + ","
//       //   + String(random(20,30))  
//       //   + ","
//       //   + String(random(30,40)) 
//       //   + ",";

//       Serial.print(F("PM1.0: "));
//       Serial.println(transmitPM01(buf));
//       Serial.print(F("PM2.5: "));
//       Serial.println(transmitPM2_5(buf));
//       Serial.print(F("PM10: "));
//       Serial.println(transmitPM10(buf));

                
//     }
//   }
// } else {
//   Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
//   // error += "120";
// } 

//     // anemometer 
//     float anemometer = (analogRead(A6) - 51.174)/44.952;
//     if (anemometer < 0) anemometer = 0;
//     header += "v";
//     value += String(anemometer);
//     value += ",";

//     // arah angin
//     float arah_angin = (0.3504*analogRead(A1))+0.2038+0.5 ;
//     if (arah_angin == 360.00) {
//         arah_angin = 0;
//     }
//     header += 'a';
//     value += String(arah_angin);
//     value += ",";

//     myServo.write(arah_angin/2);

//     // data
//     String sensorData = "{\"id\": \"" + device_id + "\",\"data\": \"" + header + "|" + value + "\"}"; 
  
//   tft.fillRect(50, 280, 380, 320, WHITE);
//   tft.setCursor(50, 280);
//   tft.print(anemometer);
//   tft.setCursor(250, 280);
//   tft.print(arah_angin);

//   Serial.print("sensorData: ");
//   Serial.println(sensorData);

//   data_deduplication(sensorData);

//   delay(5000); 

//   Serial.print("pointer: ");
//   while (Serial2.available()) {
//     delay(2); 
//     char c = Serial2.read();

//     if (c == ';') pointer_received = true;

//     if (
//       c != '\u0012' 
//       && c != ',' 
//       && c != '\0' 
//       && c != ';' 
//       && !pointer_received
//       ) {
//         pointer_data[pointer_position] += c;
//         Serial.print(c);
//       }
        
//     if (c == ',') pointer_position++;

//   }
  
//   if (pointer_received) {
//     Serial.println();
//     Serial.print("new_metadata: ");
//     Serial.println(new_metadata);
//     for (int i = 0; i < new_metadata; i++) {
//       metadata[metadata_length] = Fingerprint{
//         new_metadata_repo[i].fingerprint_1,
//         new_metadata_repo[i].fingerprint_2,
//         pointer_data[i]
//       };
//       metadata_length++;
//     }
    
//     pointer_data[0] = "";
//     pointer_data[1] = "";
//     pointer_data[2] = "";
//     pointer_position = 0;
//     pointer_received = false;
//     new_metadata = 0;
//   } 

//   Serial.print("metadata_length: ");
//   Serial.println(metadata_length);

// //   delay(300000);

//   hitungan++;
//   Serial.println();
//   Serial.print("perulangan ke-");
//   Serial.println(hitungan);
// }

// void data_deduplication(String data) { 
//     String result = "";
//     int data_length = data.length();

//     if (data_length > 0) {
//         if (data_length >> 5) {
//             for (int i = 0; i < data_length; i = i+32) { 
//                 String location = "";
//                 bool duplicate = false;
//                 String str = data.substring(i, i + 32);
                
//                 if (i +32 > data_length) str = data.substring(i, data_length);

//                 String half_str = data.substring(0, 16);

//                 uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str.c_str(), (uint32_t)half_str.length(), 1);
//                 uint32_t fingerprint_2 = MurmurHash3_x86_32(str.c_str(), (uint32_t)str.length(), 1);
                
//                 for (Fingerprint m : metadata) {
//                     if (m.fingerprint_1 == fingerprint_1) {
//                         if (m.fingerprint_2 == fingerprint_2) {
//                             location = m.location;
//                             duplicate = true;
//                             break;
//                         }
//                     }
//                 }  

//                 if (duplicate) {
//                     result += location;
//                     result += ";";
//                     duplicate = false;
//                 } else {
//                     result += str;
//                     if (str.length() >> 5)  result += ";";

//                     if (metadata_length < metadata_size) {
//                         new_metadata_repo[new_metadata] = Fingerprint{
//                             fingerprint_1,
//                             fingerprint_2,
//                             ""
//                         };
//                         new_metadata++;
//                     }
//                 }
//             }

//             Serial.print("result: ");
//             Serial.println(result);
//             Serial2.println(result);
//         }
//     }
// }

// void sensor_begin() {
//     dht.begin();
//     sensor_t sensor;
//     dht.temperature().getSensor(&sensor);
//     dht.humidity().getSensor(&sensor);
//     Serial1.begin(9600); 
// }