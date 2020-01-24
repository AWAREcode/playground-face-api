const state = {
    areModelsLoaded: false,
};

async function loadModels() {
    state.areModelsLoaded = false;
    output("Loading models...");
    showLoading();

    const MODEL_URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.0/weights/";

    await Promise.all([
        faceapi.loadSsdMobilenetv1Model(MODEL_URL),
        faceapi.loadFaceLandmarkModel(MODEL_URL),
        faceapi.loadFaceRecognitionModel(MODEL_URL),
    ]);

    output("DONE loading models");
    hideLoading();
    state.areModelsLoaded = true;
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

    const fullFaceDescriptions = faceapi.resizeResults(
        await (
            faceapi
                .detectAllFaces(imgElement, detectOptions)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()
        ).then(descs => descs).catch(e => {
            error(`Error detecting face '${imgName}':\n${e}`);
        }),
        displaySize,
    );

    faceapi.matchDimensions(canvasElement, displaySize)
    faceapi.draw.drawDetections(canvasElement, fullFaceDescriptions);

    output(`DONE detecting face '${imgName}'`);
}


async function runFaceDetections() {
    if (!state.areModelsLoaded) {
        error("Models aren't loaded yet");
        return;
    }

    showLoading();

    const playgrounds = Array.from(
        document.getElementsByClassName("playground")
    );

    Promise.all(playgrounds.map(playground => {
        const imgEl = playground.getElementsByTagName("img")[0];
        const canvasEl = playground.getElementsByTagName("canvas")[0];
        if (!imgEl)    error("No image element in playground");
        if (!canvasEl) error("No canvas element in playground");

        return detectFaceFromImgWithCanvas(imgEl, canvasEl);
    })).finally(hideLoading);
}

function main() {
    const loadBtnEl = document.getElementById("btn-load");
    loadBtnEl.onclick = loadModels;

    const runBtnEl = document.getElementById("btn-run");
    runBtnEl.onclick = runFaceDetections;
}

main();
