( function($, window, document, app ){
	

	'use-strict';

	app.models.report = Backbone.Model.extend({

			urlRoot: apiURL + "report"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				type: new app.models.reportType,
				user: new app.models.user,
				location: new app.models.location,
				timestamp: null
			}

		,	required: []

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