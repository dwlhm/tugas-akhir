from paho.mqtt import client as mqtt_client
import lora
import requests
import time
from queue import Queue

# broker = '103.150.197.37'
broker = '192.168.0.113'
port = 1883
topic_data = 'node/0718455b/prod/data'
topic_action = 'node/0718455b/prod/action'
client_id = '0718455b'
username = '7e60b970'
password = 'ce337860917213c7'

q = Queue()

node = lora.sx126x(serial_num = "/dev/ttyS0",freq=868,addr=0,power=22,rssi=True,air_speed=2400,relay=False)

def is_cnx_active(timeout):
    try:
        requests.head("http://www.google.com/", timeout=timeout)
        return True
    except requests.ConnectionError:
        return False
        
def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker")
        else:
            print("error mqtt connection: ",rc)

    def on_subscribe(client, userdata, mid, granted_qos):
        print("subscribed to topic_action with qos: ", granted_qos[0])

    def on_message(client, userdata, message):
        q.put(message.payload.decode('utf-8').rstrip())
            
    client = mqtt_client.Client(client_id)
    client.username_pw_set(username,password)
    client.on_connect = on_connect
    client.on_subscribe = on_subscribe
    client.on_message = on_message
    
    try:
        client.connect(broker, port)
        client.subscribe(topic_action, 2)
    except Exception as e:
        print(e)
        exit(1)
        
    return client

def run():

    mqtt_message = None

    # check internet connection
    while True:
        if is_cnx_active(1000) is True:
            # Do somthing
            print("The internet connection is active")
            break
        else:
            print("Internet connection checking...")
            pass

    # establish mqtt connection
    client = connect_mqtt()
    client.loop_start()

    # do while True
    while True:
        try:
            # get data from lora module 
            # and publish it
            data_node = node.receive(client, topic_data)
            print("data node: ", data_node)

            if (data_node):
                # get callback message from mqtt broker
                mqtt_message = q.get()
                print("message forwarded to server")
                print("mqtt_message: ", mqtt_message)

                # send the callback message to node
                data = bytes([255]) + bytes([255]) + bytes([18]) + bytes([255]) + bytes([255]) + bytes([12]) + mqtt_message.encode()
                node.send(data)

        # do error handling
        except Exception as e:
            print("Error: ", e)

    # stop the mqtt
    client.loop_stop()
    client.disconnect() # disconnect   

if __name__ == '__main__':
    run()
