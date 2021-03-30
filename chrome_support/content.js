let subscribed = false;
let box = null;
chrome.runtime.sendMessage({ type: "turnOffStream" }); // Remove Stream if it was On before reload

// chrome.storage.local.set({ subscribed: subscribed });

chrome.runtime.onMessage.addListener(receiver);

function receiver(message, sender, sendResponse) {
  switch (message.type) {
    case "getSubscription":
      getSubscription(message, sender, sendResponse);
      break;

    case "subcribedBtnClicked":
      subcribedBtnClicked(message, sender, sendResponse);
      break;

    case "liveTranscription":
      liveTranscription(message, sender, sendResponse);
      break;

    case "removeCaption":
      removeCaption(message, sender, sendResponse);
      break;

    default:
    // console.log("In Content js   ", message, sender, sendResponse);
  }
}

// [Functions]
function getSubscription(message, sender, sendResponse) {
  sendResponse(subscribed);
}

function subcribedBtnClicked(message, sender, sendResponse) {
  subscribed = message.value;
  if (box) {
    box.remove();
    box = null;
  }

  if (subscribed) {
    chrome.runtime.sendMessage({ type: "turnOnStream" });
    if (!box) box = new Box();
    box.init();
  } else chrome.runtime.sendMessage({ type: "turnOffStream" });
}

function liveTranscription(message, sender, sendResponse) {
  box.addText(message.value);
}

function removeCaption(message, sender, sendResponse) {
  if (box) {
    box.remove();
    box = null;
  }
  subscribed = false;
}

// [Caption Div]
class Box {
  constructor() {
    let boxTemp = document.createElement("div");
    boxTemp.innerHTML =
      "<strong style = 'color: #6fc21c; font-family:  monospace;'>Asto/ </strong> ";
    boxTemp.className = "box";
    boxTemp.style["color"] = "white";
    boxTemp.style["fontSize"] = "2em";
    boxTemp.style["lineHeight"] = "1.2";
    boxTemp.style["position"] = "fixed";
    boxTemp.style["top"] = "35%";
    boxTemp.style["left"] = "40%";
    boxTemp.style["background"] = "rgba(0,0,0,0.7)";
    boxTemp.style["width"] = "80%";
    boxTemp.style["maxHeight"] = "45px";
    boxTemp.style["overflowY"] = "hidden";
    boxTemp.style["padding"] = "7px";
    boxTemp.style["userSelect"] = "none";
    boxTemp.style["borderRadius"] = "0.3em";
    boxTemp.style["zIndex"] = "100000";

    document.body.appendChild(boxTemp);
    this.box = boxTemp;
    this.clearCaptionId = null;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  remove() {
    this.box.remove();
  }

  handleMouseDown() {
    this.box.style.cursor = "move";
    this.box.addEventListener("mouseup", this.handleMouseUp);
    document.body.addEventListener("mousemove", this.handleMouseMove);
    document.body.addEventListener("mouseleave", this.handleMouseUp);
  }

  handleMouseUp() {
    this.box.style.cursor = "default";
    document.body.removeEventListener("mousemove", this.handleMouseMove);
    document.body.removeEventListener("mouseleave", this.handleMouseUp);
  }

  handleMouseMove(e) {
    const boxRect = this.box.getBoundingClientRect();
    this.box.style.top = `${boxRect.top + e.movementY}px`;
    this.box.style.left = `${boxRect.left + e.movementX}px`;
  }

  addText(text) {
    this.box.innerHTML =
      "<strong style = 'color: #6fc21c; font-family:  monospace;'>Asto/ </strong> ";

    let spanElm = document.createElement("span");
    spanElm.innerHTML = " " + text;
    this.box.appendChild(spanElm);

    this.box.scrollTop = this.box.scrollHeight;
  }

  init() {
    this.box.addEventListener("mousedown", this.handleMouseDown);
  }
}
