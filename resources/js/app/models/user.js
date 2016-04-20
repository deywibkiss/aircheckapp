( function($, window, document, app, helper ){
	

	'use-strict';

	app.models.user = Backbone.Model.extend({

			urlRoot: apiURL + "user"

		,	idAttribute: "_id"

		,	defaults: {
				name: '',
				age: 18,
				email: '',
				picture: 'users/default.jpg',
				symptoms: new app.collections.symptoms,
				location: new app.models.location
			}

		,	required: [
				'name',
				'age',
				'email',
				'location'
			]

		,	errors: []

		,	errorMessages: {
				'fieldsRequired': 'Todos los campos son requeridos para el registro',
				'invalidEmail': 'El email es incorrecto',
				'invalidAge': 'La edad debe ser sólo números'
			}

		,	initialize: function(){

				// Bind all functions so this variable could
				// be the model in function scopes
				_.bindAll(

					this,
					'setLocation'
				);

				this.on( "invalid", this.onInvalid, this );

				this.get('location').get('callbacks').setPosition = this.setLocation;
				this.get('location').getGeoposition();


			}

		,	validate: function( attrs, options ){

				this.errors = [];

				helper.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && helper.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';

				if( this.get( 'age' ) != '' && helper.isNumeric( this.get( 'age' ) ) == false )
					return 'invalidAge';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.errorMessages[error] );

			}

		,	setLocation: function(position){

				// Set position in json format
				this.get('location').set('center', {lat: position.coords.latitude, lng: position.coords.longitude});
			}

	});

})(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);