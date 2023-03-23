const ZOOM_SPEED = 0.1;
let zoom = 1;

document.addEventListener("wheel", function(e) {
    if (e.deltaY < 0) {
        zoom += ZOOM_SPEED;
    } else {
        zoom -= ZOOM_SPEED;
    }
    zoom = clamp(zoom, 0.1, 5);

    document.body.style.transform = `scale(${zoom})`;
});

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}