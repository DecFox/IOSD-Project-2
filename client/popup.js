RecordBtn = document.querySelector("#record");

// Hard Reset (temporary)
// chrome.storage.sync.set({recordStatus: false});

chrome.storage.sync.get(['recordStatus'], function(result) {
    console.log(result.recordStatus);
    if(result.recordStatus) {
        RecordBtn.innerText = "Generate Summary";
    } else {
        RecordBtn.innerText = "Start Recording";
    }
})

async function fetchSummary() {
    chrome.storage.sync.set({recordStatus: false});
    fetch("http://localhost:5000/summary")
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })
}

async function startRecording() {
    params = { active: true, currentWindow: true };
    tabs = await chrome.tabs.query(params);
    console.log(tabs);
    message = {
        data: "mock data"
    };
    var port = await chrome.tabs.connect(tabs[0].id, { name: 'recording' });
    console.log("connection established");
    chrome.storage.sync.set({recordStatus: true});
    port.postMessage({ message: 'startRecording' });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes);
    if (changes.recordStatus.newValue) {
        RecordBtn.innerText = "Generate Summary";
    } else {
        RecordBtn.innerText = "Start Recording";
    }
})

summary_btn = document.querySelector("#summary");

RecordBtn.addEventListener("click", function() {
    chrome.storage.sync.get(['recordStatus'], function(result) {
        if(result.recordStatus) {
            fetchSummary();
        } else {
            startRecording();
        }
    })
})