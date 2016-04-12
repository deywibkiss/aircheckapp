( function($, window, document, app ){
	

	'use-strict';

	app.models.user = Backbone.Model.extend({

			urlRoot: apiURL + "user"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				key: null,
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
				'email'
			]

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){

				this.errors = [];

				misc.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);