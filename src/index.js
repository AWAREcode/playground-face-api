const SETTINGS = {
    dom: {
        playgroundNameAttribute: "data-name",
        playgroundInputSelector: ".playground-input",
        playgroundCanvasSelector: "canvas",
    },

    modelsToLoad: [
        "ssdMobilenetv1",
        // "tinyFaceDetector",
        // "tinyYolov2",
        // "mtcnn",
        "faceLandmark68Net",
        // "faceLandmark68TinyNet",
        "faceRecognitionNet",
        "faceExpressionNet",
        // "ageGenderNet",
    ],
};

const STATE = {
    areModelsLoaded: false,
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

    if (!inputElement) error("Playground needs an element to be used as the input");

    output(`Detecting face '${playgroundName}'...`);

    const detectOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5,
    });

    const nonNumRe = /\D/g;
    const displaySize = {
        width:  playgroundElement.style.width.replace(nonNumRe, ""),
        height: playgroundElement.style.height.replace(nonNumRe, ""),
    };

    let fullFaceDescriptions;

    // TODO: Properly print error to output,
    //       this isn't working properly right now.
    try {
        const results = await (
            faceapi
                .detectAllFaces(inputElement, detectOptions)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()
        ); // .then(descs => descs).catch(err),

        fullFaceDescriptions = faceapi.resizeResults(
            results,
            displaySize,
        );
    } catch (e) {
        error(`Error detecting face '${playgroundName}':\n${e}`);
    }

    faceapi.matchDimensions(canvasElement, displaySize);
    drawFaceDescriptions(fullFaceDescriptions, canvasElement);

    output(`DONE detecting face '${playgroundName}'`);
}

function drawFaceDescriptions(faceDescriptions, canvasElement) {
    output("Drawing face descriptions...")
    faceapi.draw.drawDetections(canvasElement, faceDescriptions);
    faceapi.draw.drawFaceLandmarks(canvasElement, faceDescriptions);
    faceapi.draw.drawFaceExpressions(canvasElement, faceDescriptions);
}

async function runFaceDetections() {
    if (!STATE.areModelsLoaded) {
        error("Models aren't loaded yet");
        return;
    }

    showLoading();

    const playgrounds = Array.from(
        document.getElementsByClassName("playground")
    );

    Promise
        .all(playgrounds.map(detectFacesFromPlayground))
        .finally(hideLoading);
}

function main() {
    window.onload = () => {
        const loadBtnEl = document.getElementById("btn-load");
        loadBtnEl.onclick = loadModels;

        const runBtnEl = document.getElementById("btn-run");
        runBtnEl.onclick = runFaceDetections;
    };
}

main();
