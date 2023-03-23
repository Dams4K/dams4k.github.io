// adding fmod function
Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

const planetDisplayNames = {
    "star": "This world",
    "nsikipedia": "NSIkipédia",
    "cpsdisplay": "CPSDisplay"
};

function vh2px(vh) {
    return document.body.offsetHeight * vh/100;
}

class Planet {
    constructor(imagePath, imageSize, radius, duration, text) {
        this.imagePath = imagePath;
        this.imageSize = imageSize;
        this.radius = radius;
        this.duration = duration;
        this.text = text;
        this.textOffsetY = 0;

        this.initialRotation = Math.random() * 360;

        this.planetContainer = null;
        this.planetHitbox = null;
        this.label = null;
    }

    addPlanet(parent) {
        this.planetContainer = this.generateContainer();
        this.planetHitbox = this.generateHitbox();
        this.planetContainer.appendChild(this.planetHitbox);
        parent.appendChild(this.planetContainer);
    }

    generateContainer() {
        var newContainer = document.createElement("div");
        newContainer.style.backgroundImage = `url(${this.imagePath})`;
        newContainer.style.backgroundSize = this.imageSize;
        newContainer.style.transformOrigin = "top left";
        newContainer.style.width = this.radius;
        newContainer.style.height = this.radius;
        newContainer.classList.add("planet", "centered");
        newContainer.animate(
            [
                {transform: `rotate(${this.initialRotation}deg)`},
                {transform: `rotate(${this.initialRotation + 360}deg)`},
            ],
            {
                duration: this.duration,
                iterations: Infinity
            }
        );

        return newContainer;
    }

    generateHitbox() {
        var newHitbox = document.createElement("div");
        newHitbox.classList.add("centered");
        newHitbox.style.width = this.imageSize;
        newHitbox.style.height = this.imageSize;
        newHitbox.style.position = "inherite";

        return newHitbox;
    }

    showText(parent) {
        this.label = document.createElement("div");
        this.label.innerText = this.text;
        this.label.style.position = "absolute";
        setInterval(() => {
            var hitboxRect = this.planetHitbox.getBoundingClientRect();
            var centerX = (hitboxRect.left+hitboxRect.right)/2;
            var centerY = (hitboxRect.top+hitboxRect.bottom)/2;

            this.label.style.top = `${centerY + vh2px(parseInt(this.imageSize.substr(0, this.imageSize.length-2)))/2 + this.textOffsetY}px`;
            this.label.style.left = `${centerX - this.label.offsetWidth/2}px`;
        }, 0.05);

        parent.appendChild(this.label);
    }
}

const solarSystem = document.getElementById("solar_system");

var sun = new Planet("assets/textures/sun.gif", "20vh", "20vh", 0, "This World");
sun.textOffsetY = -30;
sun.showText(solarSystem);

var cpsdisplay = new Planet("assets/textures/cpsdisplay.gif", "4vh", "30vh", 25000, "CPSDisplay");
cpsdisplay.textOffsetY = 10;
cpsdisplay.showText(solarSystem);

var nsikipedia = new Planet("assets/textures/nsikipedia.gif", "3vh", "20vh", 30000, "NSIkipédia");
nsikipedia.textOffsetY = 5;
nsikipedia.showText(solarSystem);

var minesweeper = new Planet("assets/textures/minesweeper.gif", "3.5vh", "20vh", 30000, "Minesweeper")
minesweeper.textOffsetY = 5;
minesweeper.initialRotation = Math.fmod(nsikipedia.initialRotation + 100, 360);
minesweeper.showText(solarSystem);

sun.addPlanet(solarSystem);
cpsdisplay.addPlanet(solarSystem);
nsikipedia.addPlanet(solarSystem);
minesweeper.addPlanet(solarSystem);