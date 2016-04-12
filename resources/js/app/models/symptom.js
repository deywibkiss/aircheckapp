( function($, window, document, app ){
	

	'use-strict';

	app.models.symptom = Backbone.Model.extend({

			urlRoot: apiURL + "symptom"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				name: ''
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( 'sync', function( model, options ){
					if( options.action != 'deleted' ){
						window.AdvisersView.fillEditForm( model );
					}
				});

				this.on( "invalid", this.onInvalid, this );

				misc.getLocalLang( 'user', this );

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