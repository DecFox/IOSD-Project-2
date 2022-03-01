function fetchSummary() {
    fetch("http://localhost:5000/summary")
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })
}

async function startrecording() {
    params = { active: true, currentWindow: true };
    tabs = await chrome.tabs.query(params);
    console.log(tabs);
    message = {
        data: "mock data"
    };
    var port = await chrome.tabs.connect(tabs[0].id, { name: 'recording' });
    console.log("connection established");
    port.postMessage({ message: 'startRecording' });
}

summary_btn = document.querySelector("#summary");
document.querySelector(".record").addEventListener("click", startrecording);
document.querySelector("#summary").addEventListener("click", fetchSummary);