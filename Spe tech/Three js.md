========================
CODE SNIPPETS
========================
TITLE: Start Vite Development Server
DESCRIPTION: Command to start the Vite development server. This command serves your application locally, allowing you to see changes in real-time.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/installation.html#_snippet_4

LANGUAGE: bash
CODE:
```
npx vite
```

----------------------------------------

TITLE: Start Local Server with Serve
DESCRIPTION: Command to start a local HTTP server using the 'serve' package, which is recommended for hosting project files. This ensures features work correctly, as opening HTML files directly can cause security-related issues.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/installation.html#_snippet_7

LANGUAGE: shell
CODE:
```
npx serve .
```

----------------------------------------

TITLE: Common Command Line Local Servers
DESCRIPTION: A list of commands to start local HTTP servers using various programming languages. These are useful for serving static files during development.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/installation.html#_snippet_8

LANGUAGE: shell
CODE:
```
# Node.js
npx http-server
npx five-server
```

LANGUAGE: shell
CODE:
```
# Python 2.x
python -m SimpleHTTPServer
```

LANGUAGE: shell
CODE:
```
# Python 3.x
python -m http.server
```

LANGUAGE: shell
CODE:
```
# PHP 5.4+
php -S localhost:8000
```

----------------------------------------

TITLE: Install Project Dependencies
DESCRIPTION: Installs all necessary project dependencies using npm. This command should be executed from the root folder of the project.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/test/unit/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
npm install
```

----------------------------------------

TITLE: Serve Project Files for Browser Testing
DESCRIPTION: Starts a local web server using servez to host project files, typically for browser-based testing. Access the tests via a web browser at the specified address.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/test/unit/README.md#_snippet_2

LANGUAGE: shell
CODE:
```
npx servez -p 8080 --ssl
```

----------------------------------------

TITLE: Three.js WebGPU Setup and Initialization
DESCRIPTION: Initializes the three.js scene, camera, WebGPU renderer, OrbitControls, and Stats. It sets up the rendering loop and handles window resizing. This snippet includes the core setup for the WebGPU example.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_performance_renderbundle.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const aspect = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera( 70, aspect, 1, 100 );
camera.position.z = 50;

// renderer
renderer = new THREE.WebGPURenderer( { antialias: true, forceWebGL } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

// scene
scene = new THREE.Scene();
scene.background = new THREE.Color( 0xc1c1c1 );
const light = new THREE.DirectionalLight( 0xffffff, 3.4 );
scene.add( light );
document.body.appendChild( renderer.domElement );
await renderer.init();

initGeometries();
initMesh( count );

controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// stats
stats = new Stats( {
  precision: 3,
  horizontal: false,
  trackGPU: true,
} );
stats.init( renderer );
document.body.appendChild( stats.dom );
stats.dom.style.position = 'absolute';

// gui
gui = new GUI();
gui.add( api, 'renderBundle' ).onChange( () => {
  init( ! api.webgpu );
} );
gui.add( api, 'webgpu' ).onChange( () => {
  init( ! api.webgpu );
} );
gui.add( api, 'dynamic' ).onChange( () => {
  group.static = ! group.static;
} );

// listeners
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
}
```

----------------------------------------

TITLE: Three.js WebGPU Ocean Setup and Animation
DESCRIPTION: This snippet covers the core initialization, scene setup, animation loop, and rendering logic for the WebGPU ocean example in three.js. It includes setting up the renderer, camera, scene, water, sky, and handling window resizing and animation updates.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_ocean.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const imports = { "three": "../build/three.webgpu.js", "three/webgpu": "../build/three.webgpu.js", "three/tsl": "../build/three.tsl.js", "three/addons/": "./jsm/" };

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WaterMesh } from 'three/addons/objects/WaterMesh.js';
import { SkyMesh } from 'three/addons/objects/SkyMesh.js';

let container, stats;
let camera, scene, renderer;
let controls, water, sun, mesh;

init();

function init() {

    container = document.getElementById( 'container' );

    // Renderer setup
    renderer = new THREE.WebGPURenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild( renderer.domElement );

    // Scene and Camera setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );

    // Sun vector
    sun = new THREE.Vector3();

    // Water setup
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
    const loader = new THREE.TextureLoader();
    const waterNormals = loader.load( 'textures/waternormals.jpg' );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    water = new WaterMesh( waterGeometry, {
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7
    } );

    water.rotation.x = - Math.PI / 2;
    scene.add( water );

    // Skybox setup
    const sky = new SkyMesh();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    sky.turbidity.value = 10;
    sky.rayleigh.value = 2;
    sky.mieCoefficient.value = 0.005;
    sky.mieDirectionalG.value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const sceneEnv = new THREE.Scene();
    let renderTarget;

    function updateSun() {
        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.sunPosition.value.copy( sun );
        water.sunDirection.value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();
        sceneEnv.add( sky );
        renderTarget = pmremGenerator.fromScene( sceneEnv );

        scene.add( sky );
        scene.environment = renderTarget.texture;
    }

    renderer.init().then( updateSun );

    // Example mesh (commented out in original, but present)
    // const geometry = new THREE.BoxGeometry( 30, 30, 30 );
    const material = new THREE.MeshStandardMaterial( { roughness: 0 } );
    mesh = new THREE.Mesh( new THREE.BoxGeometry( 30, 30, 30 ), material );
    scene.add( mesh );

    // Controls setup
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    // Stats setup
    stats = new Stats();
    container.appendChild( stats.dom );

    // GUI setup
    const gui = new GUI();

    const folderSky = gui.addFolder( 'Sky' );
    folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
    folderSky.open();

    const folderWater = gui.addFolder( 'Water' );
    folderWater.add( water.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    folderWater.add( water.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
    folderWater.open();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    render();
    stats.update();

}

function render() {

    const time = performance.now() * 0.001;

    mesh.position.y = Math.sin( time ) * 20 + 5;
    mesh.rotation.x = time * 0.5;
    mesh.rotation.z = time * 0.51;

    renderer.render( scene, camera );

}
```

----------------------------------------

TITLE: Install and Use Servez CLI
DESCRIPTION: Installs the 'servez' command-line tool globally using npm and demonstrates how to start a web server in the current directory or a specified path. This is a common method for serving static files for web development.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/setup.html#_snippet_0

LANGUAGE: bash
CODE:
```
npm -g install servez

# Or on OSX with sudo:
sudo npm -g install servez

# Serve current folder:
servez

# Serve a specific folder:
servez path/to/folder/where/you/unzipped/files
```

----------------------------------------

TITLE: HTML Link to Example
DESCRIPTION: Provides a link to view the example in a separate window, allowing users to interact with the live demonstration.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/cleanup.html#_snippet_10

LANGUAGE: html
CODE:
```
<a href="/manual/examples/cleanup-loaded-files.html">click here to open in a separate window</a>
```

----------------------------------------

TITLE: Install Three.js and Vite via NPM
DESCRIPTION: Commands to install the three.js library and Vite, a build tool, using npm. These are essential steps for setting up a local development environment.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/installation.html#_snippet_2

LANGUAGE: bash
CODE:
```
npm install --save three

# vite
npm install --save-dev vite
```

----------------------------------------

TITLE: Three.js WebGPU Mirror Setup
DESCRIPTION: Initializes the three.js scene, camera, and renderer for the WebGPU mirror example. It sets up the basic scene structure and camera positioning.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_mirror.html#_snippet_0

LANGUAGE: javascript
CODE:
```
import * as THREE from 'three';
import { reflector, uv, texture, color } from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let cameraControls;
let sphereGroup, smallSphere;

init();

function init() {

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 75, 160 );

    // let geometry, material;

    // sphereGroup = new THREE.Object3D();
    // scene.add( sphereGroup );

    // ... rest of the init function for objects, lights, renderer ...
```

----------------------------------------

TITLE: Three.js WebXR Basic Setup and Rendering
DESCRIPTION: This snippet demonstrates the core Three.js setup for a 3D scene. It includes initializing the renderer, camera, scene, adding lighting, creating geometry (cubes), applying materials, and setting up an animation loop. It also handles dynamic resizing of the renderer to match the display size.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/examples/webxr-basic-vr-optional.html#_snippet_0

LANGUAGE: javascript
CODE:
```
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 1.6, 0 );

    const params = ( new URL( document.location ) ).searchParams;
    const allowvr = params.get( 'allowvr' ) === 'true';

    if ( allowvr ) {
        renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( renderer ) );
        document.querySelector( '#vr' ).style.display = 'none';
    } else {
        // no VR, add some controls
        const controls = new OrbitControls( camera, canvas );
        controls.target.set( 0, 1.6, - 2 );
        controls.update();
        document.querySelector( '#nonvr' ).style.display = 'none';
    }

    const scene = new THREE.Scene();

    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'resources/images/grid-1024.png',
            'resources/images/grid-1024.png',
            'resources/images/grid-1024.png',
            'resources/images/grid-1024.png',
            'resources/images/grid-1024.png',
            'resources/images/grid-1024.png',
        ]);
        scene.background = texture;
    }

    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        scene.add( light );
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

    function makeInstance( geometry, color, x ) {
        const material = new THREE.MeshPhongMaterial( { color } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        cube.position.x = x;
        cube.position.y = 1.6;
        cube.position.z = - 2;
        return cube;
    }

    const cubes = [
        makeInstance( geometry, 0x44aa88, 0 ),
        makeInstance( geometry, 0x8844aa, - 2 ),
        makeInstance( geometry, 0xaa8844, 2 ),
    ];

    function resizeRendererToDisplaySize( renderer ) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {
            renderer.setSize( width, height, false );
        }
        return needResize;
    }

    function render( time ) {
        time *= 0.001;
        if ( resizeRendererToDisplaySize( renderer ) ) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach( ( cube, ndx ) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( render );
}

main();
```

----------------------------------------

TITLE: CCDIKSolver Browser Example Setup
DESCRIPTION: This snippet details the full JavaScript code required to run the CCDIKSolver browser example in Three.js. It includes scene initialization, geometry and bone creation, mesh binding, skeleton helper setup, and integration with lil-gui for interactive control of the IK solver and bone positions. Dependencies are imported from Three.js modules.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/docs/scenes/ccdiksolver-browser.html#_snippet_0

LANGUAGE: javascript
CODE:
```
// Configuration for module imports
// { "imports": { "three": "../../build/three.module.js", "three/addons/": "../../examples/jsm/" } }

// Import necessary Three.js modules and addons
import { Bone, Color, CylinderGeometry, DoubleSide, Float32BufferAttribute, MeshPhongMaterial, PerspectiveCamera, Scene, SkinnedMesh, Skeleton, SkeletonHelper, Vector3, Uint16BufferAttribute, WebGLRenderer } from 'three';
import { CCDIKSolver, CCDIKHelper } from 'three/addons/animation/CCDIKSolver.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global variables for scene elements
let gui, scene, camera, renderer, orbit, mesh, bones, skeletonHelper, ikSolver;

// State object for GUI controls
const state = { ikSolverAutoUpdate: true };

// Function to initialize the Three.js scene
function initScene() {
    gui = new GUI();
    scene = new Scene();
    scene.background = new Color( 0x444444 );

    // Camera setup
    camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 200 );
    camera.position.z = 30;
    camera.position.y = 30;

    // Renderer setup
    renderer = new WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Orbit controls for camera manipulation
    orbit = new OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    // Handle window resizing
    window.addEventListener( 'resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    initBones(); // Initialize bones and mesh
    setupDatGui(); // Setup GUI controls
}

// Function to create the geometry for the mesh
function createGeometry( sizing ) {
    const geometry = new CylinderGeometry(
        5, // radiusTop
        5, // radiusBottom
        sizing.height, // height
        8, // radiusSegments
        sizing.segmentCount * 1, // heightSegments
        true // openEnded
    );

    const position = geometry.attributes.position;
    const vertex = new Vector3();
    const skinIndices = [];
    const skinWeights = [];

    // Assign skin indices and weights based on vertex position
    for ( let i = 0; i < position.count; i ++ ) {
        vertex.fromBufferAttribute( position, i );
        const y = ( vertex.y + sizing.halfHeight );
        const skinIndex = Math.floor( y / sizing.segmentHeight );
        const skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;
        skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
        skinWeights.push( 1 - skinWeight, skinWeight, 0, 0 );
    }

    geometry.setAttribute( 'skinIndex', new Uint16BufferAttribute( skinIndices, 4 ) );
    geometry.setAttribute( 'skinWeight', new Float32BufferAttribute( skinWeights, 4 ) );

    return geometry;
}

// Function to create the skeletal structure (bones)
function createBones( sizing ) {
    bones = [];
    // "root bone"
    const rootBone = new Bone();
    rootBone.name = 'root';
    rootBone.position.y = - sizing.halfHeight;
    bones.push( rootBone );

    // "bone0", "bone1", "bone2", "bone3"
    // "bone0"
    let prevBone = new Bone();
    prevBone.position.y = 0;
    rootBone.add( prevBone );
    bones.push( prevBone );

    // "bone1", "bone2", "bone3"
    for ( let i = 1; i <= sizing.segmentCount; i ++ ) {
        const bone = new Bone();
        bone.position.y = sizing.segmentHeight;
        bones.push( bone );
        bone.name = `bone${i}`;
        prevBone.add( bone );
        prevBone = bone;
    }

    // "target" bone for IK control
    const targetBone = new Bone();
    targetBone.name = 'target';
    targetBone.position.y = sizing.height + sizing.segmentHeight; // relative to parent: rootBone
    rootBone.add( targetBone );
    bones.push( targetBone );

    return bones;
}

// Function to create the skinned mesh and skeleton helper
function createMesh( geometry, bones ) {
    const material = new MeshPhongMaterial( {
        color: 0x156289,
        emissive: 0x072534,
        side: DoubleSide,
        flatShading: true,
        wireframe: true
    } );

    const mesh = new SkinnedMesh( geometry, material );
    const skeleton = new Skeleton( bones );
    mesh.add( bones[ 0 ] ); // Add root bone to mesh
    mesh.bind( skeleton ); // Bind skeleton to mesh

    // Skeleton helper for visualization
    skeletonHelper = new SkeletonHelper( mesh );
    skeletonHelper.material.linewidth = 2;
    scene.add( skeletonHelper );

    return mesh;
}

// Function to set up the dat.GUI controls
function setupDatGui() {
    // Add a button to call mesh.pose()
    gui.add( mesh, 'pose' ).name( 'mesh.pose()' );

    // Add controls for the 'target' bone's position
    mesh.skeleton.bones
        .filter( ( bone ) => bone.name === 'target' )
        .forEach( function ( bone ) {
            const folder = gui.addFolder( bone.name );
            const delta = 20;
            folder.add( bone.position, 'x', - delta + bone.position.x, delta + bone.position.x );
            folder.add( bone.position, 'y', - bone.position.y, bone.position.y );
            folder.add( bone.position, 'z', - delta + bone.position.z, delta + bone.position.z );
        } );

    // Add control for IK solver update
    gui.add( ikSolver, 'update' ).name( 'ikSolver.update()' );
    gui.add( state, 'ikSolverAutoUpdate' );
}

// Function to initialize bones and create the mesh
function initBones() {
    const segmentHeight = 8;
    const segmentCount = 3;
    const height = segmentHeight * segmentCount;
    const halfHeight = height * 0.5;
    const sizing = { segmentHeight, segmentCount, height, halfHeight };

    const geometry = createGeometry( sizing );
    const bones = createBones( sizing );
    mesh = createMesh( geometry, bones );
    scene.add( mesh );

    // Initialize CCDIKSolver
    const iks = [
        {
            target: 5, // Index of the target bone
            effector: 4, // Index of the effector bone
            links: [
                { index: 3 },
                { index: 2 },
                { index: 1 }
            ]
        }
    ];
    ikSolver = new CCDIKSolver( mesh, iks );
    scene.add( new CCDIKHelper( ikSolver ) ); // Add IK helper for visualization
}

// Initial call to start the scene setup
initScene();

// Animation loop (not explicitly defined in the provided snippet, but implied for a Three.js app)
// function animate() {
//     requestAnimationFrame( animate );
//     if (state.ikSolverAutoUpdate) {
//         ikSolver.update();
//     }
//     orbit.update();
//     renderer.render( scene, camera );
// }
// animate();

```

----------------------------------------

TITLE: Three.js Main Scene Setup and Render Loop
DESCRIPTION: This snippet outlines the core setup for a Three.js application, including initializing the renderer, camera, and scene. It also contains the main animation loop that handles rendering frames, updating object transformations, and managing renderer resizing, driven by `requestAnimationFrame`.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/examples/fog-gui.html#_snippet_3

LANGUAGE: javascript
CODE:
```
function main() {
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    const gui = new GUI();
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 2;
    const scene = new THREE.Scene();

    // ... (Fog, Lighting, Cube setup as shown in other snippets)

    function render( time ) {
        time *= 0.001; // convert to seconds

        // ... (Resize and cube animation logic)

        renderer.render( scene, camera );
        requestAnimationFrame( render );
    }

    requestAnimationFrame( render );
}

main();
```

----------------------------------------

TITLE: three.js Raycaster and Helper Setup
DESCRIPTION: This snippet demonstrates initializing a three.js scene, setting up a Raycaster with specific near/far bounds, and integrating the external RaycasterHelper for visualization. It includes scene setup, object creation, raycaster configuration, and an animation loop to update the scene and helper.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/misc_raycaster_helper.html#_snippet_0

LANGUAGE: javascript
CODE:
```
{ "imports": { "three": "../build/three.webgpu.js", "three/webgpu": "../build/three.webgpu.js", "three/tsl": "../build/three.tsl.js", "three/addons/": "./jsm/" } } import * as THREE from 'three'; import { RaycasterHelper } from 'https://cdn.jsdelivr.net/npm/@gsimone/three-raycaster-helper@0.1.0/dist/gsimone-three-raycaster-helper.esm.js'; let scene, renderer; let camera; let capsule1, capsule2, capsule3; let raycaster, raycasterHelper; init(); function init() { renderer = new THREE.WebGPURenderer( { antialias: true } ); renderer.setPixelRatio( window.devicePixelRatio ); renderer.setSize( window.innerWidth, window.innerHeight ); renderer.setAnimationLoop( animate ); document.body.appendChild( renderer.domElement ); // camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ); camera.position.z = 10; scene = new THREE.Scene(); // const geometry = new THREE.CapsuleGeometry( 0.5, 0.5, 4, 32 ); const material = new THREE.MeshNormalMaterial(); material.side = THREE.DoubleSide; capsule1 = new THREE.Mesh( geometry, material ); capsule1.position.x = - 2; capsule2 = new THREE.Mesh( geometry, material ); capsule2.position.x = 0; capsule3 = new THREE.Mesh( geometry, material ); capsule3.position.x = 2; scene.add( capsule1 ); scene.add( capsule2 ); scene.add( capsule3 ); raycaster = new THREE.Raycaster( new THREE.Vector3( - 4, 0, 0 ), new THREE.Vector3( 1, 0, 0 ) ); raycaster.near = 1; raycaster.far = 8; raycasterHelper = new RaycasterHelper( raycaster ); scene.add( raycasterHelper ); // window.addEventListener( 'resize', onWindowResize ); } function onWindowResize() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize( window.innerWidth, window.innerHeight ); } function animate( time ) { const elapsedTime = time / 1000; // ms to s [ capsule1, capsule2, capsule3 ].forEach( capsule => { capsule.position.y = Math.sin( elapsedTime * 0.5 + capsule.position.x ); capsule.rotation.z = Math.sin( elapsedTime * 0.5 ) * Math.PI * 1; } ); raycasterHelper.hits = raycaster.intersectObjects( scene.children ); raycasterHelper.update(); renderer.render( scene, camera ); }
```

----------------------------------------

TITLE: three.js Scene and Spotlight Setup
DESCRIPTION: Initializes the WebGL renderer, scene, and camera for a three.js application. It sets up a hemisphere light, loads textures, configures a spotlight with shadow mapping, and adds a plane mesh. The example also includes window resize handling and an animation loop.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_lights_spotlight.html#_snippet_0

LANGUAGE: javascript
CODE:
```
{ "imports": { "three": "../build/three.module.js", "three/addons/": "./jsm/" } }

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer, scene, camera;
let spotLight, lightHelper;

init();

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  document.body.appendChild( renderer.domElement );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set( 7, 4, 1 );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set( 0, 1, 0 );
  controls.update();

  const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 );
  scene.add( ambient );

  const loader = new THREE.TextureLoader().setPath( 'textures/' );
  const filenames = [ 'disturb.jpg', 'colors.png', 'uv_grid_opengl.jpg' ];
  const textures = { none: null };

  for ( let i = 0; i < filenames.length; i ++ ) {
    const filename = filenames[ i ];
    const texture = loader.load( filename );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    textures[ filename ] = texture;
  }

  spotLight = new THREE.SpotLight( 0xffffff, 100 );
  spotLight.position.set( 2.5, 5, 2.5 );
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 0;
  spotLight.map = textures[ 'disturb.jpg' ];

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.focus = 1;

  scene.add( spotLight );

  lightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( lightHelper );

  // const geometry = new THREE.PlaneGeometry( 200, 200 );
  const material = new THREE.MeshLambertMaterial( { color: 0xbcbcbc } );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, - 1, 0 );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  // new PLYLoader().load( 'models/ply/binary/Lucy100k.ply', function ( geometry ) {
  //   geometry.scale( 0.0024, 0.0024, 0.0024 );
  //   geometry.computeVertexNormals();
  //   const material = new THREE.MeshLambertMaterial();
  //   const mesh = new THREE.Mesh( geometry, material );
  //   mesh.rotation.y = - Math.PI / 2;
  //   mesh.position.y = 0.8;
  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;
  //   scene.add( mesh );
  // } );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  const time = performance.now() / 3000;
  spotLight.position.x = Math.cos( time ) * 2.5;
  spotLight.position.z = Math.sin( time ) * 2.5;
  lightHelper.update();
  renderer.render( scene, camera );
}
```

----------------------------------------

TITLE: Start Development Server
DESCRIPTION: Starts a local web server for development, watching source files and automatically rebuilding on changes. Requires Node.js and npm installed.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/__wiki__/Build-instructions.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm start
```

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: CPU Raycasting Example Setup
DESCRIPTION: Example code demonstrating how to set up and use the CPU-based PickHelper for object picking, including event listeners for mouse movement.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/ja/picking.html#_snippet_6

LANGUAGE: javascript
CODE:
```
const pickHelper = new PickHelper();

function render(time) {
  time *= 0.001;  // convert to seconds

  // ... other rendering logic ...

  pickHelper.pick(pickPosition, scene, camera, time);

  renderer.render(scene, camera);

  // ... other rendering logic ...
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('click', () => {
  if (pickHelper.pickedObject) {
    // Handle object click logic
    console.log('Picked object:', pickHelper.pickedObject);
  }
});

// Assume pickPosition and getCanvasRelativePosition are defined elsewhere
// const pickPosition = { x: 0, y: 0 };
// function getCanvasRelativePosition(event) { ... }
```

----------------------------------------

TITLE: HTML: Recommended Three.js ES6 Module Setup
DESCRIPTION: This comprehensive HTML snippet illustrates the recommended approach for integrating Three.js using ES6 modules. It combines both the import map configuration for local paths and the module script for importing core Three.js and specific addons like `OrbitControls`.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/en/fundamentals.html#_snippet_32

LANGUAGE: html
CODE:
```
<script type="importmap">
{
  "imports": {
    "three": "./path/to/three.module.js",
    "three/addons/": "./different/path/to/examples/jsm/"
  }
}
</script>

<script type="module">
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

...

</script>
```

----------------------------------------

TITLE: THREE.Audio Basic Usage Example
DESCRIPTION: This example demonstrates how to create an AudioListener, an Audio object, load an audio file, and configure its playback properties like looping and volume. It shows the basic setup for playing a global sound.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/docs/api/fr/audio/Audio.html#_snippet_0

LANGUAGE: javascript
CODE:
```
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/ambient.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});
```

----------------------------------------

TITLE: Setup GUI for Marching Cubes Simulation (JavaScript)
DESCRIPTION: The `setupGui` function initializes and configures the dat.GUI interface for controlling simulation parameters like material, speed, resolution, and isolation.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_marchingcubes.html#_snippet_5

LANGUAGE: javascript
CODE:
```
function setupGui() {
  const createHandler = function ( id ) {
    return function () {
      current_material = id;
      effect.material = materials[ id ];
      effect.enableUvs = ( current_material === 'textured' ) ? true : false;
      effect.enableColors = ( current_material === 'colors' || current_material === 'multiColors' ) ? true : false;
    };
  };
  effectController = {
    material: 'shiny',
    speed: 1.0,
    numBlobs: 10,
    resolution: 28,
    isolation: 80,
    floor: true,
    wallx: false,
    wallz: false,
    dummy: function() {}
  };
  let h;
  const gui = new GUI();
  // material (type)
  h = gui.addFolder( 'Materials' );
  for ( const m in materials ) {
    effectController[ m ] = createHandler( m );
    h.add( effectController, m ).name( m );
  }
  // simulation
  h = gui.addFolder( 'Simulation' );
  h.add( effectController, 'speed', 0.1, 8.0, 0.05 );
  h.add( effectController, 'numBlobs', 1, 50, 1 );
  h.add( effectController, 'resolution', 14, 100, 1 );
  h.add( effectController, 'isolation', 10, 300, 1 );
  h.add( effectController, 'floor' );
  h.add( effectController, 'wallx' );
  h.add( effectController, 'wallz' );
}
```

----------------------------------------

TITLE: Three.js WebXR Setup and Scene
DESCRIPTION: Initializes the Three.js WebXR renderer, camera, scene, and adds basic lighting and background. It also includes the VRButton for entering the XR session.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/examples/webxr-point-to-select.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
renderer.xr.enabled = true;
document.body.appendChild( VRButton.createButton( renderer ) );

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 0, 1.6, 0 );

const scene = new THREE.Scene();

// object to put pickable objects on so we can easily
// separate them from non-pickable objects
const pickRoot = new THREE.Object3D();
scene.add( pickRoot );

{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load( [
    'resources/images/grid-1024.png',
    'resources/images/grid-1024.png',
    'resources/images/grid-1024.png',
    'resources/images/grid-1024.png',
    'resources/images/grid-1024.png',
    'resources/images/grid-1024.png',
  ] );
  scene.background = texture;
}

{
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight( color, intensity );
  light.position.set( - 1, 2, 4 );
  scene.add( light );
}
```

----------------------------------------

TITLE: Three.js Scene Setup and Animation
DESCRIPTION: Sets up a Three.js WebGL renderer, camera, and scene with directional lighting. It creates and animates three colored cubes. The example includes a function to resize the renderer and a screenshot feature.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/examples/tips-screenshot-good.html#_snippet_0

LANGUAGE: javascript
CODE:
```
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.z = 2;
const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight( color, intensity );
  light.position.set( - 1, 2, 4 );
  scene.add( light );
}
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
function makeInstance( geometry, color, x ) {
  const material = new THREE.MeshPhongMaterial( { color } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.x = x;
  return cube;
}
const cubes = [
  makeInstance( geometry, 0x44aa88, 0 ),
  makeInstance( geometry, 0x8844aa, - 2 ),
  makeInstance( geometry, 0xaa8844, 2 ),
];
function resizeRendererToDisplaySize( renderer ) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if ( needResize ) {
    renderer.setSize( width, height, false );
  }
  return needResize;
}
const state = {
  time: 0,
};
function render() {
  if ( resizeRendererToDisplaySize( renderer ) ) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  cubes.forEach( ( cube, ndx ) => {
    const speed = 1 + ndx * .1;
    const rot = state.time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  } );
  renderer.render( scene, camera );
}
function animate( time ) {
  state.time = time * 0.001;
  render();
  requestAnimationFrame( animate );
}
requestAnimationFrame( animate );
const elem = document.querySelector( '#screenshot' );
elem.addEventListener( 'click', () => {
  render();
  canvas.toBlob( ( blob ) => {
    saveBlob( blob, `screencapture-${canvas.width}x${canvas.height}.png` );
  } );
} );
const saveBlob = ( function () {
  const a = document.createElement( 'a' );
  document.body.appendChild( a );
  a.style.display = 'none';
  return function saveData( blob, fileName ) {
    const url = window.URL.createObjectURL( blob );
    a.href = url;
    a.download = fileName;
    a.click();
  };
}() );
main();
```

----------------------------------------

TITLE: Three.js WebXR Basic Setup and Rendering
DESCRIPTION: Initializes a Three.js WebXR scene with a perspective camera, directional light, and animated cubes. Includes VR button integration and a background texture loader.

SOURCE: https://github.com/mrdoob/three.js/blob/dev/manual/examples/webxr-basic-w-background.html#_snippet_0

LANGUAGE: javascript
CODE:
```
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

function main() {
  const canvas = document.querySelector( '#c' );
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.xr.enabled = true;
  document.body.appendChild( VRButton.createButton( renderer ) );

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 1.6, 0 );

  const scene = new THREE.Scene();

  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load( [
      'resources/images/grid-1024.png',
      'resources/images/grid-1024.png',
      'resources/images/grid-1024.png',
      'resources/images/grid-1024.png',
      'resources/images/grid-1024.png',
      'resources/images/grid-1024.png',
    ] );
    scene.background = texture;
  }

  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    scene.add( light );
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

  function makeInstance( geometry, color, x ) {
    const material = new THREE.MeshPhongMaterial( { color } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.x = x;
    cube.position.y = 1.6;
    cube.position.z = - 2;
    return cube;
  }

  const cubes = [
    makeInstance( geometry, 0x44aa88, 0 ),
    makeInstance( geometry, 0x8844aa, - 2 ),
    makeInstance( geometry, 0xaa8844, 2 ),
  ];

  function resizeRendererToDisplaySize( renderer ) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {
      renderer.setSize( width, height, false );
    }
    return needResize;
  }

  function render( time ) {
    time *= 0.001;

    if ( resizeRendererToDisplaySize( renderer ) ) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach( ( cube, ndx ) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    } );

    renderer.render( scene, camera );
  }

  renderer.setAnimationLoop( render );
}

main();
```