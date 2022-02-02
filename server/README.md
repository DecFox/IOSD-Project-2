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

Install [ffmpeg](https://www.ffmpeg.org/download.html) for audio extraction from video.

Server can be run on port: 5000 by
```
flask run
```
Remember to run the server before starting client (since client request controls server files) 

To install nltk dependencies
```
python dep.py
```
which will download the **punkt** and **stopwords** data

The client is configured to run for 3 minutes. While selecting a media stream, choose a tab since audio can only be recorded through a tab (MediaRecorder API restrictions)

The HuggingFace Inference API may take some time to load the model (which will be corrected in the future) forcing punctuation outputs to showcase an error. In such a case, try running the **summarize** button again for from the client

