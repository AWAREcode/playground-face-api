(() => {
    window.onload = () => {
        const asyncRun = async func => func();
        asyncRun(setupError);
        asyncRun(setupButtons)
        asyncRun(setupWebcam);
    };
})();
