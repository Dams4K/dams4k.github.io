// var canvas = document.createElement("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// document.body.appendChild(canvas)
function onload() {
    var canvas = document.getElementById("star_background");
    var gl = canvas.getContext("webgl", {premultipliedAlpha: true});

    var vertexSource = document.querySelector("#vertex-shader").innerHTML;
    var fragmentSource = document.querySelector("#fragment-shader").innerHTML;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
  
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        return null;
    }
  
    // now compile the fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
  
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    // OK, we have a pair of shaders, we need to put them together
    // into a "shader program" object
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "pos");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  
    // now that we have programs to run on the hardware, we can 
    // make our triangle

    // let's define the vertex positions
    var vertexPos = [
        -1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,

        -1.0,  1.0,  0.0,
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0
    ];
  
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
	var trianglePosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 6;

    
    // this is the "draw scene" function, but since this 
    // is execute once...
  
	// first, let's clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // now we draw the triangle
    // we tell GL what program to use, and what memory block
    // to use for the data, and that the data goes to the pos
    // attribute
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}