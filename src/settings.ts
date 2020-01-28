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
