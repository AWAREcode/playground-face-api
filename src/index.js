async function loadModels() {
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
}

async function detectFaceFromImgWithCanvas(imgElement, canvasElement) {
    output("Detecting face...");
    showLoading();

    const detectOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5,
    });

    const displaySize = {
        width:  imgElement.width,
        height: imgElement.height,
    };

    const fullFaceDescriptions = faceapi.resizeResults(
        await faceapi
            .detectAllFaces(imgElement, detectOptions)
            .withFaceLandmarks()
            .withFaceDescriptors(),
        displaySize,
    );

    faceapi.matchDimensions(canvasElement, displaySize)
    faceapi.draw.drawDetections(canvasElement, fullFaceDescriptions);

    output("DONE detecting face");
    hideLoading();

    console.log(fullFaceDescriptions);
}

async function main() {
    await loadModels();

    const playgrounds = Array.from(
        document.getElementsByClassName("playground")
    );

    for (let playground of playgrounds) {
        const imgEl = playground.getElementsByTagName("img")[0];
        const canvasEl = playground.getElementsByTagName("canvas")[0];
        if (!imgEl)    error("No image element in playground");
        if (!canvasEl) error("No canvas element in playground");

        detectFaceFromImgWithCanvas(imgEl, canvasEl);
    }
}

main();
