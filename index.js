function OnComponentMouseOver() {
    document.body.style.cursor = "pointer";
}

function OnComponentMouseOut() {
    document.body.style.cursor = "default"
}

function OnComponentClick(img) {
    var children = document.getElementById("circuit-container").children;
    var componentCounter = 0;
    for(var i = 0; i < children.length; i++) {
        if(children[i].id.slice(0, -1) === img.src.slice(0, -4)) {
            componentCounter++;
        }
    }
    var newComponent = document.createElement("img");
    newComponent.id = img.src.slice(0, -4) + componentCounter.toString();
    newComponent.src = img.src;
    newComponent.className = "component"
    newComponent.addEventListener("dragstart", ElementDragStart);
    newComponent.addEventListener("drag", ElementDrag);
    newComponent.addEventListener("dragend", ElementDragEnd);
    document.addEventListener("dragover", ElementDragOver);

    circuitContainer = document.getElementById("circuit-container");
    circuitContainer.appendChild(newComponent);

    /* put new component inside the grid */
    newComponent.style.position = "absolute";
    newComponent.style.left = circuitContainer.offsetLeft + ((circuitContainer.offsetWidth - 
        parseInt(getComputedStyle(circuitContainer, null).getPropertyValue("background-size").split(" ")[0])) / 2) + 40 + "px";
    newComponent.style.top = circuitContainer.offsetTop + ((circuitContainer.offsetHeight - 
        parseInt(getComputedStyle(circuitContainer, null).getPropertyValue("background-size").split(" ")[1])) / 2) + 40 + "px";

}

function ElementDragStart(event) {
    /* store the target id in the data transfer object */
    event.dataTransfer.setData("text/plain", event.target.id);

    /* store the target id in the local storage for events that can't access the data transfer object */
    localStorage.setItem("draggedElement", event.target.id);

    /* remove the ghost image when dragging */
    var ghostImage = new Image();
    ghostImage.src = "images/blank-ghost-image.svg";
    event.dataTransfer.setDragImage(ghostImage, 0, 0);
}

function ElementDragEnd(event) {
    localStorage.removeItem("draggedElement");
}

function ElementDragEnter(event) {
    event.preventDefault();
}

function ElementDragOver(event) {
    event.preventDefault();
}

function ElementDrag(event) {
    var circuitContainer = document.getElementById("circuit-container");
    var baseCircuitContainer = document.getElementById("base-circuit-container");
    var gridSize = parseInt(getComputedStyle(circuitContainer).getPropertyValue("--grid-size"));

    /* round to the nearest grid line. Subtract the parent offset because the child offset is relative to the parent and
    add 5 to compensate the size of the components-container */
    var left = Math.round((event.pageX - circuitContainer.offsetLeft) / gridSize) * gridSize + 5 + baseCircuitContainer.scrollLeft;

    /* round to the nearest grid line. Subtract the parent offset because the child offset is relative to the parent and
    remove 9 to center and compensate the height difference between grid cells and the component */
    var top = Math.round((event.pageY - circuitContainer.offsetTop + baseCircuitContainer.scrollTop) / gridSize) * gridSize - 9;

    /* keep component inside the circuit-container */
    var backgroundWidth = parseInt(getComputedStyle(circuitContainer).getPropertyValue("background-size"));
    var backgroundHeight = parseInt(getComputedStyle(circuitContainer).getPropertyValue("background-size").split(" ")[1]);
    var backgroundOffsetLeft = ((circuitContainer.offsetWidth - backgroundWidth) / 2);
    var backgroundOffsetTop = circuitContainer.offsetTop + ((circuitContainer.offsetHeight - backgroundHeight) / 2);

    if(left < backgroundOffsetLeft) {
        left = Math.round(backgroundOffsetLeft / gridSize) * gridSize;
    }
    /* subtract the component width to avoid having part of it out of bounds */
    if(left > backgroundOffsetLeft + backgroundWidth - document.getElementById(localStorage.getItem("draggedElement")).offsetWidth) {
        left = Math.round((backgroundOffsetLeft + backgroundWidth - 
            document.getElementById(localStorage.getItem("draggedElement")).offsetWidth) / gridSize) * gridSize;
    }
    if(top < backgroundOffsetTop) {
        top = Math.round((backgroundOffsetTop + 
            document.getElementById(localStorage.getItem("draggedElement")).offsetHeight) / gridSize) * gridSize - 9;
    }
    /* subtract the gridSize from the botton coordinate to avoid having half of the component out of bounds */
    if(top > backgroundOffsetTop + backgroundHeight - gridSize) {
        top = Math.round((backgroundOffsetTop + backgroundHeight - 
            document.getElementById(localStorage.getItem("draggedElement")).offsetHeight) / gridSize) * gridSize - 9;
    }

    document.getElementById(localStorage.getItem("draggedElement")).style.left = left + "px";
    document.getElementById(localStorage.getItem("draggedElement")).style.top = top + "px";
}

/* This function loads the ghost image used when dragging elements. This is necessary because otherwise the image will only
be loaded after the first dragstart event is fired, and so will not be shown on the first drag event */
function preloadGhostImage() {
    var ghostImage = new Image();
    ghostImage.src = "images/blank-ghost-image.svg";
}