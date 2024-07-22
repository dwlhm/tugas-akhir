#include <Arduino.h>
#include <sensor/angin/ArahAnginRS.h>

int16_t ArahAnginRS::read() {
  digitalWrite(this->de,HIGH);
  digitalWrite(this->re,HIGH);
  if(this->serial-> write(this->msg,sizeof(this->msg))==8){
    this->serial->flush();
    digitalWrite(this->de, LOW);
    digitalWrite(this->re, LOW);

    if (this->serial->read() == 3) {
      this->serial->readBytes(this->value, 8);
    }

    return (this->value[1] | this->value[2]);
  } else {
    return -1;
  };
};