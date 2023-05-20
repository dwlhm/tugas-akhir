#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <pm.h>
#include <DHT_U.h>

DHT_Unified dht(7, DHT22);
sensors_event_t event;

void sensor_begin() {
    dht.begin();
    sensor_t sensor;
    dht.temperature().getSensor(&sensor);
    dht.humidity().getSensor(&sensor);
    Serial1.begin(9600); 
}

String sensor(String device_id) {

    String header = "";
    String error = "";
    String value = "";

    // dht temperature
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
        Serial.println(F("Error reading temperature"));
        error += "t";
    } else {
        header += "t";
        value += String(event.temperature);
        Serial.print("temperature: ");
        Serial.println(event.temperature);
    }

    // dht humidity
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
        Serial.println(F("Error reading humidity!"));
        error += "h";
    } else {
        header += "h";
        value += String(event.relative_humidity);
        Serial.print("humidity: ");
        Serial.println(event.relative_humidity);
    }
    
    // pm1.0, pm2.5, pm10
    if(Serial1.find(0x42)){    
        Serial1.readBytes(buf,LENG);

        if(buf[0] == 0x4d){
            if(checkValue(buf,LENG)){
                header += "120";
                value += String(transmitPM01(buf)) 
                    + ","
                    + String(transmitPM2_5(buf))  
                    + ","
                    + String(transmitPM10(buf)) 
                    + ",";

                Serial.print("pm1.0: ");
                Serial.println(transmitPM01(buf));
                Serial.print("pm2.5: ");
                Serial.println(transmitPM2_5(buf));
                Serial.print("pm10: ");
                Serial.println(transmitPM10(buf));
            }
        }
    } else {
        Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
        error += "120";
    }

    // anemometer 
    header += "v";
    value += String((analogRead(A0) - 51.174)/44.952);
    value += ",";

    // arah angin
    float arah_angin = (0.3504*analogRead(A1))+0.2038+0.5 ;
    if (arah_angin == 360.00) {
        arah_angin = 0;
    }
    header += 'a';
    value += String(random(0,360));
    value += ",";

    // data
    return "{\"id\": \"" + device_id + "\",\"data\": \"" + header + error + "|" + value + "\"}";
}