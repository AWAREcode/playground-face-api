const SETTINGS = {
    dom: {
        playgroundSelector:       ".playground:not(.disabled)",
        playgroundNameAttribute:  "data-name",
        playgroundInputSelector:  ".playground-input",
        playgroundCanvasSelector: "canvas",
        videoWebcamSelector:      "video.webcam",
    },

    videoFaceDetectionIntervalMs: 200,

    modelsToLoad: [
        "ssdMobilenetv1",
        // "tinyFaceDetector",
        // "tinyYolov2",
        "mtcnn",
        "faceLandmark68Net",
        // "faceLandmark68TinyNet",
        "faceRecognitionNet",
        "faceExpressionNet",
        // "ageGenderNet",
    ],
};

const STATE = {
    areModelsLoaded: false,
    videoFaceDetectionIntervals: [],
};

async function loadModels() {
    STATE.areModelsLoaded = false;

    let msg = "Loading models...\n";
    msg += SETTINGS.modelsToLoad.map(model => `  - ${model}`).join(`\n`);
    output(msg);
    showLoading();

    const MODEL_URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.0/weights/";

    await Promise.all(
        SETTINGS.modelsToLoad.map(
            model => faceapi.nets[model].loadFromUri(MODEL_URL)
        )
    );

    output("DONE loading models");
    hideLoading();
    STATE.areModelsLoaded = true;
}

async function detectFacesFromPlayground(playgroundElement) {
    if (!playgroundElement) error("Playground wrapper element not given");

    const playgroundName = playgroundElement
        .getAttribute(SETTINGS.dom.playgroundNameAttribute) ||
        "UNNAMED";
    const inputElement = playgroundElement
        .querySelector(SETTINGS.dom.playgroundInputSelector);
    const canvasElement = playgroundElement
        .querySelector(SETTINGS.dom.playgroundCanvasSelector);

    if (!inputElement)
        error("Playground needs an element to be used as the input");
    if (!canvasElement)
        error("Playground needs a canvas element");

    const nonNumRe = /\D/g;
    const displaySize = {
        width:  playgroundElement.style.width.replace(nonNumRe, ""),
        height: playgroundElement.style.height.replace(nonNumRe, ""),
    };

    output(`Detecting face '${playgroundName}'...`);

    const tagName = inputElement.tagName;
    switch (tagName) {
        case "IMG": {
            const detectOptions = new faceapi.SsdMobilenetv1Options({
                minConfidence: 0.5,
            });
            const drawFunctions = [
                "drawDetections",
                "drawFaceLandmarks",
                "drawFaceExpressions",
            ];
            const faceDescriptions = await faceapi
                .detectAllFaces(inputElement, detectOptions)
                .withFaceLandmarks()
                // .withFaceDescriptors()
                .withFaceExpressions();
            drawFaceDescriptions(
                faceDescriptions,
                canvasElement,
                displaySize,
                drawFunctions,
            );
            break;
        }
        case "VIDEO": {
            const mtcnnOptions = new faceapi.MtcnnOptions({
                minConfidence: 0.5, // I don't even know if this property is available for MtcnnOptions...
                // "limiting the search space to larger faces for webcam detection"
                minFaceSize: 150,
            });
            const drawFunctions = [
                "drawDetections",
                "drawFaceLandmarks",
                "drawFaceExpressions",
            ];
            const detectInterval = setInterval(
                async () => {
                    faceDescriptions = await faceapi
                        .detectAllFaces(inputElement, mtcnnOptions)
                        .withFaceLandmarks()
                        .withFaceExpressions();
                    drawFaceDescriptions(
                        faceDescriptions,
                        canvasElement,
                        displaySize,
                        drawFunctions,
                    );
                },
                SETTINGS.videoFaceDetectionIntervalMs,
            );
            STATE.videoFaceDetectionIntervals.push(detectInterval);
            break;
        }
        default:
            error(`Invalid tag '${tagName}' as input element for generating face descriptions`);
    }

    output(`DONE detecting face '${playgroundName}'`);
}

// TODO: Refactor these parameters. Should take a single options object.
function drawFaceDescriptions(
    faceDescriptions,
    canvasElement,
    displaySize,
    drawFunctionNames = ["drawDetections"],
) {
    faceDescriptions = faceapi.resizeResults(
        faceDescriptions,
        displaySize,
    );
    faceapi.matchDimensions(canvasElement, displaySize);
    drawFunctionNames.forEach(drawFunc => {
        const draw = faceapi.draw[drawFunc];
        if (draw) {
            draw(canvasElement, faceDescriptions);
        } else {
            error(`Invalid draw function name '${drawFunc}'`);
        }
    });
}

async function runFaceDetections() {
    if (!STATE.areModelsLoaded) {
        error("Models aren't loaded yet");
        return;
    }

    clearVideoDetectionIntervals();

    showLoading();

    const playgrounds = Array.from(
        document.querySelectorAll(SETTINGS.dom.playgroundSelector)
    );

    Promise
        .all(playgrounds.map(detectFacesFromPlayground))
        .finally(hideLoading);
}

function clearVideoDetectionIntervals() {
    const intervalsAmount = STATE.videoFaceDetectionIntervals.length;
    const hasMultipleIntervals = intervalsAmount !== 1;
    STATE.videoFaceDetectionIntervals.forEach(clearInterval);
    STATE.videoFaceDetectionIntervals = [];
    if (intervalsAmount > 0)
        output(
            `Cleared ${intervalsAmount} video face detection interval${hasMultipleIntervals ? "s" : ""}`
        );
}

function main() {
    window.onload = () => {
        setupError();
        setupButtons();
        setupWebcam();
    };
}

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

main();
