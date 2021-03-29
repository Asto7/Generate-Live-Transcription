let subscribed = false;

const subscribeBtn = document.getElementById("subscribeBtn");
subscribeBtn.addEventListener("click", () => {
  subscribed = !subscribed;
  setButtonText(subscribed);
  getTab(subscribeBtnClick);
});

getTab(init);

function getTab(cb) {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, cb);
}

function init(tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "getSubscription" },
    setButtonText
  );
}

function setButtonText(subscription) {
  let text = "STOP!";
  subscribed = subscription;

  if (!subscribed) text = "START!";
  subscribeBtn.innerHTML = text;
}

// Send message to content
function subscribeBtnClick(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {
    type: "subcribedBtnClicked",
    value: subscribed,
  });
}

// let bgPage = chrome.extension.getBackgroundPage();
// console.log(bgPage);
