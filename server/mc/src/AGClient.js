define(['underscore'], function(_) {

  var AGClient = function AGClient(scene) {

    this.scene = scene;
    this.initialize();

  };

  _.extend(AGClient.prototype, {

    model: null,
    scene: null,
    onScene: false,
    toRemove: false,

    initialize: function() {
      this.model = new PhiloGL.O3D.Sphere({program: 'vertex'});
      this.model.position = {x: 50, y:5, z:200};
    },

    addToScene: function(scene)
    {
      if(!this.onScene) {
        scene.add(this.model);
        this.onScene = true;
      }
    },

    removeFromScene: function() {
      this.scene.remove(this.model);
      this.onScene = false;
    },

    move: function(aX, aY, aZ) {
      this.model.position = {x: aX, y: aY, z: aZ};
      this.model.update();
    },

    setColor: function(r, g, b, a) {
      var tmp = this.model.position;
      this.scene.remove(this.model);
      this.model = new PhiloGL.O3D.Sphere({colors:[r, g, b, 1], program: 'vertex'});
      this.model.position = tmp;
      this.scene.add(this.model);
    }

  });

  return AGClient;

});