define(['philogl'], function() {

/*

AGFace Class

an AGFace represents a triangle on the screen.
An object contains all the coordinates, textures,
normals and any other data needed to display
a model (or in this case a fragment of a model).

*/

function AGFace(x1, y1, z1, x2, y2, z2, x3, y3, z3) {


  this.poly = {
    p1:{x: x1, y: y1, z: z1},
    p2:{x: x2, y: y2, z: z2},
    p3:{x: x3, y: y3, z: z3},
    txz: [{x:x1, y:z1}, {x:x2, y:z2}, {x:x3, y:z3}],
    txy: [{x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}],
    tyz: [{x:y1, y:z1}, {x:y2, y:z2}, {x:y3, y:z3}]
  };

  this.tex = [];
  this.normal = [];
  this.plane = "";

  //Set Face Plane
  if(x1.toFixed(2) == x2.toFixed(2) && x1.toFixed(2) == x3.toFixed(2)) {
    this.plane = "YZ";
  }
  else if(y1.toFixed(2) == y2.toFixed(2) && y1.toFixed(2) == y3.toFixed(2)) {
    this.plane = "XZ";
  }
  else if(z1.toFixed(2) == z2.toFixed(2) && z1.toFixed(2) == z3.toFixed(2)) {
    this.plane = "XY";
  }

  // Allows detection of a collision during lateral movement.
  // ray is a vector indicating the direction of the camera
  // in the standard XYZ space.
}

AGFace.prototype.isCollidingLateral = function(ax, ay, az, ray) {
    // Exclude the XZ Plane ; lateral movement = constant y
    if(this.plane == "YZ") {
      if(ray.x > 0)
      {
        if((ax < this.poly.p1.x + 2 && ax > this.poly.p1.x ))
        {
          if(this.isPointInPoly(this.poly.tyz, {x: ay, y: az}))
          {
            return "YZ";
          }
          return false;
        }

        return false;
      }
      else {
        if((ax > this.poly.p1.x - 2 && ax < this.poly.p1.x )) {

          if(this.isPointInPoly(this.poly.tyz, {x: ay, y: az}))
          {
            return "YZ";
          }
          return false;
        }
        return false;
      }
    }
    if(this.plane == "XY") {
      if(ray.z >= 0)
      {
        if((az < this.poly.p1.z + 2 && az > this.poly.p1.z ))
        {
          if(this.isPointInPoly(this.poly.txy, {x: ax, y: ay}))
          {
            return "XY";
          }
          return false;
        }

        return false;
      }
      else {
        if((az > this.poly.p1.z - 2 && az < this.poly.p1.z )) {

          if(this.isPointInPoly(this.poly.txy, {x: ax, y: ay}))
          {
            return "XY";
          }
          return false;
        }
        return false;
      }
    }
};

AGFace.prototype.isColliding = function(ax, ay, az, ray) {

    if(this.plane == "YZ") {
      if(ray.x > 0)
      {
        if((ax < this.poly.p1.x + 2 && ax > this.poly.p1.x ))
        {
          if(this.isPointInPoly(this.poly.tyz, {x: ay, y: az}))
          {
            return "YZ";
          }
          return false;
        }

        return false;
      }
      else {
        if((ax > this.poly.p1.x - 2 && ax < this.poly.p1.x )) {

          if(this.isPointInPoly(this.poly.tyz, {x: ay, y: az}))
          {
            return "YZ";
          }
          return false;
        }
        return false;
      }
    }
    if(this.plane == "XZ") {
      if(ray.y < 0)
      {
        if((ay < this.poly.p1.y + 2 && ay > this.poly.p1.y )) {

          if(this.isPointInPoly(this.poly.txz, {x: ax, y: az}))
          {
            return "XZ";
          }
          return false;
        }

        return false;
      }
      else {
        if((ay > this.poly.p1.y - 2 && ay < this.poly.p1.y )) {

          if(this.isPointInPoly(this.poly.txz, {x: ax, y: az}))
          {
            return "XZ";
          }
          return false;
        }
        return false;
      }
    }
    if(this.plane == "XY") {
      if(ray.z >= 0)
      {
        if((az < this.poly.p1.z + 2 && az > this.poly.p1.z ))
        {
          if(this.isPointInPoly(this.poly.txy, {x: ax, y: ay}))
          {
            return "XY";
          }
          return false;
        }

        return false;
      }
      else {
        if((az > this.poly.p1.z - 2 && az < this.poly.p1.z )) {

          if(this.isPointInPoly(this.poly.txy, {x: ax, y: ay}))
          {
            return "XY";
          }
          return false;
        }
        return false;
      }
    }

};

AGFace.prototype.isPointInPoly = function(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
    return c;
};

AGFace.prototype.setTexture = function(curMat, t, swap) {

    var toTex;

    if(curMat == "Grass" || curMat == "Tall_Grass" || curMat == "FlowerRed" || curMat == "RedstoneOre" || curMat == "FlowerYellow" || curMat == "Fence" || curMat == "Minecart_Tracks") {
        var xT=0, yT=0;
        if(this.plane == "XZ") {
          xT = 0*16+1;
          yT = 15*16+1;
        }
        else {
          xT = 3*16+1;
          yT = 15*16+1;
        }
        t = [xT/256, yT/256, xT/256, (yT+14)/256, (xT+14)/256, (yT+14)/256, (xT+14)/256, yT/256];
    }
    else if(curMat == "Cactus") {
      var xT=0, yT=0;
        if(this.plane == "XZ") {
          xT = 5*16+1;
          yT = 11*16+1;
        }
        else {
          xT = 6*16+1;
          yT = 11*16+1;
        }
        t = [xT/256, yT/256, xT/256, (yT+14)/256, (xT+14)/256, (yT+14)/256, (xT+14)/256, yT/256];

    }
    else if(curMat == "Wood") {
      var xT=0, yT=0;
        if(this.plane == "XZ") {
          xT = 5*16+1;
          yT = 14*16+1;
        }
        else {
          xT = 4*16+1;
          yT = 14*16+1;
        }
        t = [xT/256, yT/256, xT/256, (yT+14)/256, (xT+14)/256, (yT+14)/256, (xT+14)/256, yT/256];

    }


    if(this.plane == "XZ" || (this.plane == "YZ" && this.normal[0] > 0) || (this.plane == "XY" && this.normal[2] < 0)) {
        toTex = t;
    }
    else if(this.plane == "YZ" && this.normal[0] < 0) {
          toTex = [t[6], t[7], t[0], t[1], t[2], t[3], t[4], t[5]];
    }
    else if(this.plane == "XY" && this.normal[2] > 0) {
          toTex = [t[6], t[7], t[0], t[1], t[2], t[3], t[4], t[5]];
    }
    else {
        toTex = t;
    }

    if(swap)
    {
        this.tex = [toTex[0], toTex[1], toTex[4], toTex[5], toTex[6], toTex[7]];
        swap = false;
    }
    else {
        this.tex = [toTex[0], toTex[1], toTex[2], toTex[3], toTex[4], toTex[5]];
        swap = true;
    }
};



function AGCube(ax, ay, az, aw, ah, ad) {

  this.origin = {x: ax, y: ay, z: az};
  this.size = {w: aw, h: ah, d: ad};
  this.faces = [];

  this.isFaceInCube = function(aFace) {

    if((aFace.poly.p1.x > this.origin.x && aFace.poly.p1.x < this.origin.x + this.size.w) || (aFace.poly.p2.x > this.origin.x && aFace.poly.p2.x < this.origin.x + this.size.w) || (aFace.poly.p3.x > this.origin.x && aFace.poly.p3.x < this.origin.x + this.size.w))
    {
      if((aFace.poly.p1.y > this.origin.y && aFace.poly.p1.y < this.origin.y + this.size.h) || (aFace.poly.p2.y > this.origin.y && aFace.poly.p2.y < this.origin.y + this.size.h) || (aFace.poly.p3.y > this.origin.y && aFace.poly.p3.y < this.origin.y + this.size.h))
      {
        if((aFace.poly.p1.z > this.origin.z && aFace.poly.p1.z < this.origin.z + this.size.d) || (aFace.poly.p2.z > this.origin.z && aFace.poly.p2.z < this.origin.z + this.size.d) || (aFace.poly.p3.z > this.origin.z && aFace.poly.p3.z < this.origin.z + this.size.d))
        {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  };

  this.isPointInCube = function(aPoint) {
    if((aPoint.x > this.origin.x && aPoint.x < this.origin.x + this.size.w))
    {
      if((aPoint.y > this.origin.y && aPoint.y < this.origin.y + this.size.h))
      {
        if((aPoint.z > this.origin.z && aPoint.z < this.origin.z + this.size.d))
        {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  };
}

function AGSkyBox(c, x, y, z) {

  this.cube = new PhiloGL.O3D.Sphere({
      textures: 'textures/skybox.png',
      program: 'vertex'
  });

  this.cube.scale.set(700, 700, 700);
  this.cube.position = {x:0, y:0, z:0};
  this.cube.display = true;
  this.cube.update();

  this.addToScene = function(scene) {
    scene.add(this.cube);
  };

}

return function AGObjLoader(url) {

  var v = [];
  var t = [];
  var p = 0;

  var mat;
  var objects = [];
  var textures = [];
  var tex = [];
  var normals = [];
  var collisions = [];
  var toAdd = [];
  var xT=0, yT=0;
  var curMat = "";
  var metaCubeSize = 500;
  var rows = 5;
  var cols = 5;
  var depth = 5;
  var curCube;
  var skybox;
  var swap;

  // Called when the map is deleted
  // Frees memory
  this.removeFromScene = function() {

    //Faces mgt
    for(var c in cubes) {
      cubes[c].faces = null;
      cubes[c] = null;
    }
    cubes = null;
    cubes = [];

    v = null;
    t = null;
    objects = null;
    textures = null;
    tex = null;
    normals = null;
    collisions = null;
    toAdd = null;

    //Models mgt
    scene.models = null;
    scene.models = [];
  };


  //Get Model Data
  var req = new PhiloGL.IO.XHR({
      url: url,
    onSuccess: function(text) {
        //uiManager.splash.downloadDone();
      setTimeout(function() {
        //Read / Parse it
        parseModelData(text);
      }, 100);
      },
      onError: function(e) {
        alert("An error ocurred while downloading the model.");
        //console.log("XHR Error : " + e);
    }
  }).send();

  function addModels() {
    v = null;
    t = null;
    objects = null;
    textures = null;
    tex = null;
    normals = null;
    collisions = null;
    toAdd = null;

    if(scene) {
      for(var t = 0; t < cubes.length ; t++)
      {
        var overtices = [];
        var otexcoords = [];
        var onormals = [];

        for(var l in cubes[t].faces)
        {
          overtices.push(cubes[t].faces[l].poly.p1.x, cubes[t].faces[l].poly.p1.y, cubes[t].faces[l].poly.p1.z, cubes[t].faces[l].poly.p2.x, cubes[t].faces[l].poly.p2.y, cubes[t].faces[l].poly.p2.z, cubes[t].faces[l].poly.p3.x, cubes[t].faces[l].poly.p3.y, cubes[t].faces[l].poly.p3.z);
          otexcoords.push(cubes[t].faces[l].tex[0], cubes[t].faces[l].tex[1], cubes[t].faces[l].tex[2], cubes[t].faces[l].tex[3], cubes[t].faces[l].tex[4], cubes[t].faces[l].tex[5]);
          onormals.push(cubes[t].faces[l].normal[0], cubes[t].faces[l].normal[1], cubes[t].faces[l].normal[2], cubes[t].faces[l].normal[3], cubes[t].faces[l].normal[4], cubes[t].faces[l].normal[5], cubes[t].faces[l].normal[6], cubes[t].faces[l].normal[7], cubes[t].faces[l].normal[8]);
        }

        if(t==cubes.length - 1) {
          scene.add(new PhiloGL.O3D.Model({
              vertices: overtices,
              textures: 'textures/terrain.png',
              texCoords: otexcoords,
              normals: onormals,
              program: 'transparent'
          }));
        }
        else {
          scene.add(new PhiloGL.O3D.Model({
              vertices: overtices,
              textures: 'textures/terrain.png',
              texCoords: otexcoords,
              normals: onormals,
              program: 'fragment'
          }));
        }
      }

      skybox = new AGSkyBox(metaCubeSize, -metaCubeSize/2, -metaCubeSize/2, -metaCubeSize/2);
      skybox.addToScene(scene);

      //uiManager.splash.done();
    }
    else {
      setTimeout(addModels, 500);
    }
  }

  function compareFaces (f1, f2) {
    var nbmatch = [];
    for(var k in f1.poly) {
      for(var l in f2.poly) {
        if(this.comparePoints(f1.poly[k], f2.poly[l]))
          nbmatch.push({f1index: k, f2index: l});
      }
    }
    return nbmatch;
  }

  function comparePoints(p1, p2) {
    if(p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
      return true;
    }
    return false;
  }

  function setCubes() {
    var cc = 0;
    var cr = 0;
    var cd = 0;
    var aCubeW = metaCubeSize/rows;
    var aCubeH = metaCubeSize/cols;
    var aCubeD = metaCubeSize/depth;
    cubes = [];
    for(var g = 0; g < cols*rows*depth; g++)
    {
      var aCubeX = aCubeW * cr - metaCubeSize/2;
      var aCubeY = aCubeH * cc - metaCubeSize/2;
      var aCubeZ = aCubeD * cd - metaCubeSize/2;

      var cleak = new AGCube(aCubeX, aCubeY, aCubeZ, aCubeW, aCubeH, aCubeD);

      cubes.push(cleak);

      if(cr < 4)
      {
        cr ++;
      }
      else {
        cr = 0;
        if(cd < 4)
        {
          cd++;
        }
        else {
          cd = 0;
          cc++;
        }
      }

    }
    var cleak = new AGCube(0, 0, 0, 0, 0, 0);
    cubes.push(cleak);
  }

  // Main parsing function. Each iteration is a line of the file.
  // Reads the .obj file and gets :
  //  - v vertices
  //  - vn normal vectors
  //  - mtl texture
  //  - f faces
  // Assembles this data into AGFaces objects stored in AGCubes.

  function parseModelData(data) {
    data = data.split("\n");

    // Creation of the AGCubes environment
    setCubes();

    // Those are a bit shaky. In order to upgrade the view of
    // the progress bar, the loop needs to be killed for the DOM
    // to refresh. I have to log the current loop position to
    // restart it afterwards.
    var j = 0;
    var loading = 0;

    var calcTerrain = function() {
      // If the file isn't done being read
      if(data) {
        for(var i = j ; i < data.length ; i++)
        {
          //Progress Bar Value
            if(loading != Math.ceil(i*100/data.length)) {
              //Update value, break loop, restart it 2ms after.
            loading = Math.ceil(i*100/data.length);
            j = i;
            setTimeout(calcTerrain, 2);
            //uiManager.splash.setProgressBar(Math.ceil(i*100/data.length));
            break;
          }
          //Point : store it for usage in faces
          // Ex : v 0.134817 -3.200002 -0.623059
            if(data[i].substr(0, 1) == "v")
            {
                var tg = data[i].split(" ");
                v.push([tg[1], tg[2], tg[3]]);
            }
            //Texture : switch texture constant value
            // Ex : usemtl Glass
            if(data[i].substr(0, 6) == "usemtl")
            {
                setTexture(data[i]);
            }
            //Normal : store it for usage in faces
            // Ex : vn -0.000000 0.000000 -1.000000
            if(data[i].substr(0, 2) == "vn")
            {
              var tg = data[i].split(" ");
              normals.push([tg[1], tg[2], tg[3]]);
            }
            //Face : Combination on the previously
            //     Gathered data into faces
            // Ex : f 6854//1 6855//1 10481//1
            if(data[i].substr(0, 1) == "f")
            {
                var lineD = data[i].split(" ");

                var pt1 = lineD[1].split("//");
                var pt2 = lineD[2].split("//");
                var pt3 = lineD[3].split("//");

                //Get correct Vertices from their index
                //Create a new Face
                var aFace = new AGFace(v[pt1[0]-1][0]*50, v[pt1[0]-1][1]*50, v[pt1[0]-1][2]*50,
                             v[pt2[0]-1][0]*50, v[pt2[0]-1][1]*50, v[pt2[0]-1][2]*50,
                             v[pt3[0]-1][0]*50, v[pt3[0]-1][1]*50, v[pt3[0]-1][2]*50);

              //Set its normal from stored normals index
                aFace.normal = [normals[pt1[1]-1][0], normals[pt1[1]-1][1], normals[pt1[1]-1][2],
                        normals[pt2[1]-1][0], normals[pt2[1]-1][1], normals[pt2[1]-1][2],
                        normals[pt3[1]-1][0], normals[pt3[1]-1][1], normals[pt3[1]-1][2]];

                //Set its corrected texture
                aFace.setTexture(curMat, t, swap);
                swap = !swap;

                // Calculate which AGCube the AGFace belongs to and push it inside.

                // Special, separate cube for transparent textures. No collisions.
                if(curMat == "Glass" || curMat == "WaterStationary") {
                  cubes[cubes.length-1].faces.push(aFace);
                  continue;
                }
                else if(curMat == "Torch") {

                  continue;
                }
                var cubeX, cubeY, cubeZ;

                cubeX = Math.floor((aFace.poly.p1.x + metaCubeSize/2)/(metaCubeSize/rows));
                cubeY = Math.floor((aFace.poly.p1.y + metaCubeSize/2)/(metaCubeSize/cols));
                cubeZ = Math.floor((aFace.poly.p1.z + metaCubeSize/2)/(metaCubeSize/depth));
                var index1 = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;
                if(cubes[index1])
                  cubes[index1].faces.push(aFace);

                cubeX = Math.floor((aFace.poly.p2.x + metaCubeSize/2)/(metaCubeSize/rows));
                cubeY = Math.floor((aFace.poly.p2.y + metaCubeSize/2)/(metaCubeSize/cols));
                cubeZ = Math.floor((aFace.poly.p2.z + metaCubeSize/2)/(metaCubeSize/depth));
                var index2 = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;
                if(index2 != index1 && cubes[index2])
                  cubes[index2].faces.push(aFace);

                cubeX = Math.floor((aFace.poly.p3.x + metaCubeSize/2)/(metaCubeSize/rows));
                cubeY = Math.floor((aFace.poly.p3.y + metaCubeSize/2)/(metaCubeSize/cols));
                cubeZ = Math.floor((aFace.poly.p3.z + metaCubeSize/2)/(metaCubeSize/depth));
                var index3 = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;
                if(index3 != index1 && index3 != index2 && cubes[index3])
                  cubes[index3].faces.push(aFace);

            }
            //EOF
            if((i+1) == data.length) {
            addModels();
          }
        }
      }
    };
    // Init terrain calculations
    calcTerrain();
  }

  function setTexture(mat)
  {
    mat = mat.split(" ")[1];
    mat = mat.split(".")[0];
    curMat = mat;
      if(mat == "Web" ) {
        curMat = "Web";
        xT = 5*16+1;
        yT = 12*16+1;
      }
      if(mat == "CoralOre" ) {
        curMat = "CoralOre";
        xT = 2*16+1;
        yT = 13*16+1;
      }
      if(mat == "Lava" || mat == "LavaStationary" || mat == 10 || mat == 11) {
        curMat = "Lava";
        xT = 14*16+1;
        yT = 0+1;
      }
      if(mat == "RedstoneOre" || mat == 73) {
        curMat = "RedstoneOre";
        xT = 3*16+1;
        yT = 12*16+1;
      }
      if(mat == "Chest" || mat == 54) {
        curMat = "Chest";
        xT = 11*16+1;
        yT = 14*16+1;
      }
      if(mat == "Bedrock" || mat == 7) {
        curMat = "Bedrock";
        xT = 1*16+1;
        yT = 14*16+1;
      }
      if(mat == "WaterStationary" || mat == 8 || mat == 9) {
        curMat = "WaterStationary";
        xT = 14*16+1;
        yT = 3*16+1;
      }
      if(mat == "Gravel" || mat == 13) {
        curMat = "Gravel";
        xT = 3*16+1;
        yT = 14*16+1;
        }
      if(mat == "Wood" || mat == 17) {
        curMat = "Wood";
        xT = 4*16+1;
        yT = 8*16+1;
        }
      if(mat == "Leaves" || mat == 18) {
        curMat = "Leaves";
        xT = 5*16+1;
        yT = 12*16+1;
        }
      if(mat == "Dirt" || mat == 3) {
        curMat = "Dirt";
        xT = 2*16+1;
        yT = 15*16+1;
        }
      if(mat == "WoodenPlank" || mat == 5) {
        curMat = "WoodenPlank";
        xT = 4*16+1;
        yT = 15*16+1;
        }
      if(mat == "Cobblestone" || mat == 4) {
        curMat = "Cobblestone";
        xT = 0*16+1;
        yT = 14*16+1;
        }
      if(mat == "GoldOre" || mat == 14) {
        curMat = "GoldOre";
        xT = 0*16+1;
        yT = 13*16+1;
        }
      if(mat == "LapisLazuliOre" || mat == 21) {
        curMat = "LapisLazuliOre";
        xT = 0*16+1;
        yT = 5*16+1;
        }
      if(mat == "Stone" || mat == 1) {
        curMat = "Stone";
        xT = 1*16+1;
        yT = 15*16+1;
        }
      if(mat == "Sand" || mat == 12) {
        curMat = "Sand";
        xT = 2*16+1;
        yT = 14*16+1;
        }
      if(mat == "Obsidian" || mat == 49) {
        curMat = "Obsidian";
        xT = 5*16+1;
        yT = 13*16+1;
        }
      if(mat == "Grass" || mat == 2) {
        curMat = "Grass";
        xT = 0*16+1;
        yT = 15*16+1;
        }
      if(mat == "Tall_Grass") {
        curMat = "Grass";
        xT = 0*16+1;
        yT = 15*16+1;
        }
      if(mat == "Minecart_Tracks" || mat == 66) {
        curMat = "Minecart_Tracks";
        xT = 0*16+1;
        yT = 7*16+1;
        }
      if(mat == "MonsterSpawner" || mat == 52) {
        curMat = "MonsterSpawner";
        xT = 0*16+1;
        yT = 7*16+1;
        }
      if(mat == "CoalOre" || mat == 16) {
        curMat = "CoalOre";
        xT = 2*16+1;
        yT = 13*16+1;
        }
      if(mat == "FlowerRed" || mat == 38) {
        curMat = "FlowerRed";
        xT = 12*16+1;
        yT = 15*16+1;
        }
      if(mat == "DiamondOre" || mat == 56) {
        curMat = "DiamondOre";
        xT = 2*16+1;
        yT = 12*16+1;
        }
      if(mat == "Fence" || mat == 85) {
        curMat = "Fence";
        xT = 0*16+1;
        yT = 7*16+1;
        }
      if(mat == "StoneMoss" || mat == 48) {
        curMat = "StoneMoss";
        xT = 4*16+1;
        yT = 9*16+1;
        }
      if(mat == "IronOre" || mat == 15) {
        curMat = "IronOre";
        xT = 1*16+1;
        yT = 13*16+1;
        }
      if(mat == "Torch" || mat == 50) {
        curMat = "Torch";
        xT = 0*16+1;
        yT = 10*16+1;
        }
      if(mat == "MushroomBrown" || mat == 39) {
        curMat = "MushroomBrown";
        xT = 13*16+1;
        yT = 14*16+1;
        }
      if(mat == "FlowerYellow" || mat == 37) {
        curMat = "FlowerYellow";
        xT = 13*16+1;
        yT = 15*16+1;
        }
      if(mat == "Glass" || mat == "GlassPane" || mat == 102 || mat == 20) {
        curMat = "Glass";
        xT = 3*16+1;
        yT = 11*16+1;
        }
      if(mat == "Unknown" || mat == "StoneBricks" || mat == 98) {
        curMat = "Unknown";
        xT = 6*16+1;
        yT = 12*16+1;
        }
      if(mat == "Sandstone" || mat == 24) {
        curMat = "Sandstone";
        xT = 0*16+1;
        yT = 2*16+1;
        }
      if(mat == "Dead_Shrub") {
        curMat = "Dead_Shrub";
        xT = 5*16+1;
        yT = 15*16+1;
        }
      if(mat == "IronBlock" || mat == 42) {
        curMat = "IronBlock";
        xT = 6*16+1;
        yT = 14*16+1;
        }
      if(mat == "Clay" || mat == 82) {
        curMat = "Clay";
        xT = 8*16+1;
        yT = 11*16+1;
        }
      if(mat == "Cactus" || mat == 81) {
        curMat = "Cactus";
        xT = 6*16+1;
        yT = 11*16+1;
        }
      //console.log(curMat);

    t = [xT/256, yT/256, xT/256, (yT+14)/256, (xT+14)/256, (yT+14)/256, (xT+14)/256, yT/256];

  }
  // Collision Detection function — lateral movement (straffing)
  this.isCollidingLateral = function(x, y, z, ray) {
    if(curCube) {

      // Calculate position in cubes if outside of current cube
      if(!curCube.isPointInCube({x:x, y:y, z:z}))
      {
        var cubeX = Math.floor((x + metaCubeSize/2)/(metaCubeSize/rows));
        var cubeY = Math.floor((y + metaCubeSize/2)/(metaCubeSize/cols));
        var cubeZ = Math.floor((z + metaCubeSize/2)/(metaCubeSize/depth));
        var index = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;

        curCube = cubes[index];
      }

      var retour = {xy: 0, yz: 0, xz: 0};
      // Test collision for each face in the cube
      for(var f in curCube.faces) {
        // This is lateral movement so we can exclude XZ collisions since y is constant
        if(curCube.faces[f].plane != "XZ") {
          var tg = curCube.faces[f].isCollidingLateral(x, y, z, ray);
          if(tg)
          {
            if(tg=="XY")
              retour.xy = 1;
            if(tg == "XZ")
              retour.xz = 1;
            if(tg == "YZ")
              retour.yz = 1;
          }
        }
      }
      return retour;
    }
    return false;
  }

  // Collision Detection function — regular movement
  this.isColliding = function(x, y, z, ray) {

    if(!curCube)
    {
      // Calculate position in cubes if outside of current cube
      var cubeX = Math.floor((x + metaCubeSize/2)/(metaCubeSize/rows));
      var cubeY = Math.floor((y + metaCubeSize/2)/(metaCubeSize/cols));
      var cubeZ = Math.floor((z + metaCubeSize/2)/(metaCubeSize/depth));
      var index = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;

      curCube = cubes[index];
    }

    if(curCube) {

      if(!curCube.isPointInCube({x:x, y:y, z:z}))
      {
        //for(var n in cubes)
        //{
          // Calculate position in cubes if outside of current cube
          var cubeX = Math.floor((x + metaCubeSize/2)/(metaCubeSize/rows));
          var cubeY = Math.floor((y + metaCubeSize/2)/(metaCubeSize/cols));
          var cubeZ = Math.floor((z + metaCubeSize/2)/(metaCubeSize/depth));
          var index = cubeY*(cols*rows) + cubeZ*(depth) + cubeX;

          curCube = cubes[index];
        //}
      }

      var retour = {xy: 0, yz: 0, xz: 0};

      for(var f in curCube.faces)
      {
        // Test collision for each face in the cube
        var tg = curCube.faces[f].isColliding(x, y, z, ray);
        if(tg)
        {
          if(tg=="XY")
            retour.xy = 1;
          if(tg == "XZ")
            retour.xz = 1;
          if(tg == "YZ")
            retour.yz = 1;
        }
      }
      return retour;
    }
    return false;
  }

}

});