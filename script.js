

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();


function makeScene () {

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    camera.position.z = 5;
}

makeScene();


const scalerWalls = 0.4;
const dungeonParameters = {
    width: 19,
    height: 13,
    suppressWalls: 6
};


function makeBoundries (){

    var geometry = new THREE.BoxGeometry( scalerWalls, scalerWalls, scalerWalls );
    var material = new THREE.MeshBasicMaterial( { color: 0x708090} );

    for(let j = 1; j <= dungeonParameters.height; j++) {
        let cube = new THREE.Mesh( geometry, material );
        cube.position.y = j * scalerWalls;
        cube.position.x = scalerWalls;
        scene.add( cube );
    }

    for(let j = 1; j <= dungeonParameters.height; j++) {
        let cube = new THREE.Mesh( geometry, material );
        cube.position.x = dungeonParameters.width * scalerWalls;
        cube.position.y = j * scalerWalls;
        scene.add( cube );
    }

    for (let i = 1; i <= dungeonParameters.width; i++) {
        let cube = new THREE.Mesh( geometry, material );
        cube.position.x = i * scalerWalls;
        cube.position.y = scalerWalls;
        scene.add( cube );
    }

    for (let i = 1; i <= dungeonParameters.width; i++) {
        let cube = new THREE.Mesh( geometry, material );
        cube.position.x = i * scalerWalls;
        cube.position.y = dungeonParameters.height * scalerWalls;
        scene.add( cube );
    }


}

makeBoundries();

var insideWalls = [];
function makeInsideWalls () {

    var geometry = new THREE.BoxGeometry( scalerWalls, scalerWalls, scalerWalls );
    var material = new THREE.MeshBasicMaterial( { color: 0x708090 } );

    for (let j = 3; j <= dungeonParameters.height - 2; j++) {
        let r = 0;
        for (let i = 3; i < dungeonParameters.width; i++) {
            if (j % 2 === 1 && i % 2 === 1 && (Math.random()*10) > dungeonParameters.suppressWalls){
                let cube = new THREE.Mesh( geometry, material );
                cube.position.x = i * scalerWalls;
                cube.position.y = j *scalerWalls;
                cube.name = "innerWall";
                scene.add( cube );

                r = Math.floor(Math.random() * 4);
                let cube2 = new THREE.Mesh( geometry, material );

                switch (r) {
                    case 0:
                        cube2.position.x = i * scalerWalls + scalerWalls;
                        cube2.position.y = j*scalerWalls;
                        break;
                    case 1:
                        cube2.position.x = i * scalerWalls;
                        cube2.position.y = j*scalerWalls + scalerWalls;
                        break;
                    case 2:
                        cube2.position.x = i * scalerWalls - scalerWalls;
                        cube2.position.y = j*scalerWalls;
                        break;
                    case 3:
                        cube2.position.x = i * scalerWalls;
                        cube2.position.y = j*scalerWalls - scalerWalls;
                        break;
                    default:
                        alert("error");
                    // code block
                }

                cube.geometry.computeBoundingBox();
                cube2.geometry.computeBoundingBox();

                insideWalls.push(cube);
                insideWalls.push(cube2);
                cube2.name = "innerWall";
                scene.add( cube2 );
            }
        }
    }
}

makeInsideWalls();

function repositioningDungeon () {
    scene.children.forEach(function(element){
        element.position.x += -4;
        element.position.y += -3;

    });
}

repositioningDungeon();

function makePlayer () {
    this.playerSize = 0.1;
    this.geometry = new THREE.BoxGeometry( this.playerSize, this.playerSize, this.playerSize);
    this.material = new THREE.MeshBasicMaterial( { color: 0x222FFFF} );
        this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.y = 1;
    this.cube.position.x = 1;
    this.cube.name = "player";
        scene.add( this.cube );

}

makePlayer();

let player = [];
let playerIndex = 0;
let playerdx = 0.1;
let playerdy = 0.1;

scene.children.forEach(function(element, index) {

    if (element.name === "player") {
        player.push(element);
        playerIndex = index;
    }
});

window.addEventListener("keydown", function(e){

        switch (e.keyCode) {
            case 37:
                scene.children[playerIndex].position.x -= playerdx;
                scene.children[playerIndex].rotation.y += 0.5;
                break;
            case 39:
                scene.children[playerIndex].position.x += playerdx;
                scene.children[playerIndex].rotation.y -= 0.5;
                break;
            case 38:
                scene.children[playerIndex].position.y += playerdy;
                scene.children[playerIndex].rotation.x -= 0.5;
                break;
            case 40:
                scene.children[playerIndex].position.y -= playerdy;
                scene.children[playerIndex].rotation.x += 0.5;
                break;
        }

});

function checkCollisionOutsideWalls () {
    if (scene.children[playerIndex].position.x < -10 * scalerWalls + scalerWalls*2) {
        scene.children[playerIndex].position.x = -10 * scalerWalls  + scalerWalls*2;
    }
    if  (scene.children[playerIndex].position.x > 10 * scalerWalls- scalerWalls*2) {
        scene.children[playerIndex].position.x = 10 * scalerWalls-scalerWalls*2;
    }
    if (scene.children[playerIndex].position.y < -5 * scalerWalls-scalerWalls/2) {
        scene.children[playerIndex].position.y = -5 * scalerWalls-scalerWalls/2;
    }
    if  (scene.children[playerIndex].position.y > 5 * scalerWalls - scalerWalls/2) {
        scene.children[playerIndex].position.y = 5 * scalerWalls - scalerWalls/2;
    }
}

function animate() {
    requestAnimationFrame( animate );

    checkCollisionOutsideWalls();
var playerSize = 0.1;
    scene.children.forEach(function(element) {
            if (element.name !== "player") {
                element.rotation.x += 0.01;
                element.rotation.y += 0.01;
            }
        });

    renderer.render( scene, camera );
}

animate();


