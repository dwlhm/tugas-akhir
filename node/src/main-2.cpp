// //******************************
//  //*Abstract: Read value of PM1,PM2.5,PM10,
//  //           Temperature and Humidity of ambient air
//  //
//  //*Version：V1.0
//  //*Author：Dwi Ilham Maulana <hi@dwlhm.space>
//  //*Date：February.12.2023
//  //******************************
// #include <Arduino.h>

// #include <Servo.h>

// #include <Adafruit_GFX.h>
// #include <MCUFRIEND_kbv.h>   // Hardware-specific library
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
// #include <pm.h>

// DHT_Unified dht(23, DHT22);
// sensors_event_t event;
// String sensor(String device_id);

// void data_deduplication(String data);

// void task();

// const int metadata_size = 10;
// int metadata_length = 0;
// Fingerprint metadata[30];

// String pointer_data[5];
// int pointer_position = 0;
// bool pointer_received = false;

// String device_id = "7d80e4e0";

// int hitungan = 0;
// int patokan = 0;
// int new_metadata = 0;
// Fingerprint new_metadata_repo[5];

// // Assign human-readable names to some common 16-bit color values:
// #define	BLACK   0x0000
// #define	BLUE    0x001F
// #define	RED     0xF800
// #define	GREEN   0x07E0
// #define CYAN    0x07FF
// #define MAGENTA 0xF81F
// #define YELLOW  0xFFE0
// #define WHITE   0xFFFF

// Servo myServo;
// bool gateway_msg_received = true;

// void sensor_begin() {
//     dht.begin();
//     sensor_t sensor;
//     dht.temperature().getSensor(&sensor);
//     dht.humidity().getSensor(&sensor);
//     Serial2.begin(9600); 
// }

// bool compare(uint32_t a, uint32_t b) {
//     Serial.println(a == b);
//   return a == b;
// }

// String task_sensor();

// void setup() {

//     Serial.begin(9600);  
//     Serial1.begin(9600); 

//     sensor_begin();

//     myServo.attach(44);
  
//     uint16_t ID = tft.readID();
//     if (ID == 0xD3D3) ID = 0x9481; //force ID if write-only display
//     tft.begin(ID);
//     tft.setRotation(1);
//     tft.fillScreen(WHITE);
//     tft.setTextColor(BLACK);
//     tft.setTextSize(2);
//     tft.setCursor(50, 30);
//     tft.print("PM 1.0");
//     tft.setCursor(200, 30);
//     tft.print("PM 2.5");
//     tft.setCursor(370, 30);
//     tft.print("PM 10");
//     tft.setCursor(50, 130);
//     tft.print("Temperature");
//     tft.setCursor(250, 130);
//     tft.print("Humidity");
//     tft.setCursor(50, 230);
//     tft.print("Kecepatan Angin");
//     tft.setCursor(250, 230);
//     tft.print("Arah Angin");
//     tft.fillRect(0, 0, 420, 20, WHITE);
//     tft.setCursor(1,0);
//     tft.print("Lora [CONNECTING]");
//     tft.setTextSize(3);

// }

// void loop() {
  
//   task();
  
// }

// void task() {

//     String sensorData = task_sensor();

//     // deduplikasi data
//     String result = "";
//     int data_length = sensorData.length();

//     if (
//         data_length > 0 && 
//         data_length >> 5
//     ) {
//         for (int i = 0; i < data_length; i = i+32) { 
//             String location = "";
//             bool duplicate = false;
//             String str = sensorData.substring(i, i + 32);
                
//             if (i +32 > data_length) str = sensorData.substring(i, data_length);

//             String half_str = sensorData.substring(0, 16);

//             uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str.c_str(), (uint32_t)half_str.length(), 1);
//             uint32_t fingerprint_2 = MurmurHash3_x86_32(str.c_str(), (uint32_t)str.length(), 1);
//             delay(2);
            
//             for (int i = 0; i > metadata_length; i++) {
//                     Serial.print(i);
//                     Serial.print(". ");
//                     Serial.print(fingerprint_2);
//                     Serial.print(" == ");
//                     Serial.println(metadata[i].fingerprint_2);
//                 if (
//                     metadata[i].fingerprint_1 == fingerprint_1 &&
//                     fingerprint_2 == metadata[i].fingerprint_2
//                 ) {
//                     Serial.println(metadata[i].location);
//                     result += metadata[i].location;
//                     result += ";";
//                     break;
//                 } else {
//                     result += str;
//                     if (str.length() >> 5)  result += ";";

//                     if (metadata_length < metadata_size) {
//                         metadata[metadata_length] = Fingerprint{
//                             fingerprint_1,
//                             fingerprint_2,
//                             ""
//                         };
//                         new_metadata++;
//                     }
//                 }
//             }  

//             // if (duplicate) {
//             //     Serial.println("duuu");
//             //     result += location;
//             //     result += ";";
//             //     duplicate = false;
//             // } else {
//             //     result += str;
//             //     if (str.length() >> 5)  result += ";";

//             //     if (metadata_length < metadata_size) {
//             //             new_metadata_repo[new_metadata] = Fingerprint{
//             //                 fingerprint_1,
//             //                 fingerprint_2,
//             //                 ""
//             //             };
//             //             new_metadata++;
//             //         }
//             //     }
//             // }

//         }
        
//             Serial.print("result: ");
//             Serial.println(result);
//             // Serial1.println(result);
//     }
//     Serial.print("metadata_length: ");
//     Serial.println(metadata_length);

//     Serial.println("");
//     delay(5000);
//     // gateway_msg_received = true;
//     // tft.fillRect(0, 0, 420, 20, WHITE);
//     // tft.setTextSize(2);
//     // tft.setCursor(1,0);
//     // tft.print("Lora [CONNECTED]");
        
//     // Serial.print("gateway msg: ");
//     // while (Serial1.available()) {
//     //     delay(2); 
//     //     char c = Serial1.read();

//     //     if (c == ';') pointer_received = true;

//     //     if (
//     //         c != '\u0012' 
//     //         && c != ',' 
//     //         && c != '\0' 
//     //         && c != ';' 
//     //         && !pointer_received
//     //     ) {
//     //         pointer_data[pointer_position] += c;
//     //         Serial.print(c);
//     //     }
                
//     //     if (c == ',') pointer_position++;
//     // }
    
//     // if (pointer_received) {
//     //     Serial.println();
//     //     Serial.print("new_metadata: ");
//     //     Serial.println(new_metadata);
//     //     for (int i = 0; i < new_metadata; i++) {
//     //         Serial.print(i);
//     //         Serial.print(": ");
//     //         Serial.println(new_metadata_repo[i].fingerprint_1);
//     //         metadata[metadata_length] = Fingerprint{
//     //             new_metadata_repo[i].fingerprint_1,
//     //             new_metadata_repo[i].fingerprint_2,
//     //             pointer_data[i]
//     //         };
//     //     }
//     //     metadata_length++;
//     // }
            
//     // pointer_data[0] = "";
//     // pointer_data[1] = "";
//     // pointer_data[2] = "";
//     // pointer_position = 0;
//     // pointer_received = false;
//     // new_metadata = 0;

//     // Serial.print("metadata_length: ");
//     // Serial.println(metadata_length);

//     // hitungan++;
//     // Serial.println();
//     // Serial.print("deduplikasi ke-");
//     // Serial.println(hitungan);
//     // Serial.println();

//     // // patokan++;
//     // // Serial.println();
//     // // Serial.print("patokan ke-");
//     // // Serial.println(patokan);
//     // tft.setTextSize(3);

// }

// String task_sensor() {
//     String header = "";
//     String error = "";
//     String value = "";

//     // pm1.0, pm2.5, pm10
//     if(Serial2.find(0x42)){    
//         Serial2.readBytes(buf,LENG);

//         if(buf[0] == 0x4d){
//             if(checkValue(buf,LENG)){
//                 header += "120";
//                 value += String(transmitPM01(buf)) 
//                     + ","
//                     + String(transmitPM2_5(buf))  
//                     + ","
//                     + String(transmitPM10(buf)) 
//                     + ",";

//                 Serial.print("pm1.0: ");
//                 Serial.println(transmitPM01(buf));
//                 Serial.print("pm2.5: ");
//                 Serial.println(transmitPM2_5(buf));
//                 Serial.print("pm10: ");
//                 Serial.println(transmitPM10(buf));

//                 tft.fillRect(40, 70, 420, 40, WHITE);
//                 tft.setCursor(50, 80);
//                 tft.print(transmitPM01(buf));
//                 tft.setCursor(200, 80);
//                 tft.print(transmitPM2_5(buf));
//                 tft.setCursor(370, 80);
//                 tft.print(transmitPM10(buf));
                
//             } else {
//                 error += "120";
//             }
//         } else {
//             error += "120";
//         }
//     } else {
//         Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
//         error += "120";
//     }

//     // dht temperature
//     tft.fillRect(40, 170, 300, 40, WHITE);
//     dht.temperature().getEvent(&event);
//     if (isnan(event.temperature)) {
//         Serial.println(F("Error reading temperature"));
//         error += "t";
//     } else {
//         header += "t";
//         value += String(event.temperature) + ",";
//         Serial.print("temperature: ");
//         Serial.println(event.temperature);
//         tft.setCursor(50, 180);
//         tft.print(event.temperature);
//     }

//     // dht humidity
//     dht.humidity().getEvent(&event);
//     if (isnan(event.relative_humidity)) {
//         Serial.println(F("Error reading humidity!"));
//         error += "h";
//     } else {
//         header += "h";
//         value += String(event.relative_humidity) + ",";
//         Serial.print("humidity: ");
//         Serial.println(event.relative_humidity);
//         tft.setCursor(250, 180);
//         tft.print(event.relative_humidity);
//     }

//     tft.fillRect(50, 280, 380, 320, WHITE);
//     // anemometer 
//     header += "v";
//     float anemometer = (analogRead(A6) - 51.174)/44.952;
//     if (anemometer < 0) anemometer = 0;
//     value += String(anemometer);
//     value += ",";
//     tft.setCursor(50, 280);
//     tft.print(anemometer);

//     // arah angin
//     float arah_angin = (0.3504*analogRead(A7))+0.2038;
//     if (arah_angin == 360.00) {
//         arah_angin = 0;
//     }
//     myServo.write(arah_angin/2);
//     header += 'a';
//     value += String(arah_angin);
//     value += ",";
//     tft.setCursor(250, 280);
//     tft.print(arah_angin);

//     // data
//     // if (gateway_msg_received) {
//     String sensorData = "{\"id\": \"" + device_id + "\",\"data\": \"" + header + error + "|" + value + "\"}";
//     Serial.print("sensorData: ");
//     Serial.println(sensorData);
//     return sensorData;
// }