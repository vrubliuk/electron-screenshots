const { desktopCapturer, shell } = require("electron");
const { screen } = require("electron").remote;
const fs = require("fs");
const os = require("os");
const path = require("path");

const screenshotButton = document.getElementById("screenshotButton");

screenshotButton.addEventListener("click", function() {
  const thumbnailSize = determineThumbnailSize();
  desktopCapturer
    .getSources({ types: ["screen"], thumbnailSize })
    .then(async sources => {
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          const screenshotPath = path.join(os.tmpdir(), "screenshot.png");
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), error => {
            if (error) {
              return console.log(error.message);
            }
            shell.openExternal("file://" + screenshotPath);
          });
        }
      }
    });
});

function determineThumbnailSize() {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const maxDimension = Math.max(screenSize.width, screenSize.height);
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  };
}
