import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.scene();
const canvas = document.querySelector("#canvas");
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 20, 50);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);

// this should set up the renderer 

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( window.innerWidth, window.innerHeight);

// let's add lighting!

function addingLighting(scene){
    let color = 0xFFFFFF;
    let intensity = 1;
    let light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, -2, -5);
    scene.add(light);
    scene.add(light.target);
}  

addingLighting(scene);

// we need to add a floor for the ball to bounce off of

function addFloor(scene){
    let geometry = new THREE.BoxGeometry(50,1,50);
    let material = new THREE.MeshStandardMaterial({color:0xDDDDD,roughness:0});
    const floor = new THREE.Mesh(geometry, material);
    floor.position.set(0,-10,0);
    floor.name = 'my-floor';
    scene.add(floor);
}
addFloor(scene);

// let's add some balls! or ball in this case

function addSphere(scene){
    let geometry = new THREE.SphereGeometry(5,32,32);
    let material = new THREE.MeshStandardMaterial({color:0x0000ff, roughness:0});
    let sphere = new THREE.Mesh(geometry,material);
    sphere.position.set(0,5,0);
    sphere.name = 'my-sphere';
    scene.add (sphere);
}

addSphere(scene);

let acceleration = 9.8;
let bounce_distance = 9;
let bottom_position_y = -4;
let time_step = 0.02;

// time counter is the time the ball just reached the top position

let time_counter = Math.sqrt(bounce_distance*2/acceleration); // basically the s = (1/2)gt^2 formula 
let initial_speed = acceleration*time_counter; //velocity calculation
let sphere = scene.getObjectByName("my-sphere");

// time to animate the scenes;

const animate = () => {
    requestAnimationFrame(animate);
    // reset the time counter variable back to the start of the bouncing sequence when the sphere hits the through the bottom poistion.
    if (sphere.position.y < bottom_position_y){
        time_counter=0;
    }
    // calculate the sphere position with the s2 = s1 + ut + (1/2) gt*t formula
    // this formula assumes the ball to be bouncing off from the bottom position when time counter is 0
    sphere.position.y = bottom_position_y + initial_speed * time_counter - 0.5 * acceleration * time_counter * time_counter;
    // advance the time
    time_counter += time_step;
    renderer.render(scene,camera);
};
animate();