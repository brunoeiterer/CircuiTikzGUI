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
    document.getElementById("circuit-container").appendChild(newComponent);
}

function ElementDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function ElementDragEnter(event) {
    event.preventDefault();
}

function ElementDragOver(event) {
    event.preventDefault();
}

function ElementDrop(event) {
    event.preventDefault();
    document.getElementById(event.dataTransfer.getData("text/plain")).style.left = event.pageX + "px";
    document.getElementById(event.dataTransfer.getData("text/plain")).style.top = event.pageY + "px";
}