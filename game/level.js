function Level() {
    this.planets = [];
    this.units = [];
    this.floor = null;
    this.world = new THREE.Object3D();
    var geometry = new THREE.SphereGeometry(2000, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture('res/space.jpg'),
        side: THREE.BackSide
    });
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.repeat.set(6, 6, 1);

    this.world = new THREE.Mesh(geometry, material);
    this.mouseVector = new THREE.Vector3();
    this.selected = null;
    
    this.connected = false;
    
    var panel = document.getElementById("panel");
    var res = document.getElementById("resources");
    var con = document.getElementById("status");
    
    var pmenu = null;
    var buymenu = new BuyMenu({
        "Light Fighter": 2000,
        "Heavy Fighter": 10000,
        "Garlic Fighter": 1000000,
        "Mid Fighter": 100000,
        "Extreme Fighter": 500000
    });
  //  var manageMenu = new ManageMenu();
    
    this.select = function (object) {
        if (object == null) this.selected = null;
        for (var i = 0; i < this.planets.length; i++) {
            if (this.planets[i].object == object) {
                this.selected = this.planets[i];
                var found = true;
                break;
            }
        }
        if (found) return;
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].object == object) {
                this.selected = this.units[i];
                break;
            }
        }
    };
    
    this.add = function (planet) {
        this.planets.push(planet);
        this.world.add(planet.object);
    };
    
    this.addFloor = function (floor) {
        this.floor = floor;
        this.world.add(this.floor);
    }

    this.createUnit = function (unit) {
        this.units.push(unit);
        this.world.add(unit.object);
    };

    this.update = function (raycaster) {
        if (Game.mouse.button == 0) {
            if (document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id == "game_canvas") {
                var intersects = raycaster.intersectObjects(this.world.children);
                if (intersects.length > 0 && intersects[0].object != this.floor) this.select(intersects[0].object);
                else this.select(null);
            } else if (document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id == "buy") {
                pmenu = buymenu;
            } else if (document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id == "return") {
                pmenu = null;
            } else if (document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id == "manage") {
            //    pmenu = manageMenu;
            }
            
            if (pmenu != null) {
                var key = document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id;
                if (key in pmenu.options && Level.gb >= pmenu.options[key]) {
                    Level.gb -= pmenu.options[key];
                    switch (key) {
                        case "Light Fighter":
                            this.createUnit(new Unit("Light Fighter", 1, 20, 5, 20, 1000));
                            break;
                        case "Mid Fighter":
                            this.createUnit(new Unit("Mid Fighter", 2, 20, 5, 20, 20000));
                            break;
                        case "Heavy Fighter":
                            this.createUnit(new Unit("Heavy Fighter", 3, 20, 5, 20, 100000));
                            break;
                        case "Extreme Fighter":
                            this.createUnit(new Unit("Extreme Fighter", 4, 20, 5, 20, 500000));
                            break;
                        case "Garlic Fighter":
                            this.createUnit(new Unit("Garlic Fighter", 8, 20, 5, 20, 1000000));
                            break;
                    };
                    
                }
            }
        } else if (Game.mouse.button == 2) {
            if (document.elementFromPoint(Game.mouse.ax, Game.mouse.ay).id == "game_canvas") {
                var intersects = raycaster.intersectObject(this.floor);
                if (intersects.length > 0 && this.selected != null) {
                    if (this.selected.properties.type == "UNIT") {
                        this.selected.moveto(intersects[0].point.x, intersects[0].point.z);
                    }
                }
            }
        }
    };
    this.gb_rate = 0.3;
    this.render = function() {
        Level.gb += 0.3;
        if (this.selected != null) {
            var string = '<heading style="font-weight:bold;">' + this.selected.properties.name + '</heading><br/>';
            switch (this.selected.properties.type) {
            case "PLANET":
                if (pmenu == null) {
                    string += Math.floor(this.selected.properties.population);
                    string += '<p id="buy" class="button">BUY</p>';
                    //string += '<p id="manage" class="button">MANAGE</p>';
                } else {
                    string += pmenu.renderText(Level.gb) + '<div id="return" class="button">RETURN</div>';
                }
                break;
            case "UNIT":
                string += 'Capacity: ' + this.selected.properties.capacity + '<br/>';
                string += 'Garlic Bread (GB) bonus: ' + this.selected.properties.gb_rate  + '<br/>';
                break;
            default:
                break;
            }
            panel.innerHTML = string;
        } else {
            panel.innerHTML = "";   
        }
        
        res.innerHTML = "GB: " + Math.floor(Level.gb) + "<br/><br/>GB Rate: " + this.gb_rate;
        //if (this.connected) con.innerHTML = '<div id="connected">Connected!</div>';
        //else con.innerHTML = '<div id="disconnected">Disconnected!</div>';
        
        for (var i = 0; i < this.planets.length; i++) {
            if (this.planets[i] == this.selected) this.planets[i].object.material.wireframe = true;
            else this.planets[i].object.material.wireframe = false;
            this.planets[i].update();
        }
        this.gb_rate = 0.3;
        for (var i = 0; i < this.units.length; i++) {
            this.gb_rate += this.units[i].properties.gb_rate;
            if (this.units[i] == this.selected) this.units[i].object.material.wireframe = true;
            else this.units[i].object.material.wireframe = false;
            this.units[i].update();
            this.units[i].updateAI(this.planets, this.units, this);
        }
                
    };
    
}

Level.gb = 2000;