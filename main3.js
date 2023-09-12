import * as THREE from 'three';


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75,                                   // Field of view
    window.innerWidth/window.innerHeight, // Aspect ratio
    0.1,                                  // Near clipping pane
    1000                                  // Far clipping pane
);


camera.position.set(5,5,0);

camera.lookAt(new THREE.Vector3(0,0,0))

var renderer = new THREE.WebGLRenderer({antialias:true})

// Size should be the same as the window
renderer.setSize( window.innerWidth, window.innerHeight );

// Set a near white clear color (default is black)
renderer.setClearColor( 0xeeeeee );

// Append to the document
document.body.appendChild( renderer.domElement );

// Render the scene/camera combination
renderer.render(scene, camera);

// A mesh is created from the geometry and material, then added to the scene
var plane = new THREE.Mesh(
	new THREE.PlaneGeometry( 5, 5, 5, 5 ),
	new THREE.MeshBasicMaterial( { color: 0x222222, wireframe: true } )
);
plane.rotateX(Math.PI/2);
scene.add( plane );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );

var geometry = new THREE.OctahedronGeometry(10,1);
var material = new THREE.MeshStandardMaterial( {
    color: 0xff0051,
    shading: THREE.FlatShading, // default is THREE.SmoothShading
    metalness: 0,
    roughness: 1
} );
var shapeOne = new THREE.Mesh(geometry, material);
shapeOne.position.y += 10;
scene.add(shapeOne);
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add( ambientLight );
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
scene.add( pointLight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
shapeOne.castShadow = true;
shapeOne.receiveShadow = true;
var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
shadowMaterial.opacity = 0.5;


var Decoration = function() {

    // Run the Group constructor with the given arguments
    THREE.Group.apply(this, arguments);

    // A random color assignment
    var colors = ['#ff0051', '#f56762','#a53c6c','#f19fa0','#72bdbf','#47689b'];

    // The main bauble is an Octahedron
    var bauble = new THREE.Mesh(
        addNoise(new THREE.OctahedronGeometry(12,1), 2),
        new THREE.MeshStandardMaterial( {
            color: colors[Math.floor(Math.random()*colors.length)],
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 1
    } )
    );
    bauble.castShadow = true;
    bauble.receiveShadow = true;
    bauble.rotateZ(Math.random()*Math.PI*2);
    bauble.rotateY(Math.random()*Math.PI*2);
    this.add(bauble);

    // A cylinder to represent the top attachment
    var shapeOne = new THREE.Mesh(
        addNoise(new THREE.CylinderGeometry(4, 6, 10, 6, 1), 0.5),
        new THREE.MeshStandardMaterial( {
            color: 0xf8db08,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 1
        } )
    );
    shapeOne.position.y += 8;
    shapeOne.castShadow = true;
    shapeOne.receiveShadow = true;
    this.add(shapeOne);
};
Decoration.prototype = Object.create(THREE.Group.prototype);
Decoration.prototype.constructor = Decoration;

var decoration = new Decoration();
decoration.position.y += 10;
scene.add(decoration);
function addNoise(geometry, noiseX, noiseY, noiseZ) {
    var noiseX = noiseX || 2;
    var noiseY = noiseY || noiseX;
    var noiseZ = noiseZ || noiseY;
    for(var i = 0; i < geometry.vertices.length; i++){
        var v = geometry.vertices[i];
        v.x += -noiseX / 2 + Math.random() * noiseX;
        v.y += -noiseY / 2 + Math.random() * noiseY;
        v.z += -noiseZ / 2 + Math.random() * noiseZ;
    }
    return geometry;
}

function render() {
    // Update camera position based on the controls
    controls.update();

    // Loop through items in the scene and update their position
    for(var d = 0; d < decorations.length; d++) {
        decorations[d].updatePosition();
    }

    // Re-render the scene
    renderer.render(scene, camera);

    // Loop
    requestAnimationFrame(render);
}
