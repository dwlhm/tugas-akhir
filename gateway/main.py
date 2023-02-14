from paho.mqtt import client as mqtt_client
import time

broker = 'localhost'
port = 1883
topic = 'node/52199ec1/prod/data'
client_id = '52199ec1'
username = 'dab7c707'
password = '5b31f8343910cdbb'

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
        time.sleep(1)
        msg = '{"gateway_timestamp": "2023-02-09T06:32:30Z","device": {"id": "cefb0c56","data": {"pm1":21,"pm2":31,"pm10":29}}}'
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print("successfully sended")
        else:
            print("failed send msg")

def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)

if __name__ == '__main__':
    run()