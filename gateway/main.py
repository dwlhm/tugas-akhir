from paho.mqtt import client as mqtt_client
from datetime import datetime
import pytz
import json
import time
import termios
import sys
import tty
import sx126x

broker = '192.168.0.104'
port = 1883
topic = 'node/52199ec1/prod/data'
client_id = '52199ec1'
username = 'dab7c707'
password = '5b31f8343910cdbb'

old_settings = termios.tcgetattr(sys.stdin)
tty.setcbreak(sys.stdin.fileno())

#
#    Need to disable the serial login shell and have to enable serial interface 
#    command `sudo raspi-config`
#    More details: see https://github.com/MithunHub/LoRa/blob/main/Basic%20Instruction.md
#
#    When the LoRaHAT is attached to RPi, the M0 and M1 jumpers of HAT should be removed.
#

#   serial_num
#       PiZero, Pi3B+, and Pi4B use "/dev/ttyS0"
#
#    Frequency is [850 to 930], or [410 to 493] MHz
#
#    address is 0 to 65535
#        under the same frequence,if set 65535,the node can receive 
#        messages from another node of address is 0 to 65534 and similarly,
#        the address 0 to 65534 of node can receive messages while 
#        the another note of address is 65535 sends.
#        otherwise two node must be same the address and frequence
#
#    The tramsmit power is {10, 13, 17, and 22} dBm
#
#    RSSI (receive signal strength indicator) is {True or False}
#        It will print the RSSI value when it receives each message
#
node = sx126x.sx126x(serial_num = "/dev/ttyS0",freq=868,addr=0,power=22,rssi=True,air_speed=2400,relay=False)

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker")
        else:
            print("Failed to connect, return code %d\n", rc)
        
    client = mqtt_client.Client(client_id)
    client.username_pw_set(username,password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def publish(client):
    while True:
        time.sleep(1000)
        
<<<<<<< HEAD
        jakarta_tz = pytz.timezone("Asia/Jakarta")
        local_time = datetime.now(jakarta_tz)
        data_node = json.loads('{"id": "cefb0c56","data": ' +'}')
        data = {
            "gateway_timestamp": local_time.isoformat(),
            "device": data_node
        }
        msg = json.dumps(data)
        print(msg)
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print("successfully sended")
        else:
            print("failed send msg")
=======
        
>>>>>>> baf864a38cb94f96041d58c2298d0048dd679c2f

def run():
    client = connect_mqtt()
    client.loop_start()
<<<<<<< HEAD
    #publish(client)
    while True:
        node.receive(client)
=======
    while True:
       node.receive(client)
>>>>>>> baf864a38cb94f96041d58c2298d0048dd679c2f

if __name__ == '__main__':
    run()
