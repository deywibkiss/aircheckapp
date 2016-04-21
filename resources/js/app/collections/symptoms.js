( function( $, window, document, app ){

	'use-strict';

 	app.collections.symptoms = Backbone.Collection.extend({

 			urlRoot: apiURL + "report/symptom"

 		,	url: apiURL+ "report/symptom"

 		,	model: app.models.report

 		,	filters: []

 		,	initialize: function( models ){

 				// Bind collection events
	 			this.on( 'sync', function( collection, response ){

	 				console.log(collection);
	 				console.log(response);

                });

 			}


 		,	validate: function(){

 				if( this.length <= 0 )
 					return false;
 				
 				return true;
 			}

 	});


 })(jQuery, this, this.document, window.Aircheck.app, undefined);