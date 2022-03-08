// Persistent state for summary fetching to be added 

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.assert(message === 'generate summary');
// })

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === 'summary') 

//   port.onMessage.addListener((message) => {
//     fetch("http://localhost:5000/summary")
//     .then((res) => {
//         console.log(res);
//         chrome.storage.sync.set({recordStatus: false});
//     })
//     .catch((err) => {
//         console.log(err);
//         sendResponse(err);
//     })
//   })
// })

