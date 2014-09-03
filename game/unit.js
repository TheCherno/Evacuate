
function Unit(name, size, x, y, z, cap) {
    this.name = name;
    
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshPhongMaterial();
    this.object = new THREE.Mesh(geometry, material);
    this.object.position.x = x;
    this.object.position.y = y;
    this.object.position.z = z;
    
    this.speed = 0.5;

    this.laser = null;
    this.laser_material = new THREE.LineBasicMaterial();
    
    this.parent = null;
    this.child = null;
    this.planet = false;
    this.mx = 0;
    this.mz = 0;
    
    this.properties = {
        name: name,
        type: "UNIT",
        capacity: cap,
        gb_rate: 0
    };
    
    this.update = function() {
        if (this.mx != 0) {
            var x = this.object.position.x;
            if (Math.abs(x - this.mx) > 1) {
                if (x < this.mx) this.object.position.x += this.speed;
                if (x > this.mx) this.object.position.x -= this.speed;
            }
        }
        if (this.mz != 0) {
            var z = this.object.position.z;
            if (Math.abs(z - this.mz) > 1) {
                if (z < this.mz) this.object.position.z += this.speed;
                if (z > this.mz) this.object.position.z -= this.speed;
            }
        }
    };
    
    this.properties.gb_rate = this.properties.capacity * 0.0005;
    if (this.properties.gb_rate > 100) this.properties.capacity = 100;
    
    this.updateAI = function(planets, units, level) {
        Level.gb += this.properties.gb_rate;
        this.parent = null;
        this.child = null;
        for (var i = 0; i < units.length; i++) {
            var object = units[i].object;
            if (this.object == object) continue;
            if (Math.abs(object.position.x - this.object.position.x) < 50) {
                if (Math.abs(object.position.z - this.object.position.z) < 50) {
                    
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(new THREE.Vector3(this.object.position.x, this.object.position.y, this.object.position.z));
                    geometry.vertices.push(new THREE.Vector3(object.position.x, object.position.y, object.position.z));

                    level.world.remove(this.laser);
                    this.laser = new THREE.Line(geometry, this.laser_material);
                    level.world.add(this.laser);
                    
                    if (this.parent == null) this.parent = units[i];
                    else this.child = units[i];
                }
            }
        }
        this.planet = false;
        for (var i = 0; i < planets.length; i++) {
            planets[i].changePop(this.properties.capacity * 4.0);
            var object = planets[i].object;
            if (Math.abs(this.object.position.x - object.position.x) < planets[i].size * 0.81) {
                if (Math.abs(this.object.position.z - object.position.z) < planets[i].size * 0.81) {
                    this.planet = true;
                    break;
                }
            }
        }
        if (this.child == null && this.parent == null) level.world.remove(this.laser);
        /*if (this.planet) {
            console.log("Connected: " + this.connection(null));   
        }*/
    };
    
    this.connection = function(current) {
        if (current != null && this.planet) return true;
        if (this.child == current && this.child != null) {
            return this.parent.connection(this);
        } else if (this.parent == current && this.parent != null) {
            return this.child.connection(this);
        } else if (this.parent != null) {
            return this.parent.connection(this);
        }
        return false;
    };
    
    this.moveto = function(x, z) {
        this.mx = x;
        this.mz = z;
    };
}