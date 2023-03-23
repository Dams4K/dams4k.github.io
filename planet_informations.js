const planetInformationDiv = document.createElement("div");
planetInformationDiv.style.position = "absolute";        
document.body.appendChild(planetInformationDiv);

const planets = document.getElementsByClassName("planet_hitbox");
var planetNames = {}

for (const planet of planets) {
    planetNames[planet.id] = document.createElement("div");
    
    planetName = planetNames[planet.id];
    planetName.innerText = "TEXT";
    planetName.style.position = "absolute";
    planetName.classList.add("planet_name");

    setInterval(() => {followPlanet(planet);}, 0.05);
    document.body.appendChild(planetName);
    

    // planet.addEventListener("mouseover", (event) => {
    //     planetInformationDiv.innerText = `${event.clientX}, ${event.clientY}`;
    //     followPlanet(planet);
    // });
}

function followPlanet(planet) {
    var element = planetNames[planet.id];
    console.log(element.id);
    var boudingPlanetRect = planet.getBoundingClientRect();
    element.style.left = `${boudingPlanetRect.left}px`;
    element.style.top = `${boudingPlanetRect.top+40}px`;
    element.style.width = `${boudingPlanetRect.width}px`;
}