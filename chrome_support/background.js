chrome.runtime.onMessage.addListener(receiver);
const LiveStream = {};

function receiver(message, sender, sendResponse) {
  switch (message.type) {
    case "turnOnStream":
      turnOnStream(message, sender, sendResponse);
      break;

    case "turnOffStream":
      turnOffStream(message, sender, sendResponse);
      break;

    default:
      console.log("In Background js   ", message, sender, sendResponse);
  }

  return true;
}

function sendMessageBackToContent(tabId, data) {
  chrome.tabs.sendMessage(tabId, {
    type: "liveTranscription",
    value: data.text,
  });
}

function turnOnStream(message, sender, sendResponse) {
  if (!LiveStream[sender.tab.id]) captureCurrentTab(sender.tab.id);
}

function turnOffStream(message, sender, sendResponse) {
  console.log("Stopped!");

  let streamToStop = LiveStream[sender.tab.id];

  if (streamToStop) {
    streamToStop.obj.stopRecording(); // Destruct obj

    let stream = streamToStop.stream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  delete LiveStream[sender.tab.id];
}

function captureCurrentTab(tabId) {
  chrome.tabCapture.capture({ audio: true }, (stream) => {
    const obj = new StreamToText(stream, (data) => {
      sendMessageBackToContent(tabId, data);
    });

    window.audio = document.createElement("audio");
    window.audio.srcObject = stream;
    window.audio.play();

    let value = {};
    value["stream"] = stream;
    value["obj"] = obj;

    console.log(stream);
    LiveStream[tabId] = value;
  });
}
