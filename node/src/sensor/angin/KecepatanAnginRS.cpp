#include <Arduino.h>
#include <sensor/angin/KecepatanAnginRS.h>

float KecepatanAnginRS::read() {
    digitalWrite(this->de,HIGH);
    digitalWrite(this->re,HIGH);
    if (this->serial->write(this->msg, sizeof(this->msg)) == 8) {
        int16_t speed;
        this->serial->flush();
        digitalWrite(this->de, LOW);
        digitalWrite(this->re, LOW);

        if (this->serial->read() == 3) {
            this->serial->readBytes(this->value, 8);
        };

        speed = this->value[1] | this->value[2], DEC;
        return speed/10;
    }
}