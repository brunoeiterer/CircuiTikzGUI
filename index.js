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
    document.getElementById("circuit-container").appendChild(newComponent);
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
    var gridSize = parseInt(getComputedStyle(circuitContainer, null).getPropertyValue("--grid-size"));

    /* round to the nearest grid line and add 5 to compensate the size of the components-container */
    var left = Math.round(event.pageX / gridSize) * gridSize + 5;

    /* round to the nearest grid line and remove 8 to center and compensate the height difference between grid cells 
    and the component */
    var top = Math.round(event.pageY / gridSize) * gridSize - 8;

    document.getElementById(localStorage.getItem("draggedElement")).style.left = left + "px";
    document.getElementById(localStorage.getItem("draggedElement")).style.top = top + "px";
}

/* This function loads the ghost image used when draggin elements. This is necessary because otherwise the image will only
be loaded after the first dragstart event is fired, and so will not be shown on the first drag event */
function preloadGhostImage() {
    var ghostImage = new Image();
    ghostImage.src = "images/blank-ghost-image.svg";
}