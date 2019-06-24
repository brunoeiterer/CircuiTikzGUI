function OnNewComponentMouseOver() {
    document.body.style.cursor = "pointer";
}

function OnNewComponentMouseOut() {
    document.body.style.cursor = "default"
}

function OnNewComponentClick(img) {
    var children = document.getElementById("circuit-container").children;
    var componentCounter = 0;
    
    for(var i = 0; i < children.length; i++) {
        for(var j = 0; j < children[i].getElementsByTagName("img").length; j++) {
            if(children[i].getElementsByTagName("img")[0].id.slice(0, -1) === img.src.slice(0, -4)) {
                componentCounter++;
            }
        }
    }
    var newComponent = document.createElement("img");
    newComponent.id = img.src.slice(0, -4) + componentCounter.toString();
    newComponent.src = img.src;
    newComponent.className = "component"
    newComponent.tabIndex = 0;
    newComponent.addEventListener("focus", OnComponentFocus);
    newComponent.addEventListener("blur", OnComponentBlur);

    document.addEventListener("dragover", ElementDragOver);

    var newComponentContainer = document.createElement("div");
    newComponentContainer.className = "component-container";
    newComponentContainer.id = img.src.slice(0, -4) + "-container" + componentCounter.toString();
    newComponentContainer.appendChild(newComponent);
    newComponentContainer.addEventListener("mouseenter", OnComponentMouseEnter);
    newComponentContainer.addEventListener("mouseleave", OnComponentMouseLeave);
    newComponentContainer.addEventListener("dragstart", ElementDragStart);
    newComponentContainer.addEventListener("drag", ElementDrag);
    newComponentContainer.addEventListener("dragend", ElementDragEnd);

    circuitContainer = document.getElementById("circuit-container");
    circuitContainer.appendChild(newComponentContainer);

    /* put new component inside the grid */
    var left = circuitContainer.offsetLeft + ((circuitContainer.offsetWidth - 
        parseInt(getComputedStyle(circuitContainer, null).getPropertyValue("background-size").split(" ")[0])) / 2) + 40;
    var top = circuitContainer.offsetTop + ((circuitContainer.offsetHeight - 
        parseInt(getComputedStyle(circuitContainer, null).getPropertyValue("background-size").split(" ")[1])) / 2) + 40;
    newComponentContainer.style.position = "absolute";
    var gridSize = parseInt(getComputedStyle(circuitContainer).getPropertyValue("--grid-size"));
    newComponentContainer.style.left = (Math.round(left / gridSize)) * gridSize + "px";
    newComponentContainer.style.top =  (Math.round(top / gridSize)) * gridSize - 9 + "px";
}

function ElementDragStart(event) {
    /* store the target id in the data transfer object */
    event.dataTransfer.setData("text/plain", event.target.parentElement.id);

    /* store the target id in the local storage for events that can't access the data transfer object */
    localStorage.setItem("draggedElement", event.target.parentElement.id);

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
    var left = Math.round((event.pageX - circuitContainer.offsetLeft) / gridSize) * gridSize + baseCircuitContainer.scrollLeft;

    /* round to the nearest grid line. Subtract the parent offset because the child offset is relative to the parent and
    remove 9 to center and compensate the height difference between grid cells and the component */
    var top = Math.round((event.pageY - circuitContainer.offsetTop + baseCircuitContainer.scrollTop) / gridSize) * gridSize - 9;

    /* keep component inside the circuit-container */
    var backgroundWidth = parseInt(getComputedStyle(circuitContainer).getPropertyValue("background-size"));
    var backgroundHeight = parseInt(getComputedStyle(circuitContainer).getPropertyValue("background-size").split(" ")[1]);
    var backgroundOffsetLeft = ((circuitContainer.offsetWidth - backgroundWidth) / 2);
    var backgroundOffsetTop = circuitContainer.offsetTop + ((circuitContainer.offsetHeight - backgroundHeight) / 2);
    var componentWidth = document.getElementById(localStorage.getItem("draggedElement")).children[0].offsetWidth;
    var componentHeight = document.getElementById(localStorage.getItem("draggedElement")).children[0].offsetHeight;

    if(left < backgroundOffsetLeft) {
        left = Math.round(backgroundOffsetLeft / gridSize) * gridSize;
    }
    /* subtract the component width to avoid having part of it out of bounds */
    if(left > backgroundOffsetLeft + backgroundWidth - componentWidth) {
        left = Math.round((backgroundOffsetLeft + backgroundWidth - componentWidth) / gridSize) * gridSize;
    }
    if(top < backgroundOffsetTop) {
        top = Math.round((backgroundOffsetTop + componentHeight) / gridSize) * gridSize - 9;
    }
    /* subtract the gridSize from the botton coordinate to avoid having half of the component out of bounds */
    if(top > backgroundOffsetTop + backgroundHeight - gridSize) {
        top = Math.round((backgroundOffsetTop + backgroundHeight - componentHeight) / gridSize) * gridSize - 9;
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

/* show connection guides when hovering over component
   connection guides are also shown when the component is focused, so a check is perfomed to avoid showing duplicates */
function OnComponentMouseEnter(event) {
    if(!document.activeElement.isEqualNode(event.target.getElementsByTagName("img")[0])) {
        var upperRightRotationArrow = document.createElement("div");
        upperRightRotationArrow.className = "component-upper-right-rotation-arrow";
        upperRightRotationArrow.innerHTML = "⤻";
        upperRightRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "upper-right-rotation-arrow";
        upperRightRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        upperRightRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(upperRightRotationArrow);

        var upperLeftRotationArrow = document.createElement("div");
        upperLeftRotationArrow.className = "component-upper-left-rotation-arrow";
        upperLeftRotationArrow.innerHTML = "⤺";
        upperLeftRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "upper-left-rotation-arrow";
        upperLeftRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        upperLeftRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(upperLeftRotationArrow);
        
        var bottomLeftRotationArrow = document.createElement("div");
        bottomLeftRotationArrow.className = "component-bottom-left-rotation-arrow";
        bottomLeftRotationArrow.innerHTML = "⤻";
        bottomLeftRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "bottom-left-rotation-arrow";
        bottomLeftRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        bottomLeftRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(bottomLeftRotationArrow);

        var bottomRightRotationArrow = document.createElement("div");
        bottomRightRotationArrow.className = "component-bottom-right-rotation-arrow";
        bottomRightRotationArrow.innerHTML = "⤻";
        bottomRightRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "bottom-right-rotation-arrow";
        bottomRightRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        bottomRightRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(bottomRightRotationArrow);

        var leftCircle = document.createElement("div");
        leftCircle.className = "component-left-circle";
        leftCircle.innerText = "●";
        leftCircle.id = event.target.getElementsByTagName("img")[0].id + "left-circle";
        leftCircle.addEventListener("click", OnComponentConnectionClick);
        event.target.appendChild(leftCircle);
    
        var rightCircle = document.createElement("div");
        rightCircle.className = "component-right-circle";
        rightCircle.innerText = "●";
        rightCircle.id = event.target.getElementsByTagName("img")[0].id + "right-circle";
        rightCircle.addEventListener("click", OnComponentConnectionClick);
        event.target.appendChild(rightCircle);
    }
}

/* hide connection guides when mouse is not hovering over the component anymore
   a check is performed to avoid removing the connection guides if the component is still focused */
function OnComponentMouseLeave(event) {
    if(!document.activeElement.isEqualNode(event.target.getElementsByTagName("img")[0])) {
        event.target.removeChild(document.getElementById(event.target.getElementsByTagName("img")[0].id + "left-circle"));
        event.target.removeChild(document.getElementById(event.target.getElementsByTagName("img")[0].id + "right-circle"));
        event.target.removeChild(
            document.getElementById(event.target.getElementsByTagName("img")[0].id + "upper-right-rotation-arrow"));
        event.target.removeChild(
            document.getElementById(event.target.getElementsByTagName("img")[0].id + "upper-left-rotation-arrow"));
        event.target.removeChild(
        document.getElementById(event.target.getElementsByTagName("img")[0].id + "bottom-left-rotation-arrow"));
        event.target.removeChild(
            document.getElementById(event.target.getElementsByTagName("img")[0].id + "bottom-right-rotation-arrow"));
    }
}

/* show connection guides when component is focused */
function OnComponentFocus(event) {
    if(event.target.parentElement.getElementsByTagName("div").length == 0) {
        var upperRightRotationArrow = document.createElement("div");
        upperRightRotationArrow.className = "component-upper-right-rotation-arrow";
        upperRightRotationArrow.innerHTML = "⤻";
        upperRightRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "upper-right-rotation-arrow";
        upperRightRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        upperRightRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(upperRightRotationArrow);

        var upperLeftRotationArrow = document.createElement("div");
        upperLeftRotationArrow.className = "component-upper-left-rotation-arrow";
        upperLeftRotationArrow.innerHTML = "⤺";
        upperLeftRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "upper-left-rotation-arrow";
        upperLeftRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        upperLeftRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(upperLeftRotationArrow);

        var bottomLeftRotationArrow = document.createElement("div");
        bottomLeftRotationArrow.className = "component-bottom-left-rotation-arrow";
        bottomLeftRotationArrow.innerHTML = "⤻";
        bottomLeftRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "bottom-left-rotation-arrow";
        bottomLeftRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        bottomLeftRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(bottomLeftRotationArrow);

        var bottomRightRotationArrow = document.createElement("div");
        bottomRightRotationArrow.className = "component-bottom-right-rotation-arrow";
        bottomRightRotationArrow.innerHTML = "⤻";
        bottomRightRotationArrow.id = event.target.getElementsByTagName("img")[0].id + "bottom-right-rotation-arrow";
        bottomRightRotationArrow.addEventListener("mouseenter", OnComponentRotationArrowEnter);
        bottomRightRotationArrow.addEventListener("mouseleave", OnComponentRotationArrowLeave);
        event.target.appendChild(bottomRightRotationArrow);

        var leftCircle = document.createElement("div");
        leftCircle.className = "component-left-circle";
        leftCircle.innerText = "●";
        leftCircle.id = event.target.id + "left-circle";
        leftCircle.addEventListener("click", OnComponentConnectionClick);
        event.target.parentElement.appendChild(leftCircle);
    
        var rightCircle = document.createElement("div");
        rightCircle.className = "component-right-circle";
        rightCircle.innerText = "●";
        rightCircle.id = event.target.id + "right-circle";
        rightCircle.addEventListener("click", OnComponentConnectionClick);
        event.target.parentElement.appendChild(rightCircle);
    }

    document.addEventListener("keydown", OnKeyDownEvent);
}

/* hide connection guides when component loses focus */
function OnComponentBlur(event) {
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "left-circle"));
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "right-circle"));
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "upper-right-rotation-arrow"));
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "upper-left-rotation-arrow"));
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "bottom-left-rotation-arrow"));
    event.target.parentElement.removeChild(document.getElementById(event.target.id + "bottom-right-rotation-arrow"));
}

/* start drawing a connection when user clicks on a connection guide */
function OnComponentConnectionClick(event) {
    event.stopPropagation();
    var circuitContainer = document.getElementById("circuit-container");
    circuitContainer.addEventListener("mousemove", OnComponentConnectionMove);
    circuitContainer.addEventListener("click", OnComponentConnectionEnd);

    var gridSize = parseInt(getComputedStyle(circuitContainer).getPropertyValue("--grid-size"));

    var newConnection = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newConnection.id = event.target.id + "connection";
    var x = Math.round((event.pageX + circuitContainer.scrollLeft - circuitContainer.offsetLeft) / gridSize) * gridSize;
    var y = Math.round((event.pageY + circuitContainer.scrollTop - circuitContainer.offsetTop) / gridSize) * gridSize;

    newConnection.setAttribute("x1", x + "px");
    newConnection.setAttribute("y1", y + "px");
    newConnection.style.stroke = "black";
    newConnection.style.strokeWidth = 1 + "px";

    var connectionsContainer = document.getElementById("connections-container");
    connectionsContainer.appendChild(newConnection);

    localStorage.setItem("newConnectionID", newConnection.id);
}

/* draw a connection when a user has clicked on a connection guide and moves the mouse */
function OnComponentConnectionMove(event) {
    var circuitContainer = document.getElementById("circuit-container");
    var connection = document.getElementById(localStorage.getItem("newConnectionID"));
    var gridSize = parseInt(getComputedStyle(circuitContainer).getPropertyValue("--grid-size"));

    /* snap connection to grid */
    var x2 = Math.round(((event.pageX + circuitContainer.scrollLeft - circuitContainer.offsetLeft) / gridSize)) * gridSize;
    var y2 = Math.round(((event.pageY + circuitContainer.scrollTop - circuitContainer.offsetTop) / gridSize)) * gridSize;
    connection.setAttribute("x2", x2 + "px");
    connection.setAttribute("y2", y2 + "px");
}

/* finish the connection drawing */
function OnComponentConnectionEnd(event) {
    circuitContainer.removeEventListener("mousemove", OnComponentConnectionMove);
}

function OnKeyDownEvent(event) {
    if(event.keyCode == 46) {
        var focusedComponent = document.activeElement;
        var focusedComponentContainer = focusedComponent.parentElement;
        focusedComponentContainer.removeChild(focusedComponent);
        focusedComponentContainer.parentElement.removeChild(focusedComponentContainer);
        document.removeEventListener("keydown");
    }
}

function OnComponentRotationArrowEnter(event) {
    document.body.style.cursor = "crosshair";
}

function OnComponentRotationArrowLeave(event) {
    document.body.style.cursor = "default";
}