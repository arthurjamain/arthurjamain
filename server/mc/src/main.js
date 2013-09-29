requirejs.config({
  baseUrl: '/mc',
  paths: {
    'jquery': 'lib/jquery',
    'philogl': 'lib/PhiloGL'
  }
});

define(['jquery', 'philogl', 'src/AGGLManager', 'src/AGObjLoader'], function($, phi, AGGLManager, AGObjLoader) {

  wglManager = new AGGLManager('mainwindow');
  map = new AGObjLoader("http://localhost/mc/obj/tower.obj");

});