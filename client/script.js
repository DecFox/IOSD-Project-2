
    fetch("http://localhost:5000/")
      .then((res) => {
        console.log("Successfully initiated server:", res);
      })
      .catch((err) => {
        console.log(err);
      })

    vidEl = document.querySelector(".vid");
    sumEl = document.querySelector(".summary")

    // set chunk frequency time here and duration of video here(in ms)
    var timeout = 500;
    var duration = 3000;

    // connecting to server using socketio
    var socket = io.connect("http://localhost:5000");
    socket.on("connect", function (msg) {
      console.log("connection", socket.connected);
    });

    // setting diplay option (audio: true makes video unable to build)
    // set audio: false if only video is required
    var displayMediaOptions = {
      video: true,
      audio: true
    };

    var mediaRecorder;
    var chunks = [];

    // setting media stream and starting media recorder
    navigator.mediaDevices
      .getDisplayMedia(displayMediaOptions)
      .then((mediaStreamObj) => {
        chunks = [];
        mediaRecorder = initRecorder(mediaStreamObj);
        console.log("sending chunks....");
        mediaRecorder.start(500);
        setTimeout(() => {
          stoprecord();
          console.log("finished");
        }, 180000);
      })
      .catch((err) => {
        console.log(err);
      });

    // convert blob to base64
    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    // initialise media recorder
    function initRecorder(mediaStreamObj) {
      var mediaRecorder = new MediaRecorder(mediaStreamObj, {
        mimeType: "video/webm;",
      });

      // emit video chunks based on timeout
      mediaRecorder.ondataavailable = function (ev) {
        chunks.push(ev.data);
        // console.log("chunk:", ev.data);
        blobToBase64(ev.data).then(base64str => {
            console.log(`b64 client data: ${base64str}`)
            socket.emit("videoChunks", base64str);
        })
      };

      // stopping media recorder and creating blob url for front-end
      mediaRecorder.onstop = () => {
        let blob = new Blob(chunks, { type: "video/mp4;" });
        let videoURL = window.URL.createObjectURL(blob);
        console.log(chunks);
        chunks = [];
        vidEl.src = videoURL;
      };

      return mediaRecorder;
    }

    // stopping message emitted to server
    function stoprecord() {
      mediaRecorder.stop();
      socket.emit("ending", "Chunks finished");
      setTimeout(() => {
        socket.disconnect()
      }, 5000)
    }

    function fetch_summary() {
      fetch("http://localhost:5000/summary")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
    }