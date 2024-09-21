#include <Arduino.h>
#include <sim/Sim.h>

String Sim::sendMqtt(String msg) {
    int msg_length = msg.length();
    this->commands[5] = "AT+CMQTTPAYLOAD=0," + (String)msg_length;
    this->commands[6] = msg;
    for (size_t i = 0; i < 8; i++) {
        String response = sendData(commands[i], 1000);

        if (response.indexOf("+CMQTTRXPAYLOAD: 0,") > 0) {
           String r = response.substring(response.indexOf("+CMQTTRXPAYLOAD: 0,") + 19, response.indexOf("\n+CMQTTRXEND"));
           this->response = r.substring(r.indexOf("\n") + 1);
        }
    }

    return this->response;
}
