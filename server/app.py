from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
blobs = []
CORS(app)

# remove unrequired file on initial request for new request
@app.route('/')
def index():
    if os.path.exists("./video.webm"):
        os.remove("./video.webm")
    else:
        print("The file does not exist")
    if os.path.exists("./audio.opus"):
        os.remove("./audio.opus")
    else:
        print("The file does not exist")
    return { "response": True }

@socketio.on('connect')
def test_connect():
    print('connected')
    emit('ready_to_receive', "accepting chunks")

@socketio.on('videoChunks')
def receiveChunks(data):
    data = data.replace("data:video/webm;codecs=vp8,opus;base64,", "") # for audio + video
    data = data.replace("data:video/webm;codecs=vp8;base64,", "") # for video only

    outdata = base64.b64decode(data)
    # print("outdata: ", outdata)
    
    print("received chunk")
    with open('video.webm', 'ab+') as f:
        f.write(outdata)

@socketio.on('ending')
def saveFile(data):
    print("Chunks finished")


if __name__ == '__main__':
    socketio.run(app)