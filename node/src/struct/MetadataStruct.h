#ifndef MetadataStruct_H
#define MetadataStruct_H

#include <Arduino.h>

struct MetadataStruct {
    uint32_t fingerprint_1;
    uint32_t fingerprint_2;
    char index[20];
};


#endif
