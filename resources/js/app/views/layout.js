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
	 				'toggleMenu',
	 				'panReportMenu',
	 				'swipeHideMenu'
	 			);

	 			this.panReportMenu();
	 			this.swipeHideMenu();
 			}


 		,	toggleMenu: function( e ){
 				
 				$('#aircheck-menu-aside').toggleClass('active');
 			}

 		,	toggleReportMenu: function(e){

 				$('#aircheck-report-menu').toggleClass('active');
 			}

 		,	panReportMenu: function(){
 				
 				var reportButton = document.getElementById('aircheck-report-menu');

 				// create a simple instance
 				// by default, it only adds horizontal recognizers
 				var mc = new Hammer(reportButton);

 				// let the pan gesture support all directions.
 				// this will block the vertical scrolling on a touch-device while on the element
 				mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

 				// listen to events...
 				mc.on("panup", function(ev) {
 				    $('#aircheck-report-menu').addClass('active');
 				});

 				mc.on("pandown", function(ev) {
 				    $('#aircheck-report-menu').removeClass('active');
 				});

 			}

 		,	swipeHideMenu: function(){
 				var menu = document.getElementById('aircheck-menu-aside');

 				// create a simple instance
 				// by default, it only adds horizontal recognizers
 				var mc = new Hammer(menu);

 				// let the pan gesture support all directions.
 				// this will block the vertical scrolling on a touch-device while on the element
 				mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

 				// listen to events...
 				mc.on("swipeleft", function(ev) {
 				    $('#aircheck-menu-aside').removeClass('active');
 				});
 			}

 	});


 	app.views.layout = new LayoutView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);