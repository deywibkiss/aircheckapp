/*
 |--------------------------------------------------------------------------
 | User View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of user
 |
 |
 */
 ( function( $, window, document, app ){

 	var MapView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 				'click #map-button': 'showMapLayers'
 			}

 		,	model: new app.models.location

 		,	map: null

 		,	canvas: $('#map-canvas')[0]

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'render'
	 			);

				this.model.on("change:center", this.render, this);
 				this.model.get('callbacks').click = this.click;
 			}


 		,	setCanvas: function( callback ){

 				var html = new EJS({ url: templatePath + 'map/default.ejs'}).render({});
 				content.html(html);

 				if( typeof callback == 'function')
 					callback.call();
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	render: function(){

 				this.canvas = $('#map-canvas')[0];

				this.map = new google.maps.Map( this.canvas, {
					center: this.model.get('center'),
					zoom: 17
				});

				this.model.setMarker( this.map );

 			}

 		,	click: function(e){

 			}


 		,	showMapLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/layers.ejs'}).render();

 				submenu.html(layers);
 			}

 	});


 	app.views.map = new MapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);