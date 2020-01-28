import {
    nets,
    SsdMobilenetv1,
    TinyFaceDetector,
    TinyYolov2,
    Mtcnn,
    FaceLandmark68Net,
    FaceLandmark68TinyNet,
    FaceRecognitionNet,
    FaceExpressionNet,
    AgeGenderNet,
} from "face-api.js"

enum ModelType {
    SsdMobilenetv1,
    TinyFaceDetector,
    TinyYolov2,
    Mtcnn,
    FaceLandmark68Net,
    FaceLandmark68TinyNet,
    FaceRecognitionNet,
    FaceExpressionNet,
    AgeGenderNet,
}

namespace ModelType {
    type AnyNet = SsdMobilenetv1
        | TinyFaceDetector
        | TinyYolov2
        | Mtcnn
        | FaceLandmark68Net
        | FaceLandmark68TinyNet
        | FaceRecognitionNet
        | FaceExpressionNet
        | AgeGenderNet;

    export function getNet(modeltype: ModelType): AnyNet {
        switch (modeltype) {
            case ModelType.SsdMobilenetv1:
                return nets.ssdMobilenetv1;
            case ModelType.TinyFaceDetector:
                return nets.tinyFaceDetector;
            case ModelType.TinyYolov2:
                return nets.tinyYolov2;
            case ModelType.Mtcnn:
                return nets.mtcnn;
            case ModelType.FaceLandmark68Net:
                return nets.faceLandmark68Net;
            case ModelType.FaceLandmark68TinyNet:
                return nets.faceLandmark68TinyNet;
            case ModelType.FaceRecognitionNet:
                return nets.faceRecognitionNet;
            case ModelType.FaceExpressionNet:
                return nets.faceExpressionNet;
            case ModelType.AgeGenderNet:
                return nets.ageGenderNet;
        }
    }
}

interface ISettings {
    dom: {
        playgroundSelector:       string;
        playgroundNameAttribute:  string;
        playgroundInputSelector:  string;
        playgroundCanvasSelector: string;
        videoWebcamSelector:      string;
    };
    videoFaceDetectionIntervalMs: number;
    modelsToLoad: Array<ModelType>;
}

const SETTINGS: ISettings = {
    dom: {
        playgroundSelector:       ".playground:not(.disabled)",
        playgroundNameAttribute:  "data-name",
        playgroundInputSelector:  ".playground-input",
        playgroundCanvasSelector: "canvas",
        videoWebcamSelector:      "video.webcam",
    },

    videoFaceDetectionIntervalMs: 200,

    modelsToLoad: [
        ModelType.SsdMobilenetv1,
        ModelType.Mtcnn,
        ModelType.FaceLandmark68Net,
        ModelType.FaceRecognitionNet,
        ModelType.FaceExpressionNet,
    ],
};

interface IState {
    areModelsLoaded: boolean;
    videoFaceDetectionIntervals: Array<number>;
};

const STATE: IState = {
    areModelsLoaded: false,
    videoFaceDetectionIntervals: [],
};

export { SETTINGS, STATE, ModelType };
