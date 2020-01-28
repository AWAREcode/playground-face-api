// TODO: This is super hacky...
//       But it works!
function setupError() {
    // Overwrite `Error` class, so any thrown error
    // will always call our `error` function.
    class CustomError extends Error {
        constructor(...args) {
            error(args.join("\n  "));
            super(...args);
        }
    }
    Error = CustomError;
}

function setupButtons() {
    const btnConfigs = [
        {
            selector: "#btn-load",
            onclick: loadModels,
        },
        {
            selector: "#btn-run",
            onclick: runFaceDetections,
        },
        {
            selector: "#btn-clear-video-intervals",
            onclick: clearVideoDetectionIntervals,
        },
    ];

    btnConfigs.forEach(btnConfig => {
        const btnEl = document.querySelector(btnConfig.selector);
        if (btnEl) {
            btnEl.onclick = btnConfig.onclick;
        } else {
            error(`Button with selector '${btnConfig.selector}' doesn't exist in DOM`);
        }
    });
}

function setupWebcam() {
    const setMediaStreamForVideo = (mediaStream, videoElement) => {
        videoElement.srcObject = mediaStream;
        const parentEl = videoElement.parentElement;
        if (parentEl /* &&
            parentEl.matches(SETTINGS.dom.playgroundSelector) */) {
            const streamVideoSettings = mediaStream
                .getVideoTracks()[0]
                .getSettings();
            console.log(mediaStream);
            console.log(streamVideoSettings);
            parentEl.style.width = `${streamVideoSettings.width}px`;
            parentEl.style.height = `${streamVideoSettings.height}px`;
        }
    };

    const videoElements = Array.from(
        document.querySelectorAll(SETTINGS.dom.videoWebcamSelector)
    );

    const mediaConstraints = {
        video: true,
        audio: false,
    };
    videoElements.forEach(videoElement => {
        navigator
            .mediaDevices
            .getUserMedia(mediaConstraints)
            .then(mediaStream => setMediaStreamForVideo(mediaStream, videoElement))
            .catch(() => error("Couldn't access webcam for video element"));
    });
}
