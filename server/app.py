from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from models.speech2text import SpeechToText
from models.summary import generate_summary
import base64
import os
import subprocess
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# remove unrequired file on initial request for new request
@app.route('/')
def index():
    if os.path.exists("./video.webm"):
        os.remove("./video.webm")
    else:
        print("The file does not exist")
    if os.path.exists("./audio.wav"):
        os.remove("./audio.wav")
    else:
        print("The file does not exist")
    return { "response": True }

@app.route('/summary')
def summary():
    print('request')
    subprocess.call(
        ['ffmpeg', '-i', 'video.webm', '-vn', '-f', 'wav', '-ac', '1', 'audio.wav']
    )
    print("converted to audio .... check audio.wav")
    time.sleep(4)
    tcs = SpeechToText("audio.wav", "input.txt")
    print(tcs)
    print("****************generating sumary****************")
    tcs_sum = generate_summary("input.txt")
    print(tcs_sum)
    return { "response": True }

@socketio.on('connect')
def test_connect():
    print('connected')
    emit('ready_to_receive', "accepting chunks")

@socketio.on('videoChunks')
def receiveChunks(data):
    with open('data.txt', 'a+') as f:
        f.write(data)
    data = data.replace("data:video/webm;codecs=vp8,opus;base64,", "")
    data = data.replace("data:video/x-matroska;codecs=avc1,opus;base64,", "") # for audio + video
    data = data.replace("data:video/webm;codecs=vp8;base64,", "") # for video only

    outdata = base64.b64decode(data)
    # print("outdata: ", outdata)
    
    print("received chunk")
    with open('video.webm', 'ab+') as f:
        f.write(outdata)

@socketio.on('ending')
def saveFile(data):
    print("Chunks finished")

@socketio.on('disconnect')
def disconnect():
    print('socket disconnected')


if __name__ == '__main__':
    socketio.run(app)