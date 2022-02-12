chrome.runtime.onConnect.addListener( function(port) {
    console.assert(port.name === 'recording')
    
    port.onMessage.addListener((message) => {
        if(message.message === 'startRecording') {
            fetch("http://localhost:5000/")
            .then((res) => {
                console.log("Successfully initiated server:", res);
            })
            .catch((err) => {
                console.log(err);
            })

            var socket = io.connect("http://localhost:5000/");
            socket.on("connect", function (msg) {
                console.log("connection", socket.connected);
            });

            var mediaRecorder;
            var chunks = [];
            var displayMediaOptions = {
                video: true,
                audio: true
            };

            function BlobToBase64(blob) {
                return new Promise((resolve, _) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            }

            function initRecorder(mediaStreamObj) {
                var mediaRecorder = new MediaRecorder(mediaStreamObj, { mimeType: "video/webm;" });

                mediaRecorder.onstop = () => {
                    socket.emit("ending", "Chunks finished");
                    setTimeout(() => { 
                        socket.disconnect();
                    }, 5000);
                };

                mediaRecorder.ondataavailable = function(ev) {
                    if(ev.data) {
                        chunks.push(ev.data);
                        BlobToBase64(ev.data)
                            .then(base64str => {
                            console.log('chunk sent');
                            socket.emit("videoChunks", base64str);
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                };

                return mediaRecorder;
            }

            navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
                .then((mediaStreamObj) => {
                    chunks = [];
                    mediaRecorder = initRecorder(mediaStreamObj);
                    console.log("sending chunks....");
                    mediaRecorder.start(500);
                    mediaStreamObj.oninactive = () => {
                        mediaRecorder.stop();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    })
})

