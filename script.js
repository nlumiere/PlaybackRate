async function updateVideoPlayback() {
  chrome.storage.local
    .get(["customPlaybackRate"])
    .then((result) => {
      if (!result) {
        setCustomPlaybackSpeed(1);
        return;
      }
      const speed = parseFloat(result.customPlaybackRate);
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.playbackRate = speed;
      });
    })
    .catch(() => {
      setCustomPlaybackSpeed(1);
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "customPlaybackRate" && typeof newValue === "number") {
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.playbackRate = newValue;
      });
    }
  }
});

function setCustomPlaybackSpeed(speed) {
  chrome.storage.local.set({ customPlaybackRate: speed }).then(() => {});
}

const observer = new MutationObserver(updateVideoPlayback);
observer.observe(document.body, { childList: true, subtree: true });

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
