const SETTINGS = {
    dom: {
        detectorSelector:       ".detector:not(.disabled)",
        detectorNameAttribute:  "data-name",
        detectorInputSelector:  ".detector-input",
        detectorCanvasSelector: "canvas",
        videoWebcamSelector:    "video.webcam",
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
