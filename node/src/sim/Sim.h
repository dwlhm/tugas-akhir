#ifndef Sim_H
#define Sim_H

#include <Arduino.h>
#include <struct/GatewayStruct.h>

class Sim {
    private:
        HardwareSerial* serial;
        String response;
        String gatewayId = "83930168";
        String ipServer = "103.150.197.37";
        String unameGateway = "b8e3d85f";
        String passGateway = "f101ceaab24e3dc7";
        String commands[10] = {
            "AT+CMQTTSUBTOPIC=0,25,0",
            "node/" + gatewayId + "/prod/action",
            "AT+CMQTTSUB=0",
            "AT+CMQTTTOPIC=0,23",
            "node/" + gatewayId + "/prod/data",
            "AT+CMQTTPAYLOAD=0,58",
            "{\"id\": \"c1151e2a\",\"data\": \"ht120;v|69,28,18,26,49,2.11,\"};",
            "AT+CMQTTPUB=0,0,120",
            //"AT+CMQTTDISC=0,120"
        };
        String sendData(String command, const int timeout) {
            String response = "";
            this->serial->println(command);
            
            long int time = millis();
            while ( (time + timeout) > millis())
            {
                while (this->serial->available())
                {
                char c = this->serial->read();
                response += c;
                }
            }
            return response;
        };
    public:
        Sim(HardwareSerial &serial, GatewayStruct gateway, String ip_server) {
            this->serial = &serial;
            this->gatewayId = gateway.id;
            this->unameGateway = gateway.username;
            this->passGateway = gateway.password;
            this->ipServer = ip_server;
        };
        void init() {
            this->serial->begin(115200);
            delay(30000);
            this->sendData("AT+CMQTTSTART", 3000);
            this->sendData("AT+CMQTTACCQ=0,\"" + this->gatewayId + "\",0,3", 3000);
            this->sendData("AT+CMQTTCONNECT=0,\"tcp://" + ipServer + "\",60,0,\"" + unameGateway + "\",\"" + passGateway + "\"", 3000);
        }
        String sendMqtt(String msg);
};

#endif