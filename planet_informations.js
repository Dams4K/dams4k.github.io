const planetDisplayNames = {
    "star": "This world",
    "nsikipedia": "NSIkipédia",
    "cpsdisplay": "CPSDisplay"
};

const planetInformationDiv = document.createElement("div");
planetInformationDiv.style.position = "absolute";        
document.body.appendChild(planetInformationDiv);

const planetHitBoxs = document.getElementsByClassName("planet_hitbox");
var planetNames = {}

for (const planetHitbox of planetHitBoxs) {
    planet = planetHitbox.parentElement;
    planetNames[planetHitbox.id] = document.createElement("div");
    
    planetName = planetNames[planetHitbox.id];
    planetName.innerText = planetDisplayNames[planet.id];
    planetName.style.position = "absolute";
    planetName.classList.add("planet_name");

    setInterval(() => {followPlanet(planetHitbox);}, 0.05);
    document.body.appendChild(planetName);
}

function followPlanet(planetHitbox) {
    var planet = planetHitbox.parentElement;
    var element = planetNames[planetHitbox.id];
    var boudingPlanetRect = planetHitbox.getBoundingClientRect();
    var parentBoudingPlanetRect = planet.getBoundingClientRect();
    element.style.left = `${boudingPlanetRect.left}px`;
    element.style.top = `${boudingPlanetRect.top + boudingPlanetRect.height}px`;
    element.style.width = `${boudingPlanetRect.width}px`;
}