/**
* Global app
*
*/

// Static
var apiURL = 'http://localhost:3001';
var templatePath = 'js/templates/';
var content = $('#aircheck-main-content');


window.Aircheck = {};

window.Aircheck.app = {
	collections: {},
	models: {},
	views: {},
	routers: {}
};

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
( function($, window, document, app ){
	

	'use-strict';

	app.models.symptom = Backbone.Model.extend({

			urlRoot: apiURL + "symptom"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				name: ''
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( 'sync', function( model, options ){
					if( options.action != 'deleted' ){
						window.AdvisersView.fillEditForm( model );
					}
				});

				this.on( "invalid", this.onInvalid, this );

				misc.getLocalLang( 'user', this );

			}

		,	validate: function( attrs, options ){

				this.errors = [];

				misc.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
( function($, window, document, app ){
	

	'use-strict';

	app.models.location = Backbone.Model.extend({

			urlRoot: apiURL + "location"

		,	idAttribute: "_id"

		,	geoCodingKey: 'AIzaSyAr9JaJNwAqeHGkLUr2qq-Quo1xAK8FLG4'

		,	defaults: {
				_id: null,
				center: null,
				marker: null,
				callbacks: {
					click: null,
					setPosition: this.setPosition,
					render: null
				}
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				// Bind all events so this variable could
	 			// be the model in function scopes
	 			_.bindAll(
	 				this,
	 				'setPosition',
	 				'setMarker',
	 				'getGeoposition'
	 			);

				this.get('callbacks').setPosition = this.setPosition;

			}

			/**
			* Get the user geolocation and triggers a callback after that
			*
			*/
		,	getGeoposition: function( notificationCallback ) {

				var _this = this;

				if ( navigator.geolocation ) {
					
					navigator.geolocation.getCurrentPosition( _this.get('callbacks').setPosition, function(){ alert( 'error!' ); } );

				} else {
					
					if( typeof notificationCallback == 'function' )
						return notificationCallback.call();
				}
			}


		,	setPosition: function(position){

				this.set('center', new google.maps.LatLng( position.coords.latitude, position.coords.longitude ));
			}

		,	setMarker: function( map ){

				this.set('marker', new google.maps.Marker({
					position: this.get('center'),
					map: map,
					title: 'Hello World!'
				}));
			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
( function($, window, document, app ){
	

	'use-strict';

	app.models.user = Backbone.Model.extend({

			urlRoot: apiURL + "user"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				key: null,
				name: '',
				age: 18,
				email: '',
				picture: 'users/default.jpg',
				symptoms: new app.collections.symptoms,
				location: new app.models.location
			}

		,	required: [
				'name',
				'age',
				'email'
			]

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){

				this.errors = [];

				misc.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
( function($, window, document, app ){
	

	'use-strict';

	app.models.reportType = Backbone.Model.extend({

			urlRoot: apiURL + "reportType"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				name: ''
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){

				this.errors = [];

				misc.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
( function($, window, document, app ){
	

	'use-strict';

	app.models.report = Backbone.Model.extend({

			urlRoot: apiURL + "report"

		,	idAttribute: "_id"

		,	defaults: {
				_id: null,
				type: new app.models.reportType,
				user: new app.models.user,
				location: new app.models.location,
				timestamp: null
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){

				this.errors = [];

				misc.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
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
/*
 |--------------------------------------------------------------------------
 | User View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of user
 |
 |
 */
 ( function( $, window, document, app ){

 	var MapView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 			}

 		,	model: new app.models.location

 		,	map: null

 		,	canvas: $('#map-canvas')[0]

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'render'
	 			);

				this.model.on("change:center", this.render, this);
 				this.model.get('callbacks').click = this.click;
 			}


 		,	setCanvas: function( callback ){
 				var html = new EJS({ url: templatePath + 'map/default.ejs'}).render({});
 				content.html(html);

 				if( typeof callback == 'function')
 					callback.call();
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	render: function(){

				this.map = new google.maps.Map( this.canvas, {
					center: this.model.get('center'),
					zoom: 17
				});

				this.model.setMarker( this.map );

 			}

 		,	click: function(e){

 			}

 	});


 	app.views.map = new MapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);
/*
 |--------------------------------------------------------------------------
 | User View
 |--------------------------------------------------------------------------
 |
 | Allows to control de GUI interaction of user
 |
 |
 */
 ( function( $, window, document, app ){

 	var UserView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {
 			}

 		,	model: new app.models.user

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'renderUpdateForm'
	 			);
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	renderUpdateForm: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/form-update.ejs'}).render({});
 				content.html(html);

 			}

 	});


 	app.views.user = new UserView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);
/*
 |--------------------------------------------------------------------------
 | Map Router
 |--------------------------------------------------------------------------
 |
 | Allows to control de URL routes and triggers specific functions
 | in the map interface
 |
 |
 */
( function( $, window, document, app ){

    var MapRouter = Backbone.Router.extend({

            /**
            * Define the user routes
            *
            */
            routes: {
                "map": "renderMap"
            }

        ,   initialize: function(){

            }

        ,   renderMap: function(){

                app.views.map.setCanvas( function(){
                    app.views.map.model.getGeoposition();
                });
            }

    });


    app.routers.map = new MapRouter();


})( jQuery, this, this.document, window.Aircheck.app, undefined );
/*
 |--------------------------------------------------------------------------
 | User Router
 |--------------------------------------------------------------------------
 |
 | Allows to control de URL routes and triggers specific functions
 | in the login interface
 |
 |
 */
( function( $, window, document, app ){

    var UserRouter = Backbone.Router.extend({

            /**
            * Define the user routes
            *
            */
            routes: {
                "": "renderUpdateForm"
            }

        ,   initialize: function(){

            }

        ,   renderUpdateForm: function(){

                app.views.user.renderUpdateForm();
            }

    });


    app.routers.user = new UserRouter();

    Backbone.history.start();


})( jQuery, this, this.document, window.Aircheck.app, undefined );