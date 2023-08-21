#include <Arduino.h>
#include <struct/PMDFRobotStruct.h>

#include <sensor/pm/PMDFRobot.h>

char PMDFRobot::checkValue(unsigned char *thebuf, char leng)
{
  char receiveflag = 0;
  int16_t receiveSum = 0;

  for (int16_t i = 0; i < (leng - 2); i++)
  {
    receiveSum = receiveSum + thebuf[i];
  }
  receiveSum = receiveSum + 0x42;

  if (receiveSum == ((thebuf[leng - 2] << 8) + thebuf[leng - 1]))
  {
    receiveSum = 0;
    receiveflag = 1;
  }
  return receiveflag;
}

int16_t PMDFRobot::transmitPM01(unsigned char *thebuf) { return ((thebuf[3] << 8) + thebuf[4]); }

int16_t PMDFRobot::transmitPM2_5(unsigned char *thebuf) { return ((thebuf[5] << 8) + thebuf[6]); }

int16_t PMDFRobot::transmitPM10(unsigned char *thebuf) { return ((thebuf[7] << 8) + thebuf[8]); }

PMDFRobotStruct PMDFRobot::read()
{

  unsigned char buf[31];

  this->serial->flush();
  if (this->serial->find(0x42))
  {
    this->serial->readBytes(buf, 31);

    if (buf[0] == 0x4d)
    {
      if (checkValue(buf, 31))
      {

        return PMDFRobotStruct{
            transmitPM01(buf),
            transmitPM2_5(buf),
            transmitPM10(buf)};
      }
    }
  }
  else {
    return PMDFRobotStruct{
      int16_t(-1), 
      int16_t(-1), 
      int16_t(-1)
    };
  }
}