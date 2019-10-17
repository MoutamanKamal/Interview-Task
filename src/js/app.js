window.onload = wave('canvas', '.plane');

function openMenu() {
  //   TweenMax.to(".menu", 1, { marginLeft: 0 });
  TweenMax.to("#menu-canvas", 1, {
	left: 0
  });
  TweenMax.to(".menu", 1, {
	left: 0
  });
  wave('menu-canvas', '.menu-plane');
}

function closeMenu() {
	TweenMax.to(".menu", 1, {
		left: "-100vw"
	});
	//TweenMax.to(".close-menu", 1, { left: "-100vw" });

	TweenMax.to("#menu-canvas", 1, {
		left: "-100vw"
	});
}


function wave(canvas, targetPlane) {
	console.log('wave');

	// track the mouse positions to send it to the shaders
	let mousePosition = {
		x: 0,
		y: 0
	};
	
	// pass the id of the div that will wrap the canvas to set up the WebGL context and append the canvas to the wrapper
	let webGLCurtain = new Curtains(canvas);
	// get the plane element
	let planeElement = document.querySelector(targetPlane);
	// set the initial parameters (basic uniforms)
	let params = {
		vertexShaderID: "plane-vs",
		// the vertex shader ID
		fragmentShaderID: "plane-fs",
		// the framgent shader ID
		widthSegments: 20,
		heightSegments: 20,
		// we now have 20*20*6 = 2400 vertices !
		uniforms: {
		time: {
			name: "uTime",
			// uniform name that will be passed to the shaders
			type: "1f",
			// uniform is a float
			value: 0
		},
		mousePosition: {
			// the mouse position
			name: "uMousePosition",
			type: "2f",
			// notice this is a length 2 array of floats
			value: [mousePosition.x, mousePosition.y]
		},
		mouseStrength: {
			// the strength of the effect (we will attenuate it if the mouse stops moving)
			name: "uMouseStrength",
			// uniform name that will be passed to the shaders
			type: "1f",
			// uniform is a float
			value: 0
		}
		}
	};

	// create the plane mesh
	let plane = webGLCurtain.addPlane(planeElement, params);

	// if the plane has been successfully created we could start listening to mouse/touch events and update its uniforms
	plane && plane.onReady(function () {
		// set a field of view of 35 to exaggerate perspective
		plane.setPerspective(35);
		// listen the mouse/touch events on the whole document
		// pass the plane as second argument of the function
		document.body.addEventListener("mousemove", function (e) {
		handleMovement(e, plane);
		});
		document.body.addEventListener("touchmove", function (e) {
		handleMovement(e, plane);
		});
	}).onRender(function () {
		// update the time uniform value
		plane.uniforms.time.value++; // continually decrease mouse strength

		plane.uniforms.mouseStrength.value = Math.max(0, plane.uniforms.mouseStrength.value - 0.0075);
	});

	// handle the mouse move event
	function handleMovement(e, plane) {
		// touch event
		if (e.targetTouches) {
		mousePosition.x = e.targetTouches[0].clientX;
		mousePosition.y = e.targetTouches[0].clientY;
		} // mouse event
		else {
			mousePosition.x = e.clientX;
			mousePosition.y = e.clientY;
		}

		// convert the mouse/touch position to coordinates relative to the vertices of the plane
		let mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
		
		// update the mouse position uniform
		plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];
		
		// reassign mouse strength
		plane.uniforms.mouseStrength.value = 0.7;
	}
}
