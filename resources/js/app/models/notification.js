( function($, window, document, app ){
	

	'use-strict';

	app.models.notification = Backbone.Model.extend({

			urlRoot: apiURL + "notification"

		,	idAttribute: "_id"

		,	defaults: {
				type: '',
				message: null,
				info: ''
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){


			}

		,	onInvalid: function( model, error ){

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);