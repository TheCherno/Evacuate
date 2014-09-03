
function Bridge() {
    var geometry = new THREE.BoxGeometry(2, 2, 30, 2, 2, 10);
    var material = new THREE.MeshBasicMaterial();
    this.object = new THREE.Mesh(geometry, material);
    
    this.properties = {
        name: "EarthLink (TM)",
        type: "STRUCTURE"
    };
    
    this.update = function () {
        
    };
}