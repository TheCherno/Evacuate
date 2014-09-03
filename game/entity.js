
function Entity () {
    this.material = new THREE.ShaderMaterial({
       vertexShader: document.getElementById('box-vert').textContent, 
       fragmentShader: document.getElementById('box-frag').textContent
    });
    this.object = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), this.material);
    
    this.update = function () {
        
    };
}