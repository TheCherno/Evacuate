
function Game(width, height) {
    Game.width = width;
    Game.height = height;
    this.gl_scene = new THREE.Scene();
    this.gl_camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 4000);
    
    this.gl_camera.position.x = 53;
    this.gl_camera.position.y = 80;
    this.gl_camera.position.z = 53;
    this.gl_camera.rotation.x = -0.86;
    this.gl_camera.rotation.y = 0.58;
    this.gl_camera.rotation.z = 0.58;
    
    this.gl_renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("game_canvas") });
    this.gl_projector = new THREE.Projector();
    this.mouseVector = new THREE.Vector3();
    
    this.entities = [];
    
    var level = new Level();
    this.gl_scene.add(level.world);
    var controls;
    var debugOut = document.getElementById("debug");
    
    this.init = function () {
        this.selected = null;
        controls = new THREE.OrbitControls(this.gl_camera, document, this.gl_renderer.domElement);
        
        this.earth = new Planet("Earth", 25);
        this.earth.object.position.x = 0;
        level.add(this.earth);

        this.new_earth = new Planet("New Earth", 15);
        this.new_earth.object.position.x = 60;
        this.new_earth.properties.population = 2305;
        this.new_earth.properties.pop_rate = 0.1;
        level.add(this.new_earth);

        this.initGraphics();
    };
    
    this.initGraphics = function () {
        this.gl_renderer.setSize(width, height);
        //this.gl_renderer.setClearColor(0x2345aa, 1);
        this.gl_renderer.shadowMapEnabled = true;
        this.gl_renderer.shadowMapSoft = true;
        this.gl_renderer.shadowMapWidth = 512;
        this.gl_renderer.shadowMapHeight = 512;
       // document.body.appendChild(this.gl_renderer.domElement);
        
        var light = new THREE.AmbientLight(0xffffff, 0.2);
        //this.gl_scene.add(light);
        
        var dir = new THREE.DirectionalLight(0xffeeff, 0.75);
        dir.position.set(-100, 150, 50);
        
        dir.castShadow = true;
        //dir.shadowCameraVisible = true;
        
        dir.shadowMapWidth = 512;
        dir.shadowMapHeight = 512;
        
        dir.shadowCameraFar = 1000;
        dir.shadowDarkness = 0.8;
        this.gl_scene.add(dir);
        
        var geometry = new THREE.PlaneGeometry(1000, 1000, 64, 64);
        var material = new THREE.MeshPhongMaterial({
            wireframe: true,
            visible: false
        });
        
        var plane = new THREE.Mesh(geometry, material)
        plane.rotation.x = -Math.PI / 2;
        level.addFloor(plane);
        
        var bridge = new Bridge();
        bridge.object.rotation.y = Math.PI / 2;
        bridge.object.position.x = this.earth.object.position.x + 35;
       // level.add(bridge);
    };
    
    this.run = function () {
        if (!Game.complete) {
            this.update();
            this.render();
        }
    };
    
    this.add = function(entity) {
        this.entities.push(entity);
        this.gl_scene.add(entity.object);
    }
    
    this.update = function () {
        Game.time += 1 / 60 / 60;
        this.mouseVector.x = 2 * (Game.mouse.x / Game.width) - 1;
        this.mouseVector.y = 1 - 2 * (Game.mouse.y / Game.height);
        var raycaster = this.gl_projector.pickingRay(this.mouseVector, this.gl_camera);
        level.update(raycaster);
        controls.updateCamera();
    };
    
    this.render = function () {
        /*debugOut.innerHTML = "X: " + this.gl_camera.position.x +
              "<br/>Y: " + this.gl_camera.position.y +
              "<br/>Z: " + this.gl_camera.position.z + "<br/>" +
              "<br/>RX: " + this.gl_camera.rotation.x +
              "<br/>RY: " + this.gl_camera.rotation.y +
              "<br/>RZ: " + this.gl_camera.rotation.z;*/
        level.render();
        this.gl_renderer.render(this.gl_scene, this.gl_camera);
    };
}

Game.mouse = { x: 0, y: 0, ax: 0, ay: 0, button: -1, scroll: 0 };
Game.keys = [];
Game.complete = false;
Game.time = 0;

Game.over = function() {
    Game.complete = true;
    document.getElementById("panel").innerHTML = "";
    document.getElementById("end").innerHTML = '<h1>Congratulations!</h1><br/><h2>Earth has been saved in ' + (Math.round(Game.time * 100) / 100) + ' minutes!</h2><br/><h3>(Refresh the page to play again)</h3>';
};