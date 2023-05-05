from paho.mqtt import client as mqtt_client
import lora
import requests
import time

# broker = '103.150.197.37'
broker = '192.168.0.113'
port = 1883
topic_data = 'node/0718455b/prod/data'
topic_action = 'node/0718455b/prod/action'
client_id = '0718455b'
username = '7e60b970'
password = 'ce337860917213c7'

mqtt_message = None

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
        mqtt_message = message.payload
        print("a message arrived: ", message)
            
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
        # get data from lora module 
        # and publish it
        data_node = node.receive(client, topic_data)
        print("data node: ", data_node)

        # get callback message from mqtt broker
        if (data_node):
            print("message forwarded to server")
            print("mqtt_message: ", mqtt_message)

        # send the callback message to node

    # stop the mqtt
    client.loop_stop()
    client.disconnect() # disconnect

    # do error handling
    
        
    
        
    # while True:
    #     try: 
    #         data_node = node.receive(client)
    #         print("[data_node] ")
    #         print(data_node)
    #         print("\n")

    #         # if (data_note):
    #         #     rand_val = "5,4,3"
    #         #      offset_frequence = int(get_t[1])-(850 if int(get_t[1])>850 else 410)     
    #         #      #     
    #         #      # the sending message format     
    #         #      #     #         receiving node              receiving node                   receiving node           own high 8bit           own low 8bit                 own      #         high 8bit address           low 8bit address                    frequency                address                 address                  frequency             message payload     
    #         #      data = bytes([int(get_t[0])>>8]) + bytes([int(get_t[0])&0xff]) + bytes([offset_frequence]) + bytes([node.addr>>8]) + bytes([node.addr&0xff]) + bytes([node.offset_freq]) + get_t[2].encode()     
    #         #      node.send(data) 

    #         # # declaring an integer value
    #         # integer_val = 5
              
    #         # # converting int to bytes with length 
    #         # # of the array as 2 and byter order as big
    #         # bytes_val = integer_val.to_bytes(2, 'big')
    #         # node.send(bytes_val)
    #     except Exception as e:
    #         print("Error: ", e)
            
    # client.loop_stop()
    # client.disconnect() # disconnect

if __name__ == '__main__':
    run()
