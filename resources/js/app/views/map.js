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

 		,	pollutions: new app.collections.pollutions

 		,	symptoms: new app.collections.symptoms

 		,	map: null

 		,	bounds: new google.maps.LatLngBounds()

 		,	markers: []

 		,	canvas: $('#map-canvas')[0]

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'render',
	 				'renderPollutionMap',
	 				'renderSymptomsMap',
	 				'setMarkers',
	 				'boundListener'
	 			);

				this.model.on("change:center", this.render, this);
 				this.model.get('callbacks').click = this.click;

 				this.boundListener();


 				// Pollutions collection
	 			this.pollutions.on( 'sync', this.renderPollutionMap);

 				// Symptoms collection
	 			this.symptoms.on( 'sync', this.renderSymptomsMap);
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

				this.setMarkers( this.pollutions );
				this.setMarkers( this.symptoms );

 			}


 		,	renderPollutionMap: function( collection, response ){

 				var _this = this;

 				_this.map = null;

 				this.setCanvas( function(){
	 				
	 				// Init map canvas
	 				_this.canvas = $('#map-canvas')[0];

					_this.map = new google.maps.Map( _this.canvas, {
						zoom: 5,
						center: _this.model.get('center')
					});

					//_this.boundListener();
					_this.setMarkers( _this.pollutions );


 				});


            }

		,	renderSymptomsMap: function( collection, response ){

				var _this = this;

 				_this.map = null;

 				this.setCanvas( function(){
	 				
	 				// Init map canvas
	 				_this.canvas = $('#map-canvas')[0];

					_this.map = new google.maps.Map( _this.canvas, {
						zoom: 5,
						center: _this.model.get('center')
					});

					//_this.boundListener();
					_this.setMarkers( _this.symptoms );


 				});

           }


        ,	setMarkers: function( collection ){

        		var _this = this;

        		collection.each(function(report, index ){

        			var position = new google.maps.LatLng(
        				Number(report.get('location').latitude),
        				Number(report.get('location').longitude)
        			);

        			var image = new google.maps.MarkerImage(imagePath + 'svgs/' + report.get('subtype') + '.svg',
    				null, null, null, new google.maps.Size(100,128));

        			_this.bounds.extend(position);

	        		var marker = new google.maps.Marker({
	        			position: position,
	        			map: _this.map,
	        			icon: image
	        		});

	        		_this.markers.push( marker );

	        		_this.map.fitBounds(_this.bounds);
        		});

        	}


 		,	showMapLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/layers.ejs'}).render();

 				submenu.html(layers);
 			}

 		,	boundListener: function(){

 				var _this = this;

 				if( _this.map )
	 				var boundListener = google.maps.event.addListener((_this.map), 'bounds_changed', function(event) {
				        this.setZoom(14);
				        google.maps.event.removeListener(_this.boundListener);
				    });
 			}

 	});


 	app.views.map = new MapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);