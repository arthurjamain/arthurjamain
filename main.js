require.config({
  baseUrl: 'src/',
  'paths': {
    'underscore': 'lib/underscore',
		'backbone': 'lib/backbone',
    'socket.io': 'http://192.168.1.43:27042/socket.io/socket.io',
    'tpl': 'tpl'
	},
	'shim':
	{
		backbone: {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		},
		underscore: {
			'exports': '_'
		}
	}
});

require([
	'app'
],
function (App) {
  window.app = new App();
});