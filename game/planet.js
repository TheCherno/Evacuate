
function Planet(name, size) {
    var geometry = new THREE.SphereGeometry(size, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        color: 0xbbbbbb,
        ambient: 0xbbbbbb,
        shininess: 20,
        map: THREE.ImageUtils.loadTexture('res/planets/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('res/planets/earthbump1k.jpg'),
        bumpScale: 0.1,
        specularMap: THREE.ImageUtils.loadTexture('res/planets/earthspec1k.jpg')
    });
    this.object = new THREE.Mesh(geometry, material);
    this.object.castShadow = true;
    this.size = size;
    
    this.properties = {
        type: "PLANET",
        name: name,
        population: 7109255108,
        pop_rate: -0.1
    };
    
    this.cloudMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('res/planets/cloudmap.png'),
        side: THREE.DoubleSide,
        opacity: 0.7,
        transparent: true,
        depthWrite: false
    });
    this.clouds = new THREE.Mesh(new THREE.SphereGeometry(size + 0.2, 32, 32), this.cloudMaterial);
    this.object.add(this.clouds);
    
    var glow = new THREE.SpriteMaterial({
        map: THREE.ImageUtils.loadTexture('res/planets/glow.png'),
        useScreenCoordinates: false,
        color: 0x459DF5,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    var sprite = new THREE.Sprite(glow);
    sprite.scale.set(size * 3, size * 3, 1.0);
    this.object.add(sprite);
    
    this.changePop = function (amount) {
        if (this.properties.pop_rate < 0) this.properties.population -= amount;
        else this.properties.population += amount;
    };
    
    this.update = function () {
        if (this.properties.population <= 0) Game.over();
        this.properties.population += this.properties.pop_rate;
        
        this.object.rotation.x += 0.001;
        this.clouds.rotation.x -= 0.0002;

        this.object.rotation.y += 0.001;
        this.clouds.rotation.y -= 0.0002;

        this.object.rotation.z += 0.001;
        this.clouds.rotation.z -= 0.0002;
    }
}