const SETTINGS = {
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

async function detectFaceFromImgWithCanvas(imgElement, canvasElement) {
    const imgName = imgElement.alt || imgElement.src.split("/").pop();
    output(`Detecting face '${imgName}'...`);

    const detectOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5,
    });

    const displaySize = {
        width:  imgElement.width,
        height: imgElement.height,
    };

    const err = e => error(`Error detecting face '${imgName}':\n${e}`);

    let fullFaceDescriptions;

    // TODO: Properly print error to output,
    //       this isn't working properly right now.
    try {
        const results = await (
            faceapi
                .detectAllFaces(imgElement, detectOptions)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()
        ); // .then(descs => descs).catch(err),

        fullFaceDescriptions = faceapi.resizeResults(
            results,
            displaySize,
        );
    } catch (e) {
        err(e);
    }

    faceapi.matchDimensions(canvasElement, displaySize)
    faceapi.draw.drawDetections(canvasElement, fullFaceDescriptions);

    output(`DONE detecting face '${imgName}'`);
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

    await Promise.all(playgrounds.map(playground => {
        const imgEl = playground.getElementsByTagName("img")[0];
        const canvasEl = playground.getElementsByTagName("canvas")[0];
        if (!imgEl)    error("No image element in playground");
        if (!canvasEl) error("No canvas element in playground");

        return detectFaceFromImgWithCanvas(imgEl, canvasEl);
    }));

    hideLoading();
}

function main() {
    const loadBtnEl = document.getElementById("btn-load");
    loadBtnEl.onclick = loadModels;

    const runBtnEl = document.getElementById("btn-run");
    runBtnEl.onclick = runFaceDetections;
}

main();
