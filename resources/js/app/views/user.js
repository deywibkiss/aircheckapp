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

 	var UserView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 			}

 		,	model: new app.models.user

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'renderUpdateForm'
	 			);
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	renderUpdateForm: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/form-update.ejs'}).render({});
 				content.html(html);

 			}

 	});


 	app.views.user = new UserView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);