import wave
import json
from vosk import KaldiRecognizer, Model
import requests
import time

API_URL = "https://api-inference.huggingface.co/models/oliverguhr/fullstop-punctuation-multilang-large"
headers = {"Authorization": "Bearer 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"}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

def punctuate(text, path):
   
    output = query({"inputs": text})
    print(output)
    time.sleep(30)
    final = ''
    for grp in output:
        final += grp['word']
        punct = grp["entity_group"]
        if(punct == '0'):
            final += ' '
        else:
            final += (punct + ' ')
    
    with open(path, "w+") as f:
        f.write(final)

    return final

def SpeechToText(path, path_to_save):
    wf = wave.open(path, "rb")
    model = Model("./models/model")

    textResults = []

    recognizer = KaldiRecognizer(model, wf.getframerate())

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if recognizer.AcceptWaveform(data):
            recognizerResult = recognizer.Result()
            resultDict = json.loads(recognizerResult)
            textResults.append(resultDict.get("text", ""))

    resultDict = json.loads(recognizer.FinalResult())
    textResults.append(resultDict.get("text", ""))

    FinalText = ""
    for text in textResults:
        FinalText = FinalText + " " + text
    
    print(FinalText)
    print("-------text generated------")

    result = punctuate(FinalText, path_to_save)

    return result