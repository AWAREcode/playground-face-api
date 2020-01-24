async function loadModels() {
    output("Loading models...");
    showLoading();

    const MODEL_URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.0/weights/";

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);

    output("DONE loading models");
    hideLoading();
}

async function detectFaceFromImg(imgElement) {
    output("Detecting face...");
    showLoading();

    const detectOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5,
    });

    const fullFaceDescriptions = await faceapi
        .detectAllFaces(imgElement, detectOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();

    output("DONE detecting face");
    hideLoading();

    console.log(fullFaceDescriptions);
    output(JSON.stringify(fullFaceDescriptions));
}

async function main() {
    await loadModels();

    const imgEl = document.getElementById("image");
    if (imgEl)
        detectFaceFromImg(imgEl);
}

main();
