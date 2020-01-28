const OrigError = Error;

export function showLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.remove("hidden");
}

export function hideLoading() {
    const loaderEl = getLoaderElement();
    loaderEl.classList.add("hidden");
}

export function output(msg: string) {
    const newEl = document.createElement("div");
    newEl.classList.add("output--msg");
    newEl.innerText = msg;
    addElementToOutput(newEl);
}

export function error(errmsg: string) {
    const newEl = document.createElement("div");
    newEl.classList.add("output--err");
    newEl.innerText = errmsg;
    addElementToOutput(newEl);
    throw new OrigError(errmsg);
}

function addElementToOutput(childEl: HTMLElement) {
    const outputEl = getOutputElement();
    outputEl.appendChild(childEl);
    outputEl.scrollTop = outputEl.scrollHeight;
}

function getLoaderElement() {
    const el = document.getElementsByClassName("loader-wrapper")[0];
    if (!el) error("No loader element");
    return el;
}

function getOutputElement(): HTMLElement {
    const el = document.getElementById("output");
    if (!el) error("No output element");
    return el as HTMLElement;
}
