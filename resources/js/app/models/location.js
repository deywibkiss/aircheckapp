( function($, window, document, app ){
	

	'use-strict';

	app.models.location = Backbone.Model.extend({

			urlRoot: apiURL + "location"

		,	idAttribute: "_id"

		,	geoCodingKey: 'AIzaSyAr9JaJNwAqeHGkLUr2qq-Quo1xAK8FLG4'

		,	defaults: {
				_id: null,
				center: null,
				marker: null,
				callbacks: {
					click: null,
					setPosition: this.setPosition,
					render: null
				}
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				// Bind all events so this variable could
	 			// be the model in function scopes
	 			_.bindAll(
	 				this,
	 				'setPosition',
	 				'setMarker',
	 				'getGeoposition'
	 			);

				this.get('callbacks').setPosition = this.setPosition;

			}

			/**
			* Get the user geolocation and triggers a callback after that
			*
			*/
		,	getGeoposition: function( notificationCallback ) {

				var _this = this;

				if ( navigator.geolocation ) {
					
					navigator.geolocation.getCurrentPosition( _this.get('callbacks').setPosition, function(){ alert( 'error!' ); } );

				} else {
					
					if( typeof notificationCallback == 'function' )
						return notificationCallback.call();
				}
			}


		,	setPosition: function(position){

				this.set('center', new google.maps.LatLng( position.coords.latitude, position.coords.longitude ));
			}

		,	setMarker: function( map ){

				this.set('marker', new google.maps.Marker({
					position: this.get('center'),
					map: map,
					title: 'Hello World!'
				}));
			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);