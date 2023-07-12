#ifndef StartDeduplicationStruct_H
#define StartDeduplicationStruct_H

#include <struct/FingerprintStruct.h>

struct StartDeduplicationStruct {
    FingerprintStruct *newMetadata;
    size_t newMetadataSize;
    String indexOrder;
};

#endif