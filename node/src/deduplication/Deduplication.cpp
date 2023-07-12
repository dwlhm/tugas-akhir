#include <Arduino.h>
#include <struct/StartDeduplicationStruct.h>
#include <helpers/MurmurHash3.h>
#include <struct/MetadataStruct.h>
#include <struct/FingerprintStruct.h>

#include <deduplication/Deduplication.h>

void Deduplication::start(String& data) {

    int newMetadataSizeLocal = 0;
    this->indexOrder = "";
    int dataLength = data.length();

    if (dataLength > 0) {
        if (dataLength >> 5) {
            
            for (int i = 0; i < dataLength; i += 32) { 
                bool duplicate = false;
                String index = "";

                String str = data.substring(i, i + 32);
                String half_str = str.substring(0, str.length()/2);
                
                if (i +32 > dataLength) {
                    str = data.substring(i, dataLength);
                }


                uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str.c_str(), dataLength - i, 1);
                uint32_t fingerprint_2 = MurmurHash3_x86_32(str.c_str(), (dataLength - i)/2, 1);
                
                for (int j = 0; this->metadataPosition > j; j++) {

                    if (this->metadata[j].fingerprint_1 == fingerprint_1) {
                        if (this->metadata[j].fingerprint_2 == fingerprint_2) {
                            duplicate = true;
                            index = this->metadata[j].index;
                            break;
                        }
                    }

                } 

                if (!duplicate) {
                    this->indexOrder += str;
                    this->indexOrder += ";";
                    
                    if (this->metadataSize > this->metadataPosition) {
                        this->metadata[this->metadataPosition] = MetadataStruct{
                            fingerprint_1,
                            fingerprint_2,
                            String(this->metadataPosition)
                        };
                        this->metadataPosition++;
                    }

                } else {
                    this->indexOrder += index;
                    this->indexOrder += ";";
                }

            }

        }
    }

}

void Deduplication::write(HardwareSerial& lora) {
    bool indexReceived = false;
    String *index;
    size_t currentIndexPosition;
    while (lora.available()) {
        delay(2); 
        char c = lora.read();

        if (c == ';') indexReceived = true;

        if (
        c != '\u0012' 
        && c != ',' 
        && c != '\0' 
        && c != ';' 
        && !indexReceived
        ) {
            index[currentIndexPosition] += c;
        }
            
        if (c == ',') currentIndexPosition++;

    }
    
    if (indexReceived) {
        for (int i = 0; this->newMetadataSize > i; i++) {
            metadata[this->newMetadataSize + 1 - i].index = index[i];
        }
    } 

    Serial.print(F("Last index value of metadata: "));
    Serial.println(metadata[this->metadataPosition-1].index);
}