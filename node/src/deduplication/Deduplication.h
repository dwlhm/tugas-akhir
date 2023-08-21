#ifndef Deduplication_H
#define Deduplication_H

#include <Arduino.h>
#include <struct/StartDeduplicationStruct.h>
#include <struct/MetadataStruct.h>

class Deduplication {
    private:
        int metadataSize;
        MetadataStruct metadata[10];
        FingerprintStruct newMetadata[4];
        int newMetadataSize;
    public:
        int metadataPosition;
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