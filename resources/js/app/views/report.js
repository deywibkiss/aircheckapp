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
 				'click .show-level-button': 'showLevels',
 				'click .set-level-button': 'setLevel',
 				'click #save-report-button': 'save',
 				'click #cancel-report-button': 'cancel'
 			}

 		,	model: new app.models.report

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'save',
	 				'cancel',
	 				'showPollutionLayers',
	 				'showSymptomsLayers',
	 				'showLevels',
	 				'setLevel'
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

 		,	showLevels: function(e){
 				e.preventDefault();

 				// set other attributes
 				var _this = this
 				,	type = $(e.currentTarget).data('type')
 				,	subtype = $(e.currentTarget).data('subtype')
 				,	user = localStorage.getItem('_id');

 				this.model.set({ type: type, subtype: subtype, user: user });

 				var levels = new EJS({url: templatePath + 'report/levels.ejs'}).render();

 				submenu.html(levels);

 			}


 		,	setLevel: function(e){

 				e.preventDefault();

 				// Reset active
 				$('.set-level-button').removeClass('active');
 				$(e.currentTarget).addClass('active');

 				var level = $(e.currentTarget).data('level');
 				this.model.set('level', level );

 				console.log( this.model.attributes );
 			}


 		,	save: function(e){

 				e.preventDefault();

 				var _this = this;

 				var location = new app.models.location();
 				location.get('callbacks').setPosition = function(position){

 					_this.model.set('location', {
 						latitude: position.coords.latitude,
 						longitude: position.coords.longitude
 					});

 					_this.model.save(_this.model.attributes,{
 						success: _this.onSuccessSave,
 						error: _this.onError
 					});
 				}

 				location.getGeoposition();
 			}

 		,	cancel: function(e){
 				e.preventDefault();

 				this.model.clear().set(this.model.defaults);

 				app.views.layout.setDefaultMenu();
 			}

 		,	onSuccessSave: function( model, response, options ){

 				app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

 				alert('Thank you for your report');
 			}

 	});


 	app.views.report = new ReportView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);