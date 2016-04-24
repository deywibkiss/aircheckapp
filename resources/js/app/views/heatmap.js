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

 	var HeatmapView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 			}

 		,	pollutions: new app.collections.pollutions

 		,	map: null

 		,	heatmap: null

 		,	heatmapPoints: []

 		,	canvas: $('#heatmap-canvas')[0]

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'setCanvas',
	 				'renderPollutionHeatmap',
	 				'getHeatmapPoints'
	 			);
 
 				// Pollutions collection
	 			this.pollutions.on( 'sync', this.renderPollutionHeatmap);
 			}


 		,	setCanvas: function( callback ){

 				if( $('#heatmap-canvas').length <= 0 ){
	 				var html = new EJS({ url: templatePath + 'map/heatmap.ejs'}).render({});
	 				content.html(html);
 				}

 				if( typeof callback == 'function')
 					callback.call();
 			}

        ,	renderPollutionHeatmap: function(){

        		var _this = this;

 				this.setCanvas( function(){

 					_this.canvas = $('#heatmap-canvas')[0];
	 				
	 				// Init map canvas
	 				_this.map = new google.maps.Map(_this.canvas, {
						zoom: 18,
						center: { lat:4.626988, lng: -74.065205 },
						mapTypeId: google.maps.MapTypeId.SATELLITE
					});

					var points = _this.getHeatmapPoints();

	        		_this.heatmap = new google.maps.visualization.HeatmapLayer({
						data: points,
						map: _this.map,
						radius: 60
					});

 				});

        	}

        

        ,	getHeatmapPoints: function(){

        		var _this = this;

        		this.heatmapPoints = [];

				this.pollutions.each(function(report, index ){

					if(_.isNaN( Number(report.get('location').latitude) ) )
						return;

					if(_.isNaN( Number(report.get('location').longitude) ) )
						return;

					var position = new google.maps.LatLng(
						parseFloat(report.get('location').latitude),
						parseFloat(report.get('location').longitude)
					);

					_this.heatmapPoints.push(position);
				});

				return _this.heatmapPoints;
        	}

 	});


 	app.views.heatmap = new HeatmapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);