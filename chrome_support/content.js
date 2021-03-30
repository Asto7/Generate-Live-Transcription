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
    boxTemp.className = "box";

    boxTemp.innerHTML =
      "<strong style = 'color: #6fc21c; font-family:  monospace;'>Asto/ </strong> "; //Flex lol

    // Styling
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
    boxTemp.style["cursor"] = "move";
    boxTemp.style["padding"] = "7px";
    boxTemp.style["userSelect"] = "none";
    boxTemp.style["borderRadius"] = "0.3em";
    boxTemp.style["zIndex"] = "100000";

    document.body.appendChild(boxTemp);
    this.box = boxTemp;

    this.dragElement(this.box);
  }

  remove() {
    this.box.remove();
  }

  addText(text) {
    this.box.innerHTML =
      "<strong style = 'color: #6fc21c; font-family:  monospace;'>Asto/ </strong> ";

    let spanElm = document.createElement("span");
    spanElm.innerHTML = " " + text;
    this.box.appendChild(spanElm);

    this.box.scrollTop = this.box.scrollHeight;
  }

  dragElement(ele) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    ele.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      ele.style.top = ele.offsetTop - pos2 + "px";
      ele.style.left = ele.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
