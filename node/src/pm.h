#ifndef PM_H
#define PM_H

#define LENG 31 
unsigned char buf[LENG];
char checkValue(unsigned char *thebuf, char leng);
int transmitPM01(unsigned char *thebuf);
int transmitPM2_5(unsigned char *thebuf);
int transmitPM10(unsigned char *thebuf);

#endif