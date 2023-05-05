from paho.mqtt import client as mqtt_client
import sx126x
import requests
import time

broker = '103.150.197.37'
port = 1883
topic = 'node/c0c854f5/prod/data'
client_id = 'c0c854f5'
username = '9eb83532'
password = '2a5e3018f48de4e6'

node = sx126x.sx126x(serial_num = "/dev/ttyS0",freq=868,addr=0,power=22,rssi=True,air_speed=2400,relay=False)

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
            print("Bad connection Returned code= ",rc)
            
    client = mqtt_client.Client(client_id)
    client.username_pw_set(username,password)
    client.on_connect = on_connect
    
    try:
        client.connect(broker, port)
    except Exception as e:
        print(e)
        exit(1)
        
    return client

def run():

    # check internet connection

    # establish mqtt connection

    # do while True

        # get data from lora module 
        # and process it

    # stop the mqtt

    # do error handling
    
    while True:
        if is_cnx_active(1000) is True:
            # Do somthing
            print("The internet connection is active")
            break
        else:
            print("Internet connection checking...")
            pass
        
    client = connect_mqtt()
    client.loop_start()
        
    while True:
        try: 
            data_node = node.receive(client)
            print("[data_node] ")
            print(data_node)
            print("\n")

            # if (data_note):
            #     rand_val = "5,4,3"
            #      offset_frequence = int(get_t[1])-(850 if int(get_t[1])>850 else 410)     
            #      #     
            #      # the sending message format     
            #      #     #         receiving node              receiving node                   receiving node           own high 8bit           own low 8bit                 own      #         high 8bit address           low 8bit address                    frequency                address                 address                  frequency             message payload     
            #      data = bytes([int(get_t[0])>>8]) + bytes([int(get_t[0])&0xff]) + bytes([offset_frequence]) + bytes([node.addr>>8]) + bytes([node.addr&0xff]) + bytes([node.offset_freq]) + get_t[2].encode()     
            #      node.send(data) 

            # # declaring an integer value
            # integer_val = 5
              
            # # converting int to bytes with length 
            # # of the array as 2 and byter order as big
            # bytes_val = integer_val.to_bytes(2, 'big')
            # node.send(bytes_val)
        except Exception as e:
            print("Error: ", e)
            
    client.loop_stop()
    client.disconnect() # disconnect

if __name__ == '__main__':
    run()
