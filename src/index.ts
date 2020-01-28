import faceapi from "face-api.js";
import { SETTINGS, STATE, ModelType } from "settings";
import { showLoading, hideLoading, output, error } from "util";
import { setupError, setupButtons, setupWebcam } from "setup.js";

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
            model => ModelType.getNet(model).loadFromUri(MODEL_URL)
        )
    );

    output("DONE loading models");
    hideLoading();
    STATE.areModelsLoaded = true;
}

async function detectFacesFromPlayground(playgroundElement: HTMLElement) {
    if (!playgroundElement) error("Playground wrapper element not given");

    const playgroundName = playgroundElement
        .getAttribute(SETTINGS.dom.playgroundNameAttribute) ||
        "UNNAMED";
    let inputElement = playgroundElement
        .querySelector(SETTINGS.dom.playgroundInputSelector);
    let canvasElement = playgroundElement
        .querySelector(SETTINGS.dom.playgroundCanvasSelector);

    if (!inputElement)
        error("Playground needs an element to be used as the input");
    if (!canvasElement)
        error("Playground needs a canvas element");

    inputElement = inputElement as HTMLElement;
    canvasElement = canvasElement as HTMLCanvasElement;

    const nonNumRe = /\D/g;
    const displaySize = {
        width:  Number(
            playgroundElement.style.width.replace(nonNumRe, "")
        ),
        height: Number(
            playgroundElement.style.height.replace(nonNumRe, "")
        ),
    };

    output(`Detecting face '${playgroundName}'...`);

    const tagName = inputElement.tagName;
    switch (tagName) {
        case "IMG": {
            const detectOptions = new faceapi.SsdMobilenetv1Options({
                minConfidence: 0.5,
            });
            const faceDescriptions = await faceapi
                .detectAllFaces(inputElement as faceapi.TNetInput, detectOptions)
                .withFaceLandmarks()
                // .withFaceDescriptors()
                .withFaceExpressions();
            faceapi.matchDimensions(
                canvasElement as any,
                displaySize,
            );
            faceapi.draw.drawDetections(
                canvasElement as HTMLCanvasElement,
                faceDescriptions,
            );
            faceapi.draw.drawFaceLandmarks(
                canvasElement as HTMLCanvasElement,
                faceDescriptions,
            );
            faceapi.draw.drawFaceExpressions(
                canvasElement as HTMLCanvasElement,
                faceDescriptions,
            );
            break;
        }

        case "VIDEO": {
            const mtcnnOptions = new faceapi.MtcnnOptions({
                // minConfidence: 0.5, // I don't even know if this property is available for MtcnnOptions...
                // "limiting the search space to larger faces for webcam detection"
                minFaceSize: 150,
            });
            const detectInterval = setInterval(
                async () => {
                    const faceDescriptions = faceapi.resizeResults(
                        await faceapi
                        .detectAllFaces(inputElement as faceapi.TNetInput, mtcnnOptions)
                        .withFaceLandmarks()
                        .withFaceExpressions(),
                        displaySize,
                    );
                    faceapi.matchDimensions(
                        canvasElement as any,
                        displaySize,
                    );
                    faceapi.draw.drawDetections(
                        canvasElement as HTMLCanvasElement,
                        faceDescriptions,
                    );
                    faceapi.draw.drawFaceLandmarks(
                        canvasElement as HTMLCanvasElement,
                        faceDescriptions,
                    );
                    faceapi.draw.drawFaceExpressions(
                        canvasElement as HTMLCanvasElement,
                        faceDescriptions,
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

async function runFaceDetections() {
    if (!STATE.areModelsLoaded) {
        error("Models aren't loaded yet");
        return;
    }

    clearVideoDetectionIntervals();

    showLoading();

    const playgrounds: Array<HTMLElement> = Array.from(
        document.querySelectorAll(SETTINGS.dom.playgroundSelector)
    );

    Promise
        .all(playgrounds.map(
            (playground) => detectFacesFromPlayground(playground)
        ))
        .then(hideLoading)
        .catch(hideLoading);
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

main();
