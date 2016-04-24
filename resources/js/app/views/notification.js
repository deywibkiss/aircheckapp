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
 				'click #notification-icon': 'show',
 				'click .notification': 'hide'
 			}


 		,	messages: {
 				"fire": "Many fires occur in the area, avoid transit through this place",
 				"traffic": "Much traffic congestion, can cause inflammation of the airways",
 				"dust": "Intermediate risk. Do not inhale gases released. Use respiratory protection. Maintain a safe distance.",
 				"smoke": "It is located in an area with high content of CO2 and NO2, No permanecer en la zona más de 1 hora.",
 				"drowning": "It is in a risk zone (high CO2 content, high content of NO2). Get out as soon as posible "
 			}

 		,	model: new app.models.notification

 		,	count: 0

 		,	notifications: []

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
 		,	renderSymptom: function(message){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'notifications/symptoms.ejs'}).render({
 					message: message
 				});
 				
 				return html;
 			}

 		,	showNotification: function(message){


 				var notification = this.renderSymptom(message);

 				setTimeout( function(){
 					notifications.append(notification);
 				}, 1000);
 			}

 		,	validateAndShow: function( data ){

 				var _this = this;

 				_.each( data, function(item, index){
 					if(item.subtype){

 						if(item.count > 8 ){
 							_this.count++;
 							_this.notifications.push(_this.messages[item.subtype]);

 						}

 					}
 				});

 				if(_this.count > 0)
 					$('.notification-count').text(_this.count).show();


 			}

 		,	show: function(){
 				var _this = this;

 				_.each(this.notifications, function(message, index){
 					_this.showNotification( message );
 				});

 				_this.count = 0;
 				$('.notification-count').text(0).hide();
 			}

 		,	hide: function(){
 				notifications.html('');
 			}


 		,   get: function(){

 				var _this = this;

                $.get(apiURL + 'stadistic', function(response){

                    _this.validateAndShow(response);
                });
            }

 	});


 	app.views.notification = new NotificationView();


 })(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);