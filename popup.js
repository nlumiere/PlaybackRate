function setCustomPlaybackSpeed(speed) {
  document.getElementById("playbackRateSlider").value = speed;
  document.getElementById("playbackrate").innerHTML =
    "Playback Speed: " + speed.toString();
  chrome.storage.local.set({
    customPlaybackRate: parseFloat(speed),
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const playbackRateSlider = document.getElementById("playbackRateSlider");
  const playbackRateText = document.getElementById("playbackrate");

  chrome.storage.local.get(["customPlaybackRate"]).then((result) => {
    let speed = 1;
    if (result) {
      speed = parseFloat(result.customPlaybackRate);
      playbackRateSlider.value = speed;
      playbackRateText.innerHTML = "Playback Speed: " + speed.toString();
    }
  });

  playbackRateSlider.addEventListener("input", (val) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const newValue = val.target.value;
      playbackRateText.innerHTML = "Playback Speed: " + newValue.toString();
      document.addEventListener("mouseup", () => {
        setCustomPlaybackSpeed(newValue);
      });
    });
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
