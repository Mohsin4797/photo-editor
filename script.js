let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast:   { value: 100, min: 0, max: 200, unit: "%" },
    saturate:   { value: 100, min: 0, max: 200, unit: "%" },
    blur:       { value: 0,   min: 0, max: 20,  unit: "px" },
    grayscale:  { value: 0,   min: 0, max: 100, unit: "%" },
    sepia:      { value: 0,   min: 0, max: 100, unit: "%" },
    opacity:    { value: 100, min: 0, max: 100, unit: "%" }
};

let preset = {
    Normal: {
        brightness: 100, contrast: 100, saturate: 100,
        blur: 0, grayscale: 0, sepia: 0, opacity: 100
    },
    Vintage: {
        brightness: 110, contrast: 90, saturate: 80,
        blur: 0, grayscale: 0, sepia: 40, opacity: 100
    },
    "B&W": {
        brightness: 100, contrast: 110, saturate: 100,
        blur: 0, grayscale: 100, sepia: 0, opacity: 100
    },
    Warm: {
        brightness: 105, contrast: 105, saturate: 130,
        blur: 0, grayscale: 0, sepia: 25, opacity: 100
    },
    Cool: {
        brightness: 100, contrast: 105, saturate: 90,
        blur: 0, grayscale: 20, sepia: 0, opacity: 100
    },
    Soft: {
        brightness: 105, contrast: 95, saturate: 100,
        blur: 1, grayscale: 0, sepia: 5, opacity: 100
    }
};

let filt = document.querySelector(".filter");
let canvasImage = document.querySelector("#image-canvas");
let canvasCtx = canvasImage.getContext("2d");
let resetBtn = document.querySelector(".reset");
let downloadBtn = document.querySelector(".download");
let presetBtn = document.querySelector(".preset");
let image = null;

function createFilterElement(name, unit = "%", min, max, value) {
    let div = document.createElement("div");

    let p = document.createElement("p");
    p.innerText = name;

    let input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;

    div.appendChild(p);
    div.appendChild(input);

    input.addEventListener("input", (e) => {
        filters[name].value = Number(input.value);
        applyFilter();
    });

    return { div, input };
}

let sliderInputs = {};

function createElemnet() {
    filt.innerHTML = "";
    sliderInputs = {};

    Object.keys(filters).forEach(key => {
        const { div, input } = createFilterElement(
            key,
            filters[key].unit,
            filters[key].min,
            filters[key].max,
            filters[key].value
        );
        filt.appendChild(div);
        sliderInputs[key] = input;
    });
}
createElemnet();

let photo = document.querySelector("#photo");

photo.addEventListener("change", function () {
    const selectedFile = photo.files[0];

    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                document.querySelector("i").style.display = "none";
                image = img;

                canvasImage.width = img.width;
                canvasImage.height = img.height;

                applyFilter();
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
    }
});

function applyFilter() {
    if (!image) return;

    canvasCtx.clearRect(0, 0, canvasImage.width, canvasImage.height);

    canvasCtx.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturate.value}${filters.saturate.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
    `;

    canvasCtx.drawImage(image, 0, 0);
}

resetBtn.addEventListener("click", (e) => {
    filters = {
        brightness: { value: 100, min: 0, max: 200, unit: "%" },
        contrast:   { value: 100, min: 0, max: 200, unit: "%" },
        saturate:   { value: 100, min: 0, max: 200, unit: "%" },
        blur:       { value: 0,   min: 0, max: 20,  unit: "px" },
        grayscale:  { value: 0,   min: 0, max: 100, unit: "%" },
        sepia:      { value: 0,   min: 0, max: 100, unit: "%" },
        opacity:    { value: 100, min: 0, max: 100, unit: "%" }
    };
    createElemnet();
    applyFilter();
});

downloadBtn.addEventListener("click", (e) => {
    const link = document.createElement("a");
    link.download = "Edited-img-download.png"; 
    link.href = canvasImage.toDataURL("image/png");
    link.click();
});

Object.keys(preset).forEach(presetName => {
    let button = document.createElement("button");
    button.classList.add("preset-btn");
    button.innerText = presetName;
    button.dataset.preset = presetName;

    presetBtn.appendChild(button);
});


function handlePresetClick(e) {
    const button = e.target.closest(".preset-btn");
    if (!button || !presetBtn.contains(button)) return;

    const presetName = button.dataset.preset;
    const values = preset[presetName];
    if (!values) return;

    Object.keys(values).forEach(key => {
        filters[key].value = values[key];
        if (sliderInputs[key]) {
            sliderInputs[key].value = values[key];
        }
    });

    applyFilter();
}

presetBtn.addEventListener("click", handlePresetClick);