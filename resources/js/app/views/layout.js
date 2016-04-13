/*
 |--------------------------------------------------------------------------
 | Layout View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of layout UI
 |
 |
 */
 ( function( $, window, document, app ){

 	var LayoutView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 				'click #toggle-menu-button': 'toggleMenu',
 				'click #toggle-report-menu-button': 'toggleReportMenu'
 			}


 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'toggleMenu'
	 			);
 			}


 		,	toggleMenu: function( e ){
 				
 				$('#aircheck-menu-aside').toggleClass('active');
 			}

 		,	toggleReportMenu: function(e){

 				$('#aircheck-report-menu').toggleClass('active');
 			}

 	});


 	app.views.layout = new LayoutView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);