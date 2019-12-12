//#region Declaration and Inicializations
//Scene Variables
var scene = new THREE.Scene();
scene.background= new THREE.Color('white');
var aspect =(window.innerWidth) / (window.innerHeight);

//Setting up the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

//Cameras
var camera = new THREE.PerspectiveCamera( 70, aspect, 0.1, 10000 );
var cam = new THREE.PerspectiveCamera(70, aspect, 0.1, 10000)
var actualCam = camera;
camera.position.set(0,25,125);
camera.lookAt(0,0,0);
cam.position.set(15,-10,0);
cam.lookAt(100,-35,0);

//#region Lights

//Scene Lights
var ambientLight  = new THREE.AmbientLight(0xffffff, .3);
var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0xe38800, 0.8); 
hemiLight.position.set(0,1,0)
scene.add(hemiLight)

//Sun
var sunLight = new THREE.PointLight(new THREE.Color('yellow'), 1)
 sunLight.position.set(150,0,-245);
 sunLight.castShadow = true;
 scene.add(sunLight);
 
//Car
var carLights = {
    carlightLeft : new THREE.SpotLight(new THREE.Color('yellow'), 1),
    carlightRight : new THREE.SpotLight(new THREE.Color('yellow'), 1),
    upMostLeft: new THREE.SpotLight(new THREE.Color('white'),.01),
    upMidLeft: new THREE.SpotLight(new THREE.Color('white'), .01),
    upMidRight: new THREE.SpotLight(new THREE.Color('white'), .01),
    upMostRight: new THREE.SpotLight(new THREE.Color('white'), .01),
}
carLights.carlightLeft.position.set(28,-1.8,8.5);
carLights.carlightLeft.angle=degToRad(45);
carLights.carlightLeft.castShadow=true;

carLights.carlightRight.position.set(28,-1.8,-8.5);
carLights.carlightRight.target.position.set(100,-5,0);
carLights.carlightRight.angle=degToRad(45);
carLights.carlightRight.castShadow=true;

carLights.upMostLeft.position.set(5,1,4);
carLights.upMostLeft.angle=degToRad(55);
carLights.upMostLeft.castShadow=true;

carLights.upMidLeft.position.set(5,1,1.5);
carLights.upMidLeft.angle=degToRad(55);
carLights.upMidLeft.castShadow=true;

carLights.upMidRight.position.set(5,1,-1.5);
carLights.upMidRight.angle=degToRad(55);
carLights.upMidRight.castShadow=true;

carLights.upMostRight.position.set(5,1,-4);
carLights.upMostRight.angle=degToRad(55);
carLights.upMostRight.castShadow=true;



scene.add(carLights.carlightLeft);
scene.add(carLights.carlightRight);
scene.add(carLights.upMostLeft);
scene.add(carLights.upMidLeft);
scene.add(carLights.upMidRight);
scene.add(carLights.upMostRight);
//#endregion

//Textures
var texLoader = new THREE.TextureLoader();
var texture = new texLoader.load('textures/road.png')
var moonTex = new texLoader.load('textures/moon.png')
var eggsTex = new texLoader.load('textures/eggs.png')

var dayNnightColors= {
    day:[0,0.7490196078431373,1],
    night:[0,0,0.30196078431372547],
    dawn:[0.6,0.23,0],
    moonDawn:[0.10196078431372547, 0.3333333333333333, .8],
}

//Bezier Sun and Moon Control points
var orbitsBezierPoints={
    east:[300,0,-350],
    west:[-300,0,-350],
    controlPoints:[[37.5,350,-350],[-37.5,350,-350],[-37.5,-350,-350],[37.5,-350,-350]]
}
//Flags
var carLoaded = false;

//Setting the geometries
var geometry = new THREE.BoxGeometry( 10, 10, 10 );
var planeGeo = new THREE.PlaneGeometry(1000,150);
var circleGeo = new THREE.SphereGeometry(8, 32, 32);
var roadMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color('white'),wireframe:false,map:texture});
var egg = new THREE.MeshPhongMaterial({color: new THREE.Color('white'),wireframe:false,map:eggsTex});
var invisibleCircle = new THREE.MeshPhongMaterial({color: new THREE.Color('white'),wireframe:false, emissive: new THREE.Color(.6,.6,.6), map:moonTex});

//Creating Meshes
var cube = new THREE.Mesh( geometry, roadMaterial );
var cube2 = new THREE.Mesh( geometry, roadMaterial );
var cube3 = new THREE.Mesh( geometry, roadMaterial );
var cube4 = new THREE.Mesh( geometry, roadMaterial );
var circle = new THREE.Mesh( circleGeo, invisibleCircle);
var plane = new THREE.Mesh( planeGeo, roadMaterial );
var plane2 = new THREE.Mesh( planeGeo, roadMaterial );
var plane3 = new THREE.Mesh( planeGeo, egg );

//Transforms
plane.rotateX(degToRad(-90))
plane2.rotateX(degToRad(-90))
plane.position.set(0,-25,25);
plane2.position.set(1000,-25,25);
plane3.position.set(300,10,30);
plane3.scale.set(.15,.5,.1);
plane3.rotateY(degToRad(-90))

cube.position.set(50,-25,-7.5);
cube.scale.set(.5, .5, .5);

cube2.position.set(50,-25,7.5)
cube2.scale.set(.5, .5, .5);
cube3.position.set(400, 1, 4);
cube4.position.set(400, 1, -4);
cube.scale.set(1,1,1);
cube.castShadow = true;
cube.flatShading = true;
circle.position.set(45,55,-55);
circle.scale.set(5,5,5);

//Control Variables
var car = 'x';
var carToAnim = {
    frontLeft:'x',
    frontRight:'x',
    backLeft:'x',
    backRight:'x',
    car:'x'
}
var timeOfDay = 10;
var timeOfMountains = 10;
var actualTime=0;
var mountainTime = 0;
var timeOfFrame=0;
var wichAnim = 0;
var skyTime = 0;
var skyAnim = 0;
var lastTime = 1;
var mountain = 'x';
var mountain2 = 'x';
var sbx = "x";

//Additioning objects to scene
var group = new THREE.Group();
scene.add( group );
group.add( cube );
group.add( cube2 );
group.add( cube3 );
group.add( cube4 );
group.add( plane );
group.add( plane2 );
group.add( plane3 );
group.add( circle );
cube.visible=false;
cube2.visible=false;
cube3.visible=false;
cube4.visible=false;
var mountainGroup = new THREE.Group();
var mountainGroup2 = new THREE.Group();
var skyBoxGroup = new THREE.Group()
carLights.carlightLeft.target = cube2;
carLights.carlightRight.target = cube;
carLights.upMostLeft.target = cube3;
carLights.upMidLeft.target = cube3;
carLights.upMostRight.target = cube4;
carLights.upMidRight.target = cube4;

//Variable that adds Models
var objLoader =  new THREE.ObjectLoader();

var songsList = [
    'songs/Rei do Gado.mp3',
    'songs/Esporte Espetacular Theme Song.mp3',
    'songs/Abertura de A Grande Familia.mp3',
    'songs/Proerd.mp3',
    'songs/ABERTURA DO CHAVES 8 BITS.mp3',
    'songs/John Cena - My Time Is Now (8-Bit NES Remix).mp3',
    'songs/DAN DAN GT 8bit.mp3',
    'songs/Dragon Ball Z - We Gotta Power - 8 Bits.mp3',
    'songs/Dragon Ball Z Opening 8 bit.mp3',
    'songs/Evidencias - Chitaozinho e Xororo.mp3',
    'songs/Mas Que Nada - Sergio Mendes.mp3',
    'songs/Seu Jorge - Amiga da minha mulher.mp3',
    'songs/Tim Maia-Dont Want Money.mp3',
]

var audioController = document.getElementById("audioController");
document.getElementById("audioController").setAttribute('src', songsList[0]);
var track = 0;
audioController.addEventListener("ended", function() { 
    track++;
    if(track>=songsList.length)
       track = 0;
    audioController.setAttribute('src',songsList[track]);
    audioController.play();
 }, true);

//#endregion

//#region MainLoop
////
///RENDER
///

function main(){
    skyAnim=1;
    LoadModels();
    SkyBox();
    render();
}

var songBool = false;
var render = function (time) {
   // console.log(audioController.readyState);
    
    time = time*0.0012
    timeOfFrame = time-lastTime;
    if(isNaN(actualTime)){
        actualTime = 0;
    }
    else{
        actualTime  += timeOfFrame;
    }
    if(isNaN(mountainTime)){
        skyTime = 0;
    }
    else{
        skyTime += timeOfFrame;
    }
    // if(sunLight.position.y <0)
    //     hemiLight.position.y=1;
    // else
    //     hemiLight.position.y=-1;
    OrbitCycle();

    if(carLoaded){
        CarAnimation(time);
        Carrousel();

    }
    renderer.render( scene, actualCam );
    lastTime=time
    requestAnimationFrame( render );
};
  
main();
//render();
//#endregion


//#region Functions

function freeFunc() {
    if(actualCam.uuid == camera.uuid)
        actualCam= cam;
    else{
        actualCam = camera;
    }
}


function LoadModels(){
    scene.add(mountainGroup);
    scene.add(mountainGroup2);

    //Load Car
    var mtlLoader = new THREE.MaterialLoader();
    objLoader.load('models/Jeep_done.json', function(object){
        object.material = new THREE.MeshPhongMaterial({color: new THREE.Color('red'), map:roadMaterial});
        object.position.x = 0;
        object.position.y = -20;
        object.position.z = 0;
        object.scale.set(0.1,0.1,0.1);
        object.castShadow = true;
        object.receiveShadow = true;
        object.name = "Car";
        car = object;

        PaintCar(car.children)
        
        carToAnim.frontRight = object.children[20];
        carToAnim.frontLeft = object.children[17];
        carToAnim.backLeft = object.children[18];
        carToAnim.backRight = object.children[7];
        carToAnim.car = object.children[19];
        carOriginalPos =carToAnim.car.position;
        carLoaded= true;
        scene.add(object);});
    //Load Mountains
        objLoader.load('models/lowpolymountains.json', function(object){
            object.material = new THREE.MeshPhongMaterial();
            object.position.set(0,-50,-200);
            object.scale.set(50,50,20);
            object.castShadow = true;
            object.receiveShadow = true;
            object.children[0].visible = false;
            mountainGroup.add(object);
        });
        objLoader.load('models/lowpolymountains.json', function(object){
            object.material = new THREE.MeshPhongMaterial();
            object.position.set(750,-50,-185);
            object.scale.set(50,50,20);
            object.castShadow = true;
            object.receiveShadow = true;
            object.children[0].visible = false;
            mountainGroup.add(object);
        });
        objLoader.load('models/lowpolymountains.json', function(object){
            object.material = new THREE.MeshPhongMaterial();
            object.position.set(1500,-50,-200);
            object.scale.set(50,50,20);
            object.castShadow = true;
            object.receiveShadow = true;
            object.children[0].visible = false;
            mountainGroup2.add(object);
        });
        objLoader.load('models/lowpolymountains.json', function(object){
            object.material = new THREE.MeshPhongMaterial();
            object.position.set(2250,-50,-185);
            object.scale.set(50,50,20);
            object.castShadow = true;
            object.receiveShadow = true;
            object.children[0].visible = false;
            mountainGroup2.add(object);
        });
}

function SkyBox(){
   var skyboxGeometry = new THREE.CubeGeometry(10000,10000,10000);
   var cubeMaterials = [
       new THREE.MeshBasicMaterial({color: 	0x00004d, side: THREE.DoubleSide}),
       new THREE.MeshBasicMaterial({color: 	0x00004d, side: THREE.DoubleSide}),
       new THREE.MeshBasicMaterial({color: 0x00004d, side: THREE.DoubleSide}),
       new THREE.MeshBasicMaterial({color: 0x00004d, side: THREE.DoubleSide}),
       new THREE.MeshBasicMaterial({color: 0x00004d, side: THREE.DoubleSide}),
       new THREE.MeshBasicMaterial({color: 0x00004d, side: THREE.DoubleSide}),
   ];
   var skyBoxMaterial = new THREE.MeshFaceMaterial (cubeMaterials);
   var skybox = new THREE.Mesh(skyboxGeometry,skyBoxMaterial);
   sbx = skybox;
   scene.add(skybox);
}


function CarAnimation(time){
    carToAnim.frontRight.rotateOnAxis(new THREE.Quaternion(0,0,1,0),50)
    carToAnim.backLeft.rotateOnAxis(new THREE.Quaternion(0,0,1,0),-50)
    carToAnim.frontLeft.rotateOnAxis(new THREE.Quaternion(0,0,1,0),-50)
    carToAnim.backRight.rotateOnAxis(new THREE.Quaternion(0,0,1,0),50)
    if(time%2 > 0 && time%2 < 0.1){
        carToAnim.frontRight.position.set(carToAnim.frontRight.position.x,carToAnim.frontRight.position.y+.5,carToAnim.frontRight.position.z)
        carToAnim.backLeft.position.set(carToAnim.backLeft.position.x,carToAnim.backLeft.position.y+.5,carToAnim.backLeft.position.z)
        carToAnim.frontLeft.position.set(carToAnim.frontLeft.position.x,carToAnim.frontLeft.position.y+.5,carToAnim.frontLeft.position.z)
        carToAnim.backRight.position.set(carToAnim.backRight.position.x,carToAnim.backRight.position.y+.5,carToAnim.backRight.position.z)
        carToAnim.car.position.set(0,carToAnim.car.position.y-.5,0);
    }
    else{
        carToAnim.car.position.set(0,0,0);
        carToAnim.frontRight.position.set(carToAnim.frontRight.position.x,0,carToAnim.frontRight.position.z)
        carToAnim.backLeft.position.set(carToAnim.backLeft.position.x,0,carToAnim.backLeft.position.z)
        carToAnim.frontLeft.position.set(carToAnim.frontLeft.position.x,0,carToAnim.frontLeft.position.z)
        carToAnim.backRight.position.set(carToAnim.backRight.position.x,0,carToAnim.backRight.position.z)
    }
    if(sunLight.position.y > 0){
        carLights.carlightLeft.visible = false;
        carLights.carlightRight.visible = false;
        carLights.upMostLeft.visible = false;
        carLights.upMidLeft.visible = false;
        carLights.upMostRight.visible = false;
        carLights.upMidRight.visible = false;
    }
    else{
        carLights.carlightLeft.visible = true;
        carLights.carlightRight.visible = true;
        carLights.upMostLeft.visible = true;
        carLights.upMidLeft.visible = true;
        carLights.upMostRight.visible = true;
        carLights.upMidRight.visible = true;
    }
}
function degToRad(angle){
    return angle*0.0174;
}
function Lerp(p1,p2,t){
    let a = (1-t);
    let b = a*p1;
    let c = t*p2;
    let d = b+c ;
    return d;
}
function Bezier(p1,p2,c1,c2,t){
    var final = [];
    for (var i = 0;i<3;i++){
      var ponto1 = p1;
      var ponto2 = p2;
      var controle1 = c1;
      var controle2 = c2;
      var tempo = t;
      var pt1 = Math.pow((1-tempo),3);
      var pt2 = 3*tempo;
      var pt3 = Math.pow(1-tempo,2);
      var pt4 = (1-tempo)*controle2[i];
      var pt5 = Math.pow (tempo,3);
      
      
      var pt6 = pt1 * ponto1[i];
      var pt7 = pt2 * pt3 * controle1[i]
      var pt8 = 3 *  Math.pow(tempo,2) * pt4;
      var pt9 = pt5  * ponto2[i];
      
      var x = pt6 + pt7;
      var y = pt8 + pt9;
      var z = x + y;
      final[i] = z;
    }
 //   console.log(final)

    return final;
}
function OrbitCycle(){
    circle.rotateY(degToRad(1/timeOfDay));
    circle.rotateX(degToRad(1/timeOfDay));
    circle.rotateZ(degToRad(1/timeOfDay));
        //hemiLight.position.y = 1
   // hemiLight.position.y = -1
    if(actualTime<timeOfDay){
        switch (wichAnim)
        {
            case 0:
                {
                    let bz = Bezier(orbitsBezierPoints.east,orbitsBezierPoints.west,orbitsBezierPoints.controlPoints[0],orbitsBezierPoints.controlPoints[1],actualTime/timeOfDay);
                    sunLight.position.set(bz[0],bz[1],bz[2]);
                    circle.position.set(-bz[0],-bz[1],bz[2]);
                    break;
                }
            case 1:
                {
                    let bz =(Bezier(orbitsBezierPoints.west,orbitsBezierPoints.east,orbitsBezierPoints.controlPoints[2],orbitsBezierPoints.controlPoints[3],actualTime/timeOfDay));
                    sunLight.position.set(bz[0],bz[1],bz[2]);
                    circle.position.set(-bz[0],-bz[1],bz[2]);
                   // hemiLight.position.set(Lerp(0,10,actualTime/timeOfDay),Lerp(0,10,actualTime/timeOfDay),Lerp(0,10,actualTime/timeOfDay));
                    break;
                }
        }
    }   
    else{
        wichAnim++;
        wichAnim =wichAnim%2;
       actualTime = 0;
    }
    if(skyTime<timeOfDay/2){
        switch (skyAnim){
            case 0:{
                sbx.material.forEach(element => {
                      element.color.set (new THREE.Color(Lerp(dayNnightColors.day[0],dayNnightColors.dawn[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.day[1],dayNnightColors.dawn[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.day[2],dayNnightColors.dawn[2],skyTime/(timeOfDay/2)))
                                                        )                                    
                });
                hemiLight.position.set(Lerp(-1000,0,actualTime/timeOfDay),Lerp(0,-1000,skyTime/(timeOfDay/2)),0)

                break;
            }
            case 1:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.dawn[0],dayNnightColors.night[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[1],dayNnightColors.night[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[2],dayNnightColors.night[2],skyTime/(timeOfDay/2)))
                                                        )
                });
                hemiLight.position.set(Lerp(0,1000,actualTime/timeOfDay),Lerp(-1000,0,skyTime/(timeOfDay/2)),0)
                break;
            }
            case 2:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.night[0],dayNnightColors.moonDawn[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.night[1],dayNnightColors.moonDawn[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.night[2],dayNnightColors.moonDawn[2],skyTime/(timeOfDay/2)))
                                                        )
                });
                hemiLight.position.set(Lerp(1000,0,actualTime/timeOfDay),Lerp(0,1000,skyTime/(timeOfDay/2)),0)

                break;
            }
            case 3:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.moonDawn[0],dayNnightColors.day[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.moonDawn[1],dayNnightColors.day[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.moonDawn[2],dayNnightColors.day[2],skyTime/(timeOfDay/2)))
                                                        )
                });
                hemiLight.position.set(Lerp(0,-1000,actualTime/timeOfDay),Lerp(1000,0,skyTime/(timeOfDay/2)),0)

                break;
            }
        }

    }
    else{
        skyAnim++;
        skyAnim = skyAnim%4;
        skyTime=0;
    }
}
var mtn1= false;
var mtn2= false;
function Carrousel(){
    
    if(mountainGroup.position.x<= -1600)
    {
        mountainGroup.position.x = 1600;
    }
    if(mountainGroup2.position.x<= -3200){
        mountainGroup2.position.x = 0;
    }
    if(plane.position.x<=-900)
    {
        plane.position.x=1000;
    }
    if(plane2.position.x<=-900){

        plane2.position.x=1000
    }
    mountainGroup.position.x-= 4;
    mountainGroup2.position.x-= 4;
    plane.position.x-=8; 
    plane2.position.x-=8; 
}

function PaintCar(carPieces){
    console.log(carPieces);
    // 7,17,18,20(1 e 2) roda direita trás
    // 19 (0 a 9)
    carPieces[19].material.forEach(element => {
        element.emissive.set(0x252525);
    });
    carPieces[19].material[0].emissive.set(0x000000);
    carPieces[19].material[1].emissive.set(0x000000);
    // carPieces[19].material= new THREE.MeshPhongMaterial({color: new THREE.Color('red')});
    // carPieces[19].scale.set(100,100,100);
}

function NextSong(){
    track++;
    if(track>=songsList.length)
       track = 0;
    audioController.setAttribute('src',songsList[track]);
    audioController.play();
}
function PreviousSong(){
    track--;
    if(track<0)
       track = 0;
    audioController.setAttribute('src',songsList[track]);
    audioController.play();
}
function RandomSound(){
    track = Math.floor(Math.random()*13)
    if(track<0 || track >= 13)
        track = 0;
    audioController.setAttribute('src',songsList[track]);
    audioController.play();
}
//#endregion