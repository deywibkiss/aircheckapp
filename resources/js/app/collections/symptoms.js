( function( $, window, document, app ){

	'use-strict';

 	app.collections.symptoms = Backbone.Collection.extend({

 			urlRoot: apiURL + "report/symptoms"

 		,	url: apiURL+ "report/symptoms"

 		,	model: app.models.report

 		,	filters: []

 		,	initialize: function( models ){

 			}


 		,	validate: function(){

 				if( this.length <= 0 )
 					return false;
 				
 				return true;
 			}

 	});


 })(jQuery, this, this.document, window.Aircheck.app, undefined);