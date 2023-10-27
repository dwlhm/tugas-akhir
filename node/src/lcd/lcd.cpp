#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <MCUFRIEND_kbv.h>  

#include <struct/SensorStruct.h> 

MCUFRIEND_kbv tft;

const PROGMEM int BLACK = 0x0000;
const PROGMEM int WHITE = 0xFFFF;

uint32_t tempat = 0;

void initLCD() {
    uint16_t ID = tft.readID();
    if (ID == 0xD3D3) ID = 0x9481; 
    tft.begin(ID);
    tft.setRotation(1);
    tft.fillScreen(WHITE);
    tft.setTextColor(BLACK);
    tft.setTextSize(2);
    tft.setCursor(20, 30);
    tft.print("PM 1.0");
    tft.setCursor(180, 30);
    tft.print("PM 2.5");
    tft.setCursor(340, 30);
    tft.print("PM 10");
    tft.setCursor(20, 130);
    tft.print("Suhu");
    tft.setCursor(180, 130);
    tft.print("Humidity");
    // tft.setCursor(340, 130);
    // tft.print("Humidity");
    tft.setCursor(20, 230);
    tft.print("Kecepatan Angin");
    // tft.setCursor(340, 230);
    // tft.print("Arah Angin");
};

void writeLCD(SensorStruct data) {

    tft.setTextSize(3);

    tft.fillRect(20, 70, 420, 40, WHITE);
    tft.setCursor(20, 80);
    tft.print(data.pmDFRobot.pm1);
    tft.setCursor(180, 80);
    tft.print(data.pmDFRobot.pm25);
    tft.setCursor(340, 80);
    tft.print(data.pmDFRobot.pm10);

    tft.fillRect(20, 170, 420, 40, WHITE);
    tft.setCursor(20, 180);
    tft.print(data.dht.temperature);
    tft.setCursor(180, 180);
    tft.print(data.dht.humidity);
    // tft.setCursor(340, 180);
    // tft.print(data.dht.humidity);

    tft.fillRect(20, 280, 380, 320, WHITE);
    tft.setCursor(20, 280);
    tft.print(data.kecepatanAngin);
    // tft.setCursor(340, 280);
    // tft.print(data.arahAngin);

    // debug
    Serial.println("");
    Serial.print(data.pmDFRobot.pm1);
    Serial.print(";");
    Serial.print(data.pmDFRobot.pm25);
    Serial.print(";");
    Serial.print(data.pmDFRobot.pm10);
    Serial.print(";");
    // Serial.print(data.pm100);
    // Serial.print(";");
    Serial.print(data.dht.temperature);
    Serial.print(";");
    Serial.print(data.dht.humidity);
    Serial.print(";");
    // Serial.print(data.arahAngin);
    // Serial.print(";");
    Serial.print(data.kecepatanAngin);
    Serial.println(";");
};
