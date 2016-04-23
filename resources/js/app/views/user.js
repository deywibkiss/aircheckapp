/*
 |--------------------------------------------------------------------------
 | User View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of user
 |
 |
 */
 ( function( $, window, document, app, helper ){

 	var UserView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {

 				'click #register-profile-button': 'register',
 				'click #logout-button': 'logout'
 			}


 		,	registerForm: '#user-profile-register-form'

 		,	model: new app.models.user

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'renderRegisterForm',
	 				'renderLogout',
	 				'onSaveSuccess'
	 			);
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	renderRegisterForm: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/form-register.ejs'}).render({});
 				content.html(html);

 			}

 			/**
 			* Shows the logout page
 			*
 			*/
 		,	renderLogout: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/logout.ejs'}).render({});
 				content.html(html);

 			}

 		,	logout: function(e){

 				e.preventDefault();

 				localStorage.removeItem('_id');

 				app.routers.user.navigate('user/register', {trigger: true});
 			}

 		,	register: function(e){
 				e.preventDefault();

 				var _this = this;

 				var data = helper.formToJson( this.registerForm );

 				this.model.set( data );

 				this.model.save(this.model.attributes, {
 					success: _this.onSaveSuccess,
 					error: _this.onSaveError
 				});

 			}

 		,	onSaveSuccess: function(model, response, options){

 				$(this.registerForm)[0].reset();

 				var user = this.model.toJSON();

 				// Save the user in local storage
 				localStorage.setItem('_id', user._id);

 				// Navigate to main route
 				app.routers.main.navigate("", {trigger: true});
 			}

 		,	onSaveError: function(){
 				console.log('error');
 			}

 	});


 	app.views.user = new UserView();


 })(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);