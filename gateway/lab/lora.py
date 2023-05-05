import time

class sx126x:
    def __init__(self,serial_num,freq,addr,power,rssi,air_speed=2400,\
                 net_id=0,buffer_size = 240,crypt=0,\
                 relay=False,lbt=False,wor=False):
        self.rssi = rssi
        self.addr = addr
        self.freq = freq
        self.serial_n = serial_num
        self.power = power

    def receive(self, client, topic_data):
        # if self.ser.inWaiting() > 0:
        if True:

            # get message
            time.sleep(0.5)
            message_raw = input()
            print("input: ", message_raw, "\n")

            # decode message from lora module
            message = message_raw.rstrip()

            # send message to server
            pub_to_mqtt = client.publish(topic_data, message)
            print("pub to mqtt status: ", pub_to_mqtt)

            if pub_to_mqtt[0] == 0:
                return True
            else:
                return False