#include <Arduino.h>
#include <unity.h>

#include <struct/StartDeduplicationStruct.h>
#include <deduplication/Deduplication.h>
#include <struct/MetadataStruct.h>

void test_start_deduplication() {
    
    String data1 = "{\"id\": \"s22frr\",\"data\": \"avth120|10,20,30,40,50,60,70\"}";

    size_t expectedPosition = 2;

    Deduplication* deduplication = new Deduplication(10);

    deduplication->start(data1);
    
    TEST_ASSERT_EQUAL(expectedPosition, deduplication->metadataPosition);
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