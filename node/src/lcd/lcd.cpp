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
    tft.setCursor(50, 30);
    tft.print("PM 1.0");
    tft.setCursor(200, 30);
    tft.print("PM 2.5");
    tft.setCursor(370, 30);
    tft.print("PM 10");
    tft.setCursor(50, 130);
    tft.print("Temperature");
    tft.setCursor(250, 130);
    tft.print("Humidity");
    tft.setCursor(50, 230);
    tft.print("Kecepatan Angin");
    // tft.setCursor(250, 230);
    // tft.print("Proses ke-");
};

void writeLCD(SensorStruct data) {

    tft.setTextSize(3);

    // pm dfrobot
    tft.fillRect(40, 70, 420, 40, WHITE);
    tft.setCursor(50, 80);
    tft.print(data.pmDFRobot.pm1);
    tft.setCursor(200, 80);
    tft.print(data.pmDFRobot.pm25);
    tft.setCursor(370, 80);
    tft.print(data.pmDFRobot.pm10);

    // dht
    tft.fillRect(40, 170, 300, 40, WHITE);
    tft.setCursor(50, 180);
    tft.print(data.dht.temperature);
    tft.setCursor(250, 180);
    tft.print(data.dht.humidity);

    // angin
    tft.fillRect(50, 280, 380, 320, WHITE);
    tft.setCursor(50, 280);
    tft.print(data.kecepatanAngin);
    // tft.setCursor(250, 280);
    // tft.print(tempat);
    // tempat++;
};
