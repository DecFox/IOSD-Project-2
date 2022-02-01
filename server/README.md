## Server Instructions

Add [Vosk Speech2Text](https://alphacephei.com/vosk/models/vosk-model-en-in-0.4.zip) model to 
```
server/models/
```
and rename the unzipped directory as **model**.

Install requirements using 
```
pip install -r requirements.txt
```
(in the server directory)

Server can be run on port: 5000 by
```
flask run
```
