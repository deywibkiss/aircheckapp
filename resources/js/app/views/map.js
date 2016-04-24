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
 				'click #map-button': 'showMapLayers',
 				'click #symptoms-subitems-button': 'showSymptomsLayers',
 				'click #locate-button': 'refreshPosition'
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
	 				'setMap',
	 				'setMarkers',
	 				'removeMarkers',
	 				'boundListener',
	 				'centerUser'
	 			);

 				this.boundListener();
 
 				// Pollutions collection
	 			this.pollutions.on( 'sync', this.renderPollutionMap);

 				// Symptoms collection
	 			this.symptoms.on( 'sync', this.renderSymptomsMap);
 			}


 		,	setCanvas: function( callback ){

 				if( $('#map-canvas').length <= 0 ){
	 				var html = new EJS({ url: templatePath + 'map/default.ejs'}).render({});
	 				content.html(html);
 				}

 				if( typeof callback == 'function')
 					callback.call();
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	render: function(){

 				this.setMap();
				this.setMarkers( this.pollutions );
				this.setMarkers( this.symptoms );

				this.model.get('callbacks').setPosition = this.centerUser;
				this.model.getGeoposition();
 			}


 		,	renderPollutionMap: function( collection, response ){

 				var _this = this;

 				this.setCanvas( function(){
	 				_this.setMap();
	 				_this.removeMarkers();
					_this.setMarkers( _this.pollutions );
					_this.model.get('callbacks').setPosition = _this.centerUser;
					_this.model.getGeoposition();
 				});


            }

		,	renderSymptomsMap: function( collection, response ){

				var _this = this;

 				this.setCanvas( function(){
	 				// Init map canvas
	 				_this.setMap();
	 				_this.removeMarkers();
					_this.setMarkers( _this.symptoms );
					_this.model.get('callbacks').setPosition = _this.centerUser;
					_this.model.getGeoposition();

 				});

           }

        ,	setMap: function(){

        		var _this = this;

 				// Init map canvas
 				if( _this.map == null ){
	 				_this.canvas = $('#map-canvas')[0];

					_this.map = new google.maps.Map( _this.canvas, {
						zoom: 5,
						center: _this.model.get('center')
					});

					/*
					**
					MODIS_Terra_Cloud_Top_Temp_Day		//Cloudy
					MODIS_Terra_Aerosol		//Aereosol
					MLS_CO_215hPa_Day	//Dioxido de Carbono
					MODIS_Terra_Cloud_Top_Temp_Day //Temperatura
					MLS_HNO3_46hPa_Day //Acido Nitrico
					AIRS_Precipitation_Day
					AMSR2_Wind_Speed_Day //Velocidad del viento

					*/

					//_this.setLayer( "AMSR2_Wind_Speed_Day" );
 				}
        	}

    	,	setLayer: function(product){

        		var _this = this;

 				// Init map canvas
 				if( _this.map != null ){
	 				// var product = "MODIS_Terra_Cloud_Top_Temp_Day";

				    var getTileUrl = function(tile, zoom) {

			    		var hoy = new Date();
		    			var mes = ("0" + (hoy.getMonth() + 1)).slice(-2)

				        var url = "//map1.vis.earthdata.nasa.gov/wmts-webmerc/" +
				               product + "/default/" + hoy.getFullYear() + "-"+mes+"-" + hoy.getDate() + "/" +
				               "GoogleMapsCompatible_Level6/" +
				                zoom + "/" + tile.y + "/" +
				                tile.x + ".png";

				        return url;
				    };

				    var layerOptions = {
				        alt: product,
				        getTileUrl: getTileUrl,
				        name: product,
				        tileSize: new google.maps.Size(256, 256),
				        opacity: 0.4
				    };

				    var imageMapType = new google.maps.ImageMapType(layerOptions);
				    _this.map.overlayMapTypes.insertAt(0, imageMapType);
 				}
        	}


        ,	setMarkers: function( collection ){

        		var _this = this;

        		collection.each(function(report, index ){

        			var position = new google.maps.LatLng(
        				Number(report.get('location').latitude),
        				Number(report.get('location').longitude)
        			);

        			var image = new google.maps.MarkerImage(imagePath + 'pins/' + report.get('subtype') + '.svg',
    				null, null, null, new google.maps.Size(64,64));

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

        ,	removeMarkers: function(){

        		_.each( this.markers, function( marker, index ){
        			marker.setMap(null);
        		});

        		this.markers = [];
        	}

        ,	centerUser: function( position ){

        		var _this = this;

        		this.model.set('center', new google.maps.LatLng( position.coords.latitude, position.coords.longitude ));
        		var image = new google.maps.MarkerImage(imagePath + 'pins/user.svg',
    				null, null, null, new google.maps.Size(64,64));

        		var marker = new google.maps.Marker({
        			position: _this.model.get('center'),
        			map: _this.map,
        			icon: image,
        			zIndex: 99999
        		});

        		this.map.setCenter( this.model.get('center') );
        		this.map.setZoom(15);

        	}


 		,	showMapLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/layers.ejs'}).render();

 				submenu.html(layers);
 			}

 		,	showSymptomsLayers: function(e){
 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/symptoms.ejs'}).render();

 				sublayers.html(layers);

 				sublayers.addClass('active');
 			}

 		,	boundListener: function(){

 				var _this = this;

 				if( _this.map )
	 				var boundListener = google.maps.event.addListener((_this.map), 'bounds_changed', function(event) {
				        this.setZoom(14);
				        google.maps.event.removeListener(_this.boundListener);
				    });
 			}

 		,	refreshPosition: function(e){
 				this.model.get('callbacks').setPosition = this.centerUser;
 				this.model.getGeoposition();
 			}

 	});


 	app.views.map = new MapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);