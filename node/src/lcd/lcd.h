#ifndef lcd_H
#define lcd_H

#include <struct/SensorStruct.h>
#include <Adafruit_GFX.h>
#include <MCUFRIEND_kbv.h>  

extern MCUFRIEND_kbv tft;
extern const PROGMEM int BLACK = 0x0000;
extern const PROGMEM int WHITE = 0xFFFF;

void initLCD();

void writeLCD(SensorStruct data);

#endif