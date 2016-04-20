/*
 |--------------------------------------------------------------------------
 | Report View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of reports
 |
 |
 */
 ( function( $, window, document, app ){

 	var ReportView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 				'click #report-button': 'showPollutionLayers',
 				'click #symptoms-button': 'showSymptomsLayers',
 				'click .report-air-button': 'save'
 			}

 		,	model: new app.models.report

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'save',
	 				'showPollutionLayers',
	 				'showSymptomsLayers'
	 			);
 			}


 		,	showPollutionLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'report/pollution-layers.ejs'}).render();

 				submenu.html(layers);
 			}

 		,	showSymptomsLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'report/symptoms-layers.ejs'}).render();

 				submenu.html(layers);
 			}


 		,	save: function(e){

 				e.preventDefault();

 				// Get the type
 				var _this = this
 				,	type = $(e.currentTarget).data('type')
 				,	subtype = $(e.currentTarget).data('subtype')
 				,	user = localStorage.getItem('_id');

 				this.model.set({ type: type, subtype: subtype, user: user });

 				var location = new app.models.location();
 				location.get('callbacks').setPosition = function(position){

 					_this.model.set('location', {
 						latitude: position.coords.latitude,
 						longitude: position.coords.longitude
 					});

 					_this.model.save();
 				}

 				location.getGeoposition();
 			}

 	});


 	app.views.report = new ReportView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);