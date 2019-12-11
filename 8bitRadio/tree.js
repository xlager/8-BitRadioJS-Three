//#region Declaration and Inicializations
//Scene Variables
var scene = new THREE.Scene();
scene.background= new THREE.Color('white');
var aspect = window.innerWidth / window.innerHeight;

//Setting up the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

//Cameras
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var cam = new THREE.PerspectiveCamera( 100, aspect, 0.1, 1000 )
var actualCam = camera;
camera.position.set(0,25,150);
camera.lookAt(0,0,0);
cam.position.z = 0;
cam.position.x = 50;
cam.lookAt(0,0,0);

//#region Lights

//Scene Lights
var ambientLight  = new THREE.AmbientLight(0xffffff, .3);
var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0xe38800, 1); 
hemiLight.position.set(0,-1,0)
scene.add(hemiLight)

//Sun
var sunLight = new THREE.PointLight(new THREE.Color('yellow'), 1)
 sunLight.position.set(150,0,-245);
 sunLight.castShadow = true;
 scene.add(sunLight);
 
//Car
var carLights = {
    carlightLeft : new THREE.SpotLight(new THREE.Color('green'), 100),
    carlightRight : new THREE.SpotLight(new THREE.Color('blue'), 100)
}
carLights.carlightLeft.position.set(28,-1.8,8.5);
carLights.carlightLeft.angle=Math.PI/9;
carLights.carlightLeft.castShadow=true;
carLights.carlightRight.position.set(28,-1.8,-8.5);
carLights.carlightRight.target.position.set(100,-5,0);
carLights.carlightRight.angle=Math.PI/9;;
carLights.carlightRight.castShadow=true;
//#endregion

//Textures
var texLoader = new THREE.TextureLoader();
var texture = new texLoader.load('textures/road.png')

var dayNnightColors= {
    day:[0,0.7490196078431373,1],
    night:[0,0,0.30196078431372547],
    dawn:[1,0.6,0]
}

//Bezier Sun and Moon Control points
var orbitsBezierPoints={
    east:[200,0,-235],
    west:[-200,0,-235],
    controlPoints:[[37.5,250,-235],[-37.5,250,-235],[-37.5,-250,-235],[37.5,-250,-235]]
}
//Flags
var carLoaded = false;

//Setting the geometries
var geometry = new THREE.BoxGeometry( 10, 10, 10 );
var planeGeo = new THREE.PlaneGeometry(1000,150);
var circleGeo = new THREE.SphereGeometry(5, 32, 32);
var roadMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color('white'),wireframe:false,map:texture});
var invisibleCircle = new THREE.MeshPhongMaterial({color: new THREE.Color('white'),wireframe:false, transparent:true, opacity : 0.3});

//Creating Meshes
var cube = new THREE.Mesh( geometry, roadMaterial );
var cube2 = new THREE.Mesh( geometry, roadMaterial );
var cube3 = new THREE.Mesh( geometry, roadMaterial );
var cube4 = new THREE.Mesh( geometry, roadMaterial );
var circle = new THREE.Mesh( circleGeo, invisibleCircle);
var plane = new THREE.Mesh( planeGeo, roadMaterial );
var plane2 = new THREE.Mesh( planeGeo, roadMaterial );

//Transforms
plane.rotateX(degToRad(-90))
plane2.rotateX(degToRad(-90))
plane.position.set(0,-25,25);
plane2.position.set(1000,-25,25);
cube.position.set(100, 1, 0);
cube2.position.set(-100, 1, 0);
cube3.position.set(0, 100, 0);
cube4.position.set(0, -100, 0);
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
group.add( circle );

var mountainGroup = new THREE.Group();
var mountainGroup2 = new THREE.Group();
var skyBoxGroup = new THREE.Group()

//Variable that adds Models
var objLoader =  new THREE.ObjectLoader();


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


var render = function (time) {
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
    OrbitCycle();
    // if(sunLight.position.y <0)
    //     hemiLight.position.y=1;
    // else
    //     hemiLight.position.y=-1;

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
   var skyboxGeometry = new THREE.CubeGeometry(1000,1000,1000);
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
    if(actualTime<timeOfDay){
        switch (wichAnim)
        {
            case 0:
                {
                    let bz = Bezier(orbitsBezierPoints.east,orbitsBezierPoints.west,orbitsBezierPoints.controlPoints[0],orbitsBezierPoints.controlPoints[1],actualTime/timeOfDay);
                    sunLight.position.set(bz[0],bz[1],bz[2]);
                    break;
                }
            case 1:
                {
                    let bz =(Bezier(orbitsBezierPoints.west,orbitsBezierPoints.east,orbitsBezierPoints.controlPoints[2],orbitsBezierPoints.controlPoints[3],actualTime/timeOfDay));
                    sunLight.position.set(bz[0],bz[1],bz[2]);
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
                break;
            }
            case 1:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.dawn[0],dayNnightColors.night[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[1],dayNnightColors.night[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[2],dayNnightColors.night[2],skyTime/(timeOfDay/2)))
                                                        )
                });
                break;
            }
            case 2:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.night[0],dayNnightColors.dawn[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.night[1],dayNnightColors.dawn[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.night[2],dayNnightColors.dawn[2],skyTime/(timeOfDay/2)))
                                                        )
                });
                break;
            }
            case 3:{
                sbx.material.forEach(element => {
                    element.color.set (new THREE.Color(Lerp(dayNnightColors.dawn[0],dayNnightColors.day[0],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[1],dayNnightColors.day[1],skyTime/(timeOfDay/2)),
                                                        Lerp(dayNnightColors.dawn[2],dayNnightColors.day[2],skyTime/(timeOfDay/2)))
                                                        )
                });
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
//#endregion