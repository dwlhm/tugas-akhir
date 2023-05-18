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
    String value = "";

    // dht temperature
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
        Serial.println(F("Error reading temperature"));
        header += "t";
        value += String(random(0,10000)/500.0);
        value += ",";
    } else {
        header += "t";
        value += String(event.temperature);
    }

    // dht humidity
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
        Serial.println(F("Error reading humidity!"));
        header += "h";
        value += String(random(0,10000)/1000.0);
        value += ",";
    } else {
        header += "h";
        value += String(event.relative_humidity);
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
            }
        }
    } else {
        Serial.println(F("Error reading PM1.0, PM2.5, PM1 0!"));
        header += "120";
        value += String(random(30,50)) 
            + ","
            + String(random(30,50))  
            + ","
            + String(random(30,50)) 
            + ",";
    }

    // anemometer 
    float anemometer = analogRead(A0) * (5.0 / 1023.0);
    float level_anemometer = 6*anemometer;
    header += "v";
    value += String(random(0,10000)/1000.0);
    value += ",";

    // arah angin
    int sensor_arah_angin = analogRead(A1);
    float arah_angin = map(sensor_arah_angin, 0, 959, 0, 360);
    if (arah_angin == 360.00) {
        arah_angin = 0;
    }
    header += 'a';
    value += String(random(0,360));
    value += ",";

    // data
    return "{\"id\": \"" + device_id + "\",\"data\": \"" + header + "|" + value + "\"}";
}