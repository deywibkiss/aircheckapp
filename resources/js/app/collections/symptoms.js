( function( $, window, document, app ){

	'use-strict';

 	app.collections.symptoms = Backbone.Collection.extend({

 			urlRoot: apiURL + "symptoms"

 		,	url: apiURL+ "symptoms"

 		,	model: app.models.symptom

 		,	filters: []

 		,	initialize: function( models ){

 				// Bind collection events
	 			this.on( 'sync', function( collection, response ){

	 				if ( collection instanceof Backbone.Collection ){

		 				var models = [];

	                    $.each( response.creditos, function( key, value ){

	                        var model = new credito( value );

	                        models.push( model );
	                    });

	                    collection.reset( models );
	                    collection.customer = response.customer;
	                    window.CreditoView.customer = new customer(response.customer);
	                    
	                    window.CreditoView.renderList( collection );
	 				}

                });

                this.on( 'modelchanged', function( collection ){

                	window.CreditosView.renderList( collection );
                });

 			}


 		,	validate: function(){

 				if( this.length <= 0 )
 					return false;


 				return true;
 			}


 		,	filterState: function( state ){

 				var filtered = _.filter( this.models, function( model ){

 					if( model.get( 'estado_credito_id' ) == state )
 						return model;
 				});

 				return filtered;
 			}

 	});


 })(jQuery, this, this.document, window.Aircheck.app, undefined);