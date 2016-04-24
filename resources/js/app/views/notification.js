/*
 |--------------------------------------------------------------------------
 | Notification View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI of notifications
 |
 |
 */
 ( function( $, window, document, app, helper ){

 	var NotificationView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 			}

 		,	model: new app.models.notification

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'renderSymptom',
	 				'showNotification'
	 			);
 			}

 			/**
 			* Shows the login page
 			*
 			*/
 		,	renderSymptom: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'notifications/symptoms.ejs'}).render({});
 				
 				return html;
 			}

 		,	showNotification: function(e){

 				e.preventDefault();

 				var notification = this.renderSymptom();

 				setTimeout( function(){
 					notifications.append(notification);
 				}, 1000);
 			}

 	});


 	app.views.user = new NotificationView();


 })(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);