async function loadModels() {
    const MODEL_URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.0/weights/";

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

async function detectFaceFromImg(imgElement) {
    showLoading();

    const fullFaceDescriptions = await faceapi
        .detectAllFaces(imgElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

    hideLoading();

    console.log(fullFaceDescriptions);
    // output(fullFaceDescriptions);
}

function showLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.remove("hidden");
}

function hideLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.add("hidden");
}

function getLoaderElement() {
    const el = document.getElementsByClassName("loader-wrapper")[0];
    if (!el)
        throw new Error("No loader element");
    return el;
}

async function main() {
    await loadModels();

    const imgEl = document.getElementById("image");
    if (imgEl)
        detectFaceFromImg(imgEl);
}

main();
