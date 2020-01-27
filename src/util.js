function showLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.remove("hidden");
}

function hideLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.add("hidden");
}

function output(msg) {
    const newEl = document.createElement("div");
    newEl.classList.add("output--msg");
    newEl.innerText = msg;
    addElementToOutput(newEl);
}

function error(errmsg) {
    const newEl = document.createElement("div");
    newEl.classList.add("output--err");
    newEl.innerText = errmsg;
    addElementToOutput(newEl);
    throw new Error(errmsg);
}

function addElementToOutput(childEl) {
    const outputEl = getOutputElement();
    outputEl.appendChild(childEl);
    outputEl.scrollTop = outputEl.scrollHeight;
}

function getLoaderElement() {
    const el = document.getElementsByClassName("loader-wrapper")[0];
    if (!el) error("No loader element");
    return el;
}

function getOutputElement() {
    const el = document.getElementById("output");
    if (!el) error("No output element");
    return el;
}
