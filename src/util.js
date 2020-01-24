function getLoaderElement() {
    const el = document.getElementsByClassName("loader-wrapper")[0];
    if (!el) throw new Error("No loader element");
    return el;
}

function getOutputElement() {
    const el = document.getElementById("output");
    if (!el) throw new Error("No output element");
    return el;
}

function showLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.remove("hidden");
}

function hideLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.add("hidden");
}

function output(msg) {
    const outputEl = getOutputElement();
    const newDiv = document.createElement("div");
    newDiv.innerText = msg;
    outputEl.appendChild(newDiv);

    outputEl.scrollTop = outputEl.scrollHeight;
}
