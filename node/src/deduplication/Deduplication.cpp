#include <Arduino.h>
#include <struct/StartDeduplicationStruct.h>
#include <helpers/MurmurHash3.h>
#include <struct/MetadataStruct.h>
#include <struct/FingerprintStruct.h>

#include <deduplication/Deduplication.h>

void Deduplication::start(String &data)
{

    this->newMetadataSize = 0;
    this->indexOrder = "";
    int dataLength = data.length();
    // Seril.print("this->metadataPosition: ");
    // Serial.println(this->metadataPosition);

    // if (dataLength > 0) {
    if (dataLength >> 5)
    {

        for (int i = 0; i < dataLength; i += 32)
        {
            bool duplicate = false;
            String index = "";

            String str = data.substring(i, i + 32);
            String half_str = str.substring(0, str.length() / 2);
            int str_size = str.length();

            if (i + 32 > dataLength)
            {
                str = data.substring(i, dataLength);
            }

            uint32_t fingerprint_1 = MurmurHash3_x86_32(half_str.c_str(), str_size / 2, 1);
            uint32_t fingerprint_2 = MurmurHash3_x86_32(str.c_str(), str_size, 1);

            for (int j = 0; this->metadataPosition > j; j++)
            {

                if (this->metadata[j].fingerprint_1 == fingerprint_1)
                {
                    if (this->metadata[j].fingerprint_2 == fingerprint_2)
                    {
                        duplicate = true;
                        index = this->metadata[j].index;
                        break;
                    }
                }
            }

            if (!duplicate)
            {
                this->indexOrder += str;
                this->indexOrder += ";";

                if (this->metadataSize > this->metadataPosition + this->newMetadataSize)
                {
                    this->newMetadata[this->newMetadataSize] = FingerprintStruct{
                        fingerprint_1,
                        fingerprint_2};
                    this->newMetadataSize++;
                }
            }
            else
            {
                this->indexOrder += index;
                this->indexOrder += ";";
            }
        }
    }
    // }
}

void Deduplication::write(HardwareSerial &lora)
{
    bool indexReceived = false;
    char index[20] = "";
    int currentIndexPosition = 0;
    char indexRepo[4][20];

    while (Serial2.available())
    {
        delay(2);
        char c = Serial2.read();

        if (c == 'r')
        {
            Serial.println("RELOAD!");
            this->metadataPosition = 0;
            memset(this->metadata, 0, sizeof(this->metadataSize));
        }

        if (c == ';')
        {
            indexReceived = true;
            // indexRepo[currentIndexPosition] = index;
            strcpy(indexRepo[currentIndexPosition], index);
            memset(index, 0, sizeof(index));
        }

        if (
            c != '\u0012' && c != ',' && c != '\0' && c != ';' && !indexReceived)
        {
            int len = strlen(index);
            if (len < sizeof(index) - 1)
            {
                index[len] = c;
                index[len + 1] = '\0';
            }
            Serial.print(c);
        }

        if (c == ',')
        {
            // indexRepo[currentIndexPosition] = index;
            strcpy(indexRepo[currentIndexPosition], index);
            currentIndexPosition++;
            memset(index, 0, sizeof(index));
            Serial.print(",");
        }
    }

    // Serial.println();
    // Serial.print("currentIndexPosition: ");
    // Serial.println(currentIndexPosition);
    // Serial.print("newMetadataSize: ");
    // Serial.println(this->newMetadataSize);

    if (this->newMetadataSize > 0)
    {
        for (int i = 0; i <= currentIndexPosition; i++)
        {
            metadata[this->metadataPosition] = MetadataStruct{
                this->newMetadata[i].fingerprint_1,
                this->newMetadata[i].fingerprint_2,
                ""};
            strncpy(metadata[this->metadataPosition].index, indexRepo[i], sizeof(metadata[this->metadataPosition].index) - 1);
            metadata[this->metadataPosition].index[sizeof(metadata[this->metadataPosition].index) - 1] = '\0';
            this->metadataPosition++;
        }
    }

    // Serial.println();

    // Serial.print("Index Metadata 1: ");
    Serial.println(metadata[1].index);

    // Serial.println();
}

void Deduplication::write(String &data)
{
    Serial.print("ln: ");
    Serial.println(data.length());
    bool indexReceived = false;
    char index[20] = "";
    int currentIndexPosition = 0;
    char indexRepo[4][20];

    if (data.length() <= 0) return;

    for (size_t i = 0; i < data.length(); i++)
    {
        char c = data[i];
        if (c == 'r')
        {
            Serial.println("RELOAD!");
            this->metadataPosition = 0;
            memset(this->metadata, 0, sizeof(this->metadataSize));
        }

        if (c == ';')
        {
            indexReceived = true;
            // indexRepo[currentIndexPosition] = index;
            strcpy(indexRepo[currentIndexPosition], index);
            memset(index, 0, sizeof(index));
        }

        if (
            c != '\u0012' && c != ',' && c != '\0' && c != ';' && !indexReceived)
        {
            int len = strlen(index);
            if (len < sizeof(index) - 1)
            {
                index[len] = data[i];
                index[len + 1] = '\0';
            }
            Serial.print(data[i]);
        }

        if (c == ',')
        {
            // indexRepo[currentIndexPosition] = index;
            strcpy(indexRepo[currentIndexPosition], index);
            currentIndexPosition++;
            memset(index, 0, sizeof(index));
            Serial.print(",");
        }
    }

    if (this->newMetadataSize > 0)
    {
        for (int i = 0; i <= currentIndexPosition; i++)
        {
            metadata[this->metadataPosition] = MetadataStruct{
                this->newMetadata[i].fingerprint_1,
                this->newMetadata[i].fingerprint_2,
                ""};
            strncpy(metadata[this->metadataPosition].index, indexRepo[i], sizeof(metadata[this->metadataPosition].index) - 1);
            metadata[this->metadataPosition].index[sizeof(metadata[this->metadataPosition].index) - 1] = '\0';
            this->metadataPosition++;
        }
    }
    Serial.println(metadata[1].index);
}