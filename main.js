require.config({ 
    'paths': { 
    "underscore": "src/lib/underscore", 
		"backbone": "src/lib/backbone",
    'socket.io': 'http://192.168.1.43:27042/socket.io/socket.io'
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
	'src/app'
	], 
	function(App){
    
    window.app = new App();
    
});