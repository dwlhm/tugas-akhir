#include <Arduino.h>
#include <unity.h>

#include <struct/StartDeduplicationStruct.h>
#include <deduplication/deduplication.h>
#include <struct/MetadataStruct.h>

void test_start_deduplication() {
    
    MetadataStruct* metadata;
    String data = "{\"id\": \"s22frr\",\"data\": \"avth120|10,20,30,40,50,60,70\"}";
    size_t metadataMaxSize = 10;
    size_t metadataCurrentSize = 0;

    size_t expectedSize = 2;

    StartDeduplicationStruct startDeduplication = start_deduplication(metadata, data, metadataCurrentSize, metadataMaxSize);

    
    TEST_ASSERT_EQUAL(expectedSize, startDeduplication.newMetadataSize);
};

int runUnityTests(void) {
  UNITY_BEGIN();
  
  RUN_TEST(test_start_deduplication);

  return UNITY_END();
}

void setup() {
    runUnityTests();
}

void loop() {}