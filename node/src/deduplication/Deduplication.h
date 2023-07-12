#ifndef Deduplication_H
#define Deduplication_H

#include <Arduino.h>
#include <struct/StartDeduplicationStruct.h>
#include <struct/MetadataStruct.h>

class Deduplication {
    private:
        int metadataSize;
        int metadataPosition;
        MetadataStruct metadata[10];
        int newMetadataSize;
    public:
        String indexOrder;
        Deduplication(int metadataSize) {
            this->metadataSize = metadataSize;
            this->metadataPosition = 0;
            this->newMetadataSize = 0;
        };
        void start(String& data);
        void write(HardwareSerial& lora);

};


#endif