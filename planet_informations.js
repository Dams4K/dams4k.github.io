const planetDisplayNames = {
    "star": "This world",
    "nsikipedia": "NSIkipédia",
    "cpsdisplay": "CPSDisplay"
};

class Planet {
    constructor(image_path, image_size, radius, duration, text) {
        this.image_path = image_path;
        this.image_size = image_size;
        this.radius = radius;
        this.duration = duration;
        this.text = text;
    }

    addPlanet(parent) {
        var planetContainer = document.createElement("div");
        planetContainer.style.backgroundImage = `url(${this.image_path})`;
        planetContainer.style.backgroundSize = this.image_size;
        planetContainer.style.transformOrigin = "top left";
        planetContainer.style.width = this.radius;
        planetContainer.style.height = this.radius;
        planetContainer.classList.add("planet", "centered");
        planetContainer.animate(
            [
                {transform: "rotate(0turn)"},
                {transform: "rotate(1turn)"},
            ],
            {
                duration: this.duration,
                iterations: Infinity
            }
        );

        parent.appendChild(planetContainer);
    }
}

const solarSystem = document.getElementById("solar_system");
var sun = new Planet("assets/textures/sun.gif", "20vh", "20vh", 0, "CPSDisplay");
var cpsdisplay = new Planet("assets/textures/cpsdisplay.gif", "4vh", "40vh", 15000, "CPSDisplay");
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