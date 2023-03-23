const planetDisplayNames = {
    "star": "This world",
    "nsikipedia": "NSIkipédia",
    "cpsdisplay": "CPSDisplay"
};

class Planet {
    constructor(imagePath, imageSize, radius, duration, text) {
        this.imagePath = imagePath;
        this.imageSize = imageSize;
        this.radius = radius;
        this.duration = duration;
        this.text = text;

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
            this.label.style.top = `${hitboxRect.top}px`;
            this.label.style.left = `${hitboxRect.left}px`;
        }, 0.05);

        parent.appendChild(this.label);
    }
}

const solarSystem = document.getElementById("solar_system");
var sun = new Planet("assets/textures/sun.gif", "20vh", "20vh", 0, "CPSDisplay");
var cpsdisplay = new Planet("assets/textures/cpsdisplay.gif", "4vh", "40vh", 15000, "CPSDisplay");
cpsdisplay.showText(document.body);
sun.addPlanet(solarSystem);
cpsdisplay.addPlanet(solarSystem);

// const planetInformationDiv = document.createElement("div");
// planetInformationDiv.style.position = "absolute";        
// document.body.appendChild(planetInformationDiv);

// const planetHitBoxs = document.getElementsByClassName("planet_hitbox");
// var planetNames = {}

// for (const planetHitbox of planetHitBoxs) {
//     planet = planetHitbox.parentElement;
//     planetNames[planetHitbox.id] = document.createElement("div");
    
//     planetName = planetNames[planetHitbox.id];
//     planetName.innerText = planetDisplayNames[planet.id];
//     planetName.style.position = "absolute";
//     planetName.classList.add("planet_name");

//     setInterval(() => {followPlanet(planetHitbox);}, 0.05);
//     document.body.appendChild(planetName);
// }

// function followPlanet(planetHitbox) {
//     var planet = planetHitbox.parentElement;
//     var element = planetNames[planetHitbox.id];
//     var boudingPlanetRect = planetHitbox.getBoundingClientRect();
//     var parentBoudingPlanetRect = planet.getBoundingClientRect();
//     element.style.left = `${boudingPlanetRect.left}px`;
//     element.style.top = `${boudingPlanetRect.top + boudingPlanetRect.height}px`;
//     element.style.width = `${boudingPlanetRect.width}px`;
// }