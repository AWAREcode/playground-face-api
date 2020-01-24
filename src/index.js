async function loadModels() {
    output("loading models...");
    showLoading();

    const MODEL_URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.0/weights/";

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);

    output("done loading models");
    hideLoading();
}

async function detectFaceFromImg(imgElement) {
    output("detecting face...");
    showLoading();

    const fullFaceDescriptions = await faceapi
        .detectAllFaces(imgElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

    output("done detecting face");
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
