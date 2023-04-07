document.addEventListener("DOMContentLoaded", () => {
  const ACTION_MESSAGE_LENGTH = 8;
  document
    .getElementById("playbackRateSlider")
    .addEventListener("input", (val) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const newValue = val.target.value;
        // const actionStr = "speedSet:" + newValue.toString();
        // chrome.tabs.sendMessage(tabs[0].id, { action: actionStr });
        document.getElementById("playbackrate").innerHTML =
          "Playback Speed: " + newValue.toString();
        document.addEventListener("mouseup", () => {
          chrome.storage.local.set({
            customPlaybackRate: parseFloat(newValue),
          });
        });
      });
    });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.action.length >= ACTION_MESSAGE_LENGTH &&
      message.action.substring(0, ACTION_MESSAGE_LENGTH) === "buttonClicked"
    ) {
      const newValue = parseFloat(
        message.action.substring(ACTION_MESSAGE_LENGTH + 1)
      );
      document.getElementById("playbackRateSlider").value = newValue;
      document.getElementById("playbackrate").innerHTML =
        "Playback Speed: " + newValue.toString();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key === "]" || event.key === "[")) {
      chrome.storage.local
        .get(["customPlaybackRate"])
        .then((result) => {
          let speed = 1;
          if (result) {
            speed = parseFloat(result.customPlaybackRate);
          }
          if (event.ctrlKey && event.key === "]") {
            setCustomPlaybackSpeed(
              Math.min(
                Math.round((speed + 0.1 + (speed >= 1) * 0.4) * 10) / 10,
                10
              )
            );
          } else {
            setCustomPlaybackSpeed(
              Math.max(
                Math.round((speed - (0.1 + (speed > 1) * 0.4)) * 10) / 10,
                0
              )
            );
          }
        })
        .catch(() => {
          setCustomPlaybackSpeed(1);
        });
    }
  });
});
