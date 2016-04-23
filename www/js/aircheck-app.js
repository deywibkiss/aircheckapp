/**
* Global app
*
*/

// Static
var apiURL = 'http://aircheck.cloudapp.net:8080/';
var templatePath = 'js/templates/';
var imagePath = 'img/';
var content = $('#aircheck-main-content');
var submenu = $('#aircheck-report-submenu');
var sublayers = $('#aircheck-sublayers');


window.Aircheck = {};

window.Aircheck.app = {
	helpers: {},
	collections: {},
	models: {},
	views: {},
	routers: {}
};

/*
 |--------------------------------------------------------------------------
 | Miscelaneous
 |--------------------------------------------------------------------------
 |
 | A collection of misc functions
 |
 | @author: Brian Serrano Satizabal.
 | @author-email: deywibkiss@gmail.com
 | @created-at: Feb-17-2015
 |
 */
 ( function( $, window, document, app, templateEngine ){

 	var Misc = function(a){

 		this.notificationsTime = 6000;
 	};

 	Misc.prototype = {

	 		/**
	 		* Function that initializes others when DOM is ready
	 		*
	 		*/
	 		initialize: function(){

	 			this.toggleAllCheckbox();

	 			// TODO: Remove this line in production
	 			templateEngine.config({cache: false});

	 			// Backbone custom functions
	 			this.addModelReset();
	 			this.addCollectionFilter();
	 		}

	 		/**
			 *  Serialize form into json format
			 *  
			 *  @param { string } name class or id of the html element to embed the loader
			 *  @return { object } form into json
			 *  
			 */
		,	formToJson: function( selector ){
			
				var o = {};
			    var a = $( selector ).serializeArray()
			    

			    $( selector + ' input:disabled').each(function () { 
		            a.push({ name: this.name, value: $(this).val() });
		        });
			    
			    $.each( a, function() {
			        if ( o[ this.name ] !== undefined ) {
			            if ( ! o[this.name].push ) {
			                o[ this.name ] = [ o[ this.name ] ];
			            }
			            
			            o[ this.name ].push( this.value || '' );
			            
			        } else {
			            o[ this.name ] = this.value || '';
			        }
			    });

			    $( selector + ' input[type="checkbox"]').each(function ( key, value ) {

		        	var chs = {};

		        	if( $( value ).is( ':checked' ) ){

		        		chs[ $( value ).attr( 'name' ) ] = 1;
		        	} else {
		        		chs[ $( value ).attr( 'name' ) ] = 0;
		        	}

		            o = $.extend( o, chs );
		        });
			    
			    return o;	
				
			}

			/**
	         * Helps in the process of making a ajax requests
	         *
	         * @param { object } Options for configuring the ajax request
	         * @param { object } data object to be sent
	         */
		,	ajaxHandler: function( options, data ) {
	
				var result
				,   defaults = {
						type: 'post'
					,   url: 'index.php'
					,   data: data
					,   async: false
					,	dataType: 'json'
					,	beforeSend: function(request) {
						    return request.setRequestHeader("X-CSRF-Token", $("meta[name='token']").attr('content'));
						}
					,   success: function( data ) {
							result = data;
						}

					,   error: function ( XMLHttpRequest, textStatus, errorThrown ) {
							console.log( "error :" + XMLHttpRequest.responseText );
						}
				}
	
				// Merge defaults and options
				options = $.extend( {}, defaults, options );

				// Do the ajax request
				$.ajax( options );

				// Return the response object
				return result;
	
	        }

	    	/**
            * Given an array of required fields, this function
            * checks whether the second argument have them
            */
        ,   validateEmptyFields: function( required, objectData, errors ) {


                $.each( required, function( key, value ) {

                    if ( objectData[ value ] == null || objectData[ value ] == "" ) {

                        errors.push( value );

                    }

                });

                return errors;

            }


            /**
            * Check whether an string is a correct email
            * @param { str } String to test
            * @return { bool }
            */
        ,   isEmail: function( string ) {

                var emailExpression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                return emailExpression.test( string );
            }

            /**
			*
			* Validate only numbers
			* @param { string } the string to validate
			* 
			*/
		,	isNumeric: function( value ){

				var pattern = /^\d+$/
				, 	exp = new RegExp( pattern );


				if( typeof value == 'undefined' )
					return false;


				return exp.test( value );

			}

			/**
			*
			* Validate decimal numbers with a precisition of two digits
			* @param { string } the string to validate
			* 
			*/
		,	isDecimal: function( value ){

				var pattern = /^\d+(\.\d{1,2})?$/
				, 	exp = new RegExp( pattern );


				if( typeof value == 'undefined' )
					return false;


				return exp.test( value );
			}

	        /**
	        * Send CSRF Authentication in ajax requests
	        * when user clicks on toggle-all checkbox
	        *
	        * param { object } the ajax request object
	        * @return { string } the request with the token added
	        */
	    ,	sendAuth: function( request ){

	    		console.log( request );

	    		//return request.setRequestHeader("X-CSRF-Token", $("meta[name='token']").attr('content'));

	    	}

	        /**
	        * Checks or unchecks all checkboxes of a group
	        * when user clicks on toggle-all checkbox
	        *
	        * return { void }
	        *
	        */
	    ,	toggleAllCheckbox: function(){

	    		$( document ).on( 'click', '.toggle-all-checkbox', function( e ){

	    			var checksName = $( this ).data( 'checks' );

	    			if( $( this ).is( ':checked' ) )
	    				$( 'input[name="' + checksName + '"]' ).prop('checked', true);
	    			else
	    				$( 'input[name="' + checksName + '"]' ).prop('checked', false);
	    		});
	    	}


 			/**
 			* Shows a notification
 			*
 			* @parameter { object } options like type, title, message, time, callback
 			* @return void
 			*
 			*/
 		,	showGlobalNotification: function( options ){

 				$( '.global-notification' ).removeClass( 'error success warning' );
 				$( '.global-notification' ).addClass( options.type );

 				$( '.global-notification .header' ).text( options.title );
 				$( '.global-notification .body' ).text( options.message );

 				$( '.global-notification' ).slideDown();

 				if( options.time == 0 )
 					return;

 				setTimeout( function(){

 					if( typeof options.callback == 'function' )
 						options.callback.call();

 					$( '.global-notification' ).slideUp();

 				}, options.time );

 			}

 			/**
 			* Closes a notification
 			*
 			* @parameter { object } options like type, title, message, time, callback
 			* @return void
 			*
 			*/
 		,	closeGlobalNotification: function( options ){

 				$( '.close-notification-button' ).click( function(e){

 					e.preventDefault();

 					$( '.global-notification' ).fadeOut();
 				});

 			}

 			/**
 			* Sends a notification to the user in the desktop
			* 
			* 
			*/
 		,	sendNotification: function( title, message ){

 				if (!("Notification" in window))
 					return false;

				// Let's check if the user is okay to get some notification
				if (Notification.permission === "granted") {
					// If it's okay let's create a notification
					var notification = new Notification( title, {
						body: message,
						icon: imagesUrl + 'images/gerencialogo.png'
					});

					setTimeout( function(){ notification.close(); }, this.notificationsTime );
				}

				// Otherwise, we need to ask the user for permission
				else if ( Notification.permission !== 'denied' ) {
					Notification.requestPermission(function (permission) {
					  // If the user is okay, let's create a notification
					  if (permission === "granted") {
					    
					    // If it's okay let's create a notification
						var notification = new Notification( title, {
							body: message,
							icon: imagesUrl + 'images/gerencialogo.png'
						});

						setTimeout( function(){ notification.close(); }, this.notificationsTime );
					  }
					});
				}
 			}

 			/**
 			* Shows a dialog box and triggers two
 			* functionswhen user takes a
 			* decision
 			* 
 			* @param { object } the options:
 			* { title, message, button1, button2, callback1, callback2 }
 			*
 			* @return { void }
 			*
 			*/
 		,	dialogBox: function( options ){

 				var _this = this;

 				// Set texts
 				$( '.dialog-box .header' ).text( options.title );
 				$( '.dialog-box .body' ).text( options.message );
 				$( '.dialog-box .dialog-button-1' ).text( options.button1 );
 				$( '.dialog-box .dialog-button-2' ).text( options.button2 );

 				$( '.g-overlay' ).fadeIn();
 				$( '.dialog-box' ).slideDown();

 				//if user clicks on button 1
 				$( '.dialog-box .dialog-button-1' ).click( function( e ){

 					e.preventDefault();

 					options.callback1.call();

 					_this.closeDialogBox();
 				});

 				//if user clicks on button 2
 				$( '.dialog-box .dialog-button-2' ).click( function( e ){

 					e.preventDefault();

 					if( typeof options.callback2 != 'undefined' ){
 						options.callback2.call();
 						_this.closeDialogBox();
 					}

 					_this.closeDialogBox();
 				});
 			}

 			/**
 			* Closes a dialog box
 			*
 			* @return void
 			*
 			*/
 		,	closeDialogBox: function(){

 				$( '.g-overlay' ).fadeOut();
 				$( '.dialog-box' ).fadeOut();
 				
 				// Unset texts
 				$( '.dialog-box .header' ).text( '' );
 				$( '.dialog-box .body' ).text( '' );
 				$( '.dialog-box .dialog-button-1' ).text( '' );
 				$( '.dialog-box .dialog-button-2' ).text( '' );

 			}

 			/**
 			* Shows a modal window and triggers a
 			* functions callback
 			* 
 			* @param { object } the options:
 			* { title, template, data, css, callback }
 			*
 			* @return { void }
 			*
 			*/
 		,	modalWindow: function( options ){

 				var _this = this;

 				// Set styles
 				if( ! _.isUndefined( options.css ) )
 					$( '.g-modal-window' ).css( options.css );

 				// Set texts
 				$( '.g-modal-window .header' ).text( options.title );

 				// Set template
 				var html = new templateEngine({ url: options.template }).render(options.data);
 				$( '.g-modal-window .body' ).html( html );

 				$( '.g-overlay' ).fadeIn();
 				$( '.g-modal-window' ).slideDown();

 				//if user sends a callback
				if( typeof options.callback == 'function' ){
					options.callback.call();
				}

				$( '#close-modal-button' ).on( 'click', _this.closeModalWindow);
 			}

 			/**
 			* Closes a modal window
 			*
 			* @return void
 			*
 			*/
 		,	closeModalWindow: function(){

 				$( '.g-overlay' ).fadeOut();
 				$( '.g-modal-window' ).fadeOut();
 				
 				// Unset texts
 				$( '.g-modal-window .header' ).text( '' );
 				$( '.g-modal-window .body' ).html( '' );

 			}

 			/**
 			* Closes the dropzone uploader
 			*
 			* @return void
 			*/
 		,	closeDropzone: function(){

 				$( document ).ready( function(){

 					$( '.g-overlay' ).click( function( e ){

 						$( '.g-overlay' ).fadeOut();
 						$( '.dialog-box' ).fadeOut();
 						$( '.g-modal-window' ).fadeOut();
 						$( '.dropzone' ).fadeOut();
 					});

 				});
 			}


 			/**
 			* Filters list elements in a list by given term
 			*
 			* @return void
 			*
 			*/
 		,	filterList: function( options ){

 				// Get names
				$( options.elements ).find( options.items ).each( function( key, val ) {

					var title = $( this ).find( options.titleSel ).text();

					reg = new RegExp( options.term, "i" );

					if ( ! reg.test( title ) ) {
						$( this ).hide();
					}
					else {
						$( this ).show();
					}
				});

 			}

 			/**
 			* Paint invalid inputs
 			*
 			* @return void
 			*
 			*/
 		,	showInvalidInputs: function( errors, form ){

 				$.each( errors, function( key, value ){
					$( form + ' input[name="' + value + '"]' ).parent( '.form-group' ).addClass( 'has-error' );
				});
 			}


 			/**
			* Searches an object into an array by key
			*
			* @param { array } array of objects (haystack)
			* @param { string } the key to filter
			* @param { mixed } the value to filter (needle)
			* @return { mixed } false if it's not found, object or array of objects otherwise
			*
			*/
		,	searchObjectArray: function( array, key, value ){

				var i = 0;

				var result = $.grep( array, function( element, index ){

					if( element[key] == value ){

						i = index;

						return ( element[key] == value );
					}
				});


				if (result.length == 0) {
					return false;

				} else if (result.length == 1) {
					
					return {
						element: result[0],
						indexOf: i
					}

				} else {
				  
				  return result;
				}
			}

			/**
			* Deletes an object into an array by key value pair
			*
			* @param { array } array of objects (haystack)
			* @param { string } the key to filter
			* @param { mixed } the value to filter (needle)
			* @return { array } the same array without element
			*
			*/
		,	deleteObjectArray: function( array, key, value ){

				// Try to find the object in array
				var element = this.searchObjectArray( array, key, value );

				if( typeof element == 'object' )
					array.splice( element.indexOf, 1 );

				return array;
			}

			/**
			* Merge an object with another object in array
			* look for it by a key value given
			*
			* @param { array } array of objects (haystack)
			* @param { string } the key to filter
			* @param { mixed } the value to filter (needle)
			* 
			* @return { array } the same array with modified element
			*
			*/
		,	extendObjectArray: function( array, key, value, object ){

				// Try to find the object in array
				var result = this.searchObjectArray( array, key, value );

				if( typeof result == 'object' ){

					var newObject = $.extend( {}, result.element, object );

					array[ result.indexOf ] = newObject;

				}

				return array;
			}

			/**
			* Fills a form with an object data given
			*
			* @param { string } form selector
			* @param { object } the object data
			* @param { string } a child prefix to add to input name (e.g input[ name="prefix-name" ] )
			* 
			* @return { void }
			*
			*/
		,	fillForm: function( selector, object, prefix ){

				if( typeof prefix == 'undefined' )
					prefix = '';

				$.each( object, function( key, attr ){

 					//Checkboxes
 					if( $( selector + ' *[name="' + prefix + key + '"]' ).is( ':checkbox' ) ){

 						$( selector + ' *[name="' + prefix + key + '"]' ).prop( 'checked', Boolean( parseInt(attr) ) );
 					}

 					//Radios
 					else if( $( selector + ' *[name="' + prefix + key + '"]' ).is( ':radio' ) ){

 						$( selector + ' *[name="' + prefix + key + '"][value="' + attr + '"]' ).prop( 'checked', true );

 					} 

 					// Other inputs
 					else {
 						$( selector + ' *[name="' + prefix + key + '"]' ).val( attr );
 					}
 				});
			}

			/**
			* Disable or enable the inputs or controls from form
			*
			* @param { string } the form selector
			* @param { array } the array of input names to be coverted
			* @param { bool } true if disable, false to enable
			*
			*/
		,	enableInputs: function( selector, inputs, enable ){

				if( _.isUndefined( enable ) )
					enable = false;


				$.each( inputs, function( key, input ){

					$( selector + ' *[name="' + input + '"]' ).prop( 'disabled', enable );
				});
			}


			/**
			* Disable or enable the options from select element
			*
			* @param { string } the form selector
			* @param { array } the array of option values to be coverted
			* @param { bool } true if disable, false to enable
			*
			*/
		,	enableOptions: function( selector, values, enable ){

				if( _.isUndefined( enable ) )
					enable = false;


				$.each( values, function( key, value ){

					$( selector + ' option[value="' + value + '"]' ).prop( 'disabled', enable );
				});
			}

			/**
			* Prevents the submit form event
			*
			* @param { string } form selector
			* 
			* @return { void }
			*
			*/
		,	preventFormSubmission: function( selector ){

				return $( selector ).submit( function( e ){ e.preventDefault(); return false; });
			}

			/**
			* Converts a number to dot notation
			*
			* @param { numeric } the value to be converted
			* 
			* @return { string } the string with dot notation
			*
			*/
		,	numberToDots: function ( value ) {
				
				var parts = value.toString().split(".");

				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

				return parts.join(".");
			}


			/**
			* Initializes the icon dropdown (jQueryUI)
			*/
		,	initIconSelectMenu: function(){
				$.widget( "custom.iconselectmenu", $.ui.selectmenu, {
			      _renderItem: function( ul, item ) {
			        var li = $( "<li>", { text: item.label } );
			 
			        if ( item.disabled ) {
			          li.addClass( "ui-state-disabled" );
			        }
			 
			        $( "<span>", {
			          style: item.element.attr( "data-style" ),
			          "class": "jq-ui-icon " + item.element.attr( "data-class" )
			        })
			          .appendTo( li );
			 
			        return li.appendTo( ul );
			      },
			      width: '100%'
			    });
			}

			/**
			*
			*/
		,	cleanInput: function( button, input, callback ){

				$( document ).on( 'click', button, function( e ){
					e.preventDefault();
					$( input ).val( '' );

					if( typeof callback == 'function' )
						callback.call();
				});
			}

			/**
			* Set jQueryUI's datepicker widget to spanish locale language
			*/
		,	setDatepickerLanguage: function( lang ){

				$.datepicker.regional['es'] = {
					closeText: 'Cerrar',
					prevText: '<Ant',
					nextText: 'Sig>',
					currentText: 'Hoy',
					monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
					monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
					dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
					dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
					dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
					weekHeader: 'Sm',
					dateFormat: 'dd/mm/yy',
					firstDay: 1,
					isRTL: false,
					showMonthAfterYear: false,
					yearSuffix: ''
				};

				$.datepicker.setDefaults($.datepicker.regional['es']);
			}

			/**
			* Adds to Backbone model the hability to reset itself
			*
			*/
		,	addModelReset: function(){

				Backbone.Model.prototype.reset = function( data ){

					this.set(this.defaults);

					if( typeof data == 'object' )
						this.set(data);
				}
			}


		,	addCollectionFilter: function(){

				Backbone.Collection.prototype.filter = function( term ){

					var _this = this;
				
					var filtered = _.filter( this.models, function( model ){

						var reg = new RegExp( term, "i" )
						,	m = false
						,	test = false;



						$.each( _this.filters, function( key, f ){

							f = f.split( '.' );

							if( _.isArray( model.get( f[0] ) ) ){

								$.each( model.get(f[0]), function( _key, ob ){

									test = reg.test( model.get( f[0] )[_key][f[1]] );

									if ( test ) {
										m = true;
										return false;
									}

								});


							} else if( _.isObject( model.get( f[0] ) ) ){

								if( _.isObject( model.get( f[0] )[f[1]] ) )
									test = reg.test( model.get( f[0] )[f[1]][f[2]] );
								else
									test = reg.test( model.get( f[0] )[f[1]] );

							} else {
								
								test = reg.test( model.get( f[0] ) );

							}

							if ( test ) {
								m = true;
								return false;
							}

						});

						if( m )
							return model

					});

					return filtered;
				}
			}


			/**
			* Get all object data attributes by a prefix
			*
			* @param { object } the object to look for
			* @param { string } the prefix to filter on
			* @param { boolean } keep the prefix name or clear it in the result
			*
			* @return { object } the object with the properties filtered
			*
			*/
		,	dataByPrefix: function( data, prefix, clearPrefix ){

				var r = new RegExp("^"+prefix)
				, 	ob = { };

				for( var k in data ){

					if(r.test(k)){

						var attrName = k;

						if( clearPrefix )
							attrName = k.replace( prefix, '' );

						ob[attrName]=data[k];
					}
				}

				return ob;
			}


			/**
			* Increases a letter from the one passed
			*
			* @param { string } the char to increase
			* @return { string } the next chart from
			*/
		,	nextChar: function(c) {
			
				return String.fromCharCode(c.charCodeAt(0) + 1);
			}

			/**
			* Calculate the diff between two dates
			*
			*/
		,	diffDates: function( initDate, finalDate, period ){

				// Convert dates
				initDate = new Date( initDate );
				finalDate = new Date( finalDate );


				var diff = Math.floor(initDate.getTime() - finalDate.getTime());
			    var day = 1000 * 60 * 60 * 24;

			    var days = Math.floor(diff/day);
			    var weeks = Math.floor(days/8);
			    var months = Math.floor(days/31);
			    var years = Math.floor(months/12);

			    if( period == 'days' )
			    	return days;

			    if( period == 'weeks' )
			    	return weeks;

			    if( period == 'months' )
			    	return months;

			    if( period == 'years' )
			    	return years;

			    return days;

			}

			/**
			* Fixes a number to decimal value
			*
			* @param { numeric } the numeric value to convert on
			* @return { numeric } the decimal value or 0 if conversion fails
			*
			*/
		,	toDecimal: function( value, points ){

				if( _.isUndefined( points ) )
					points = 2;

				value = Number( value ).toFixed( points );

				if( isNaN( value ) )
					value = Number( 0 ).toFixed( points );

				value = parseFloat( value );

				return value;

			}


			/**
			* Closes when user clicks outside of an element
			*
			*/
		,	closeOnClickOut: function( selector ){

				$(document).mouseup(function (e) {
				    var container = $( selector );

				    if (!container.is(e.target) // if the target of the click isn't the container...
				        && container.has(e.target).length === 0) // ... nor a descendant of the container
				    {
				        container.hide();
				    }
				});
			}



 	};

 	app.helpers.main = new Misc();
 	app.helpers.main.initialize();
 	
 })( jQuery, this, this.document, window.Aircheck.app, EJS, undefined );
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
( function($, window, document, app, helper ){
	

	'use-strict';

	app.models.user = Backbone.Model.extend({

			urlRoot: apiURL + "user"

		,	idAttribute: "_id"

		,	defaults: {
				name: '',
				age: 18,
				email: '',
				symptoms: [],
				location: new app.models.location
			}

		,	required: [
				'name',
				'age',
				'email',
				'location'
			]

		,	errors: []

		,	errorMessages: {
				'fieldsRequired': 'Todos los campos son requeridos para el registro',
				'invalidEmail': 'El email es incorrecto',
				'invalidAge': 'La edad debe ser sólo números'
			}

		,	initialize: function(){

				// Bind all functions so this variable could
				// be the model in function scopes
				_.bindAll(

					this,
					'setLocation'
				);

				this.on( "invalid", this.onInvalid, this );

				this.get('location').get('callbacks').setPosition = this.setLocation;
				this.get('location').getGeoposition();


			}

		,	validate: function( attrs, options ){

				this.errors = [];

				helper.validateEmptyFields( this.required, attrs, this.errors );

				if( this.errors.length > 0 ){

					return 'fieldsRequired';
				}

				if( this.get( 'email' ) != '' && helper.isEmail( this.get( 'email' ) ) == false )
					return 'invalidEmail';

				if( this.get( 'age' ) != '' && helper.isNumeric( this.get( 'age' ) ) == false )
					return 'invalidAge';


			}

		,	onInvalid: function( model, error ){

				var _this = this;

				return alert( _this.errorMessages[error] );

			}

		,	setLocation: function(position){

				// Set position in json format
				this.set('location', {latitude: position.coords.latitude, longitude: position.coords.longitude});
			}

	});

})(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);
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
				type: '',
				subtype: '',
				user: null,
				location: {}
			}

		,	required: []

		,	errors: []

		,	initialize: function(){

				this.on( "invalid", this.onInvalid, this );

			}

		,	validate: function( attrs, options ){

				// this.errors = [];

				// misc.validateEmptyFields( this.required, attrs, this.errors );

				// if( this.errors.length > 0 ){

				// 	return 'fieldsRequired';
				// }

				// if( this.get( 'email' ) != '' && misc.isEmail( this.get( 'email' ) ) == false )
				// 	return 'invalidEmail';


			}

		,	onInvalid: function( model, error ){

				// var _this = this;

				// return alert( _this.lang[error] );

			}

	});

})(jQuery, this, this.document, window.Aircheck.app, undefined);
( function( $, window, document, app ){

	'use-strict';

 	app.collections.pollutions = Backbone.Collection.extend({

 			urlRoot: apiURL + "report/pollution"

 		,	url: apiURL+ "report/pollution"

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
( function( $, window, document, app ){

	'use-strict';

 	app.collections.reports = Backbone.Collection.extend({

 			urlRoot: apiURL + "report"

 		,	url: apiURL+ "report"

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
 				'click #toggle-report-menu-button': 'toggleReportMenu',
 				'click #back-button': 'clickBackButton'
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
	 			this.setDefaultMenu();
 			}

 		,	clickBackButton: function(e){
 				window.history.back();
 				this.setDefaultMenu();
 		}


 		,	toggleMenu: function( e ){
 				
 				$('#aircheck-menu-aside').toggleClass('active');
 			}


 		,	hideMenu: function(){
 				$('#aircheck-menu-aside').removeClass('active');	
 			}

 		,	toggleReportMenu: function(e){

 				$('#aircheck-report-menu').toggleClass('active');

 				if( sublayers.hasClass('active') )
 					sublayers.removeClass('active');
 			}

 		,	hideReportMenu: function(){
 				$('#aircheck-report-menu').removeClass('active');
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
 		, setDefaultMenu: function(){
 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'menu/default.ejs'}).render({});
 				submenu.html(html);
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
 				'click #map-button': 'showMapLayers',
 				'click #symptoms-subitems-button': 'showSymptomsLayers'
 			}

 		,	model: new app.models.location

 		,	pollutions: new app.collections.pollutions

 		,	symptoms: new app.collections.symptoms

 		,	map: null

 		,	bounds: new google.maps.LatLngBounds()

 		,	markers: []

 		,	canvas: $('#map-canvas')[0]

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'render',
	 				'renderPollutionMap',
	 				'renderSymptomsMap',
	 				'setMap',
	 				'setMarkers',
	 				'removeMarkers',
	 				'boundListener',
	 				'centerUser'
	 			);

 				this.boundListener();
 
 				// Pollutions collection
	 			this.pollutions.on( 'sync', this.renderPollutionMap);

 				// Symptoms collection
	 			this.symptoms.on( 'sync', this.renderSymptomsMap);
 			}


 		,	setCanvas: function( callback ){

 				if( $('#map-canvas').length <= 0 ){
	 				var html = new EJS({ url: templatePath + 'map/default.ejs'}).render({});
	 				content.html(html);
 				}

 				if( typeof callback == 'function')
 					callback.call();
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	render: function(){

 				this.setMap();
				this.setMarkers( this.pollutions );
				this.setMarkers( this.symptoms );

				this.model.get('callbacks').setPosition = this.centerUser;
				this.model.getGeoposition();
 			}


 		,	renderPollutionMap: function( collection, response ){

 				var _this = this;

 				this.setCanvas( function(){
	 				_this.setMap();
	 				_this.removeMarkers();
					_this.setMarkers( _this.pollutions );
					_this.model.get('callbacks').setPosition = _this.centerUser;
					_this.model.getGeoposition();
 				});


            }

		,	renderSymptomsMap: function( collection, response ){

				var _this = this;

 				this.setCanvas( function(){
	 				// Init map canvas
	 				_this.setMap();
	 				_this.removeMarkers();
					_this.setMarkers( _this.symptoms );
					_this.model.get('callbacks').setPosition = _this.centerUser;
					_this.model.getGeoposition();

 				});

           }

        ,	setMap: function(){

        		var _this = this;

 				// Init map canvas
 				if( _this.map == null ){
	 				_this.canvas = $('#map-canvas')[0];

					_this.map = new google.maps.Map( _this.canvas, {
						zoom: 5,
						center: _this.model.get('center')
					});
 				}
        	}


        ,	setMarkers: function( collection ){

        		var _this = this;

        		collection.each(function(report, index ){

        			var position = new google.maps.LatLng(
        				Number(report.get('location').latitude),
        				Number(report.get('location').longitude)
        			);

        			var image = new google.maps.MarkerImage(imagePath + 'pins/' + report.get('subtype') + '.svg',
    				null, null, null, new google.maps.Size(64,64));

        			_this.bounds.extend(position);

	        		var marker = new google.maps.Marker({
	        			position: position,
	        			map: _this.map,
	        			icon: image
	        		});

	        		_this.markers.push( marker );

	        		_this.map.fitBounds(_this.bounds);
        		});

        	}

        ,	removeMarkers: function(){

        		_.each( this.markers, function( marker, index ){
        			marker.setMap(null);
        		});

        		this.markers = [];
        	}

        ,	centerUser: function( position ){

        		var _this = this;

        		this.model.set('center', new google.maps.LatLng( position.coords.latitude, position.coords.longitude ));
        		var image = new google.maps.MarkerImage(imagePath + 'pins/user.svg',
    				null, null, null, new google.maps.Size(64,64));

        		var marker = new google.maps.Marker({
        			position: _this.model.get('center'),
        			map: _this.map,
        			icon: image
        		});

        		this.map.setCenter( this.model.get('center') );
        		this.map.setZoom(15);

        	}


 		,	showMapLayers: function(e){

 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/layers.ejs'}).render();

 				submenu.html(layers);
 			}

 		,	showSymptomsLayers: function(e){
 				e.preventDefault();
 				
 				// Show all the map layers
 				var layers = new EJS({url: templatePath + 'map/symptoms.ejs'}).render();

 				sublayers.html(layers);

 				sublayers.addClass('active');
 			}

 		,	boundListener: function(){

 				var _this = this;

 				if( _this.map )
	 				var boundListener = google.maps.event.addListener((_this.map), 'bounds_changed', function(event) {
				        this.setZoom(14);
				        google.maps.event.removeListener(_this.boundListener);
				    });
 			}

 	});


 	app.views.map = new MapView();


 })(jQuery, this, this.document, window.Aircheck.app, undefined);
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

 					_this.model.save(_this.model.attributes,{
 						success: _this.onSuccessSave,
 						error: _this.onError
 					});
 				}

 				location.getGeoposition();
 			}

 		,	onSuccessSave: function( model, response, options ){

 				app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

 				alert('Thank you for your report');
 			}

 	});


 	app.views.report = new ReportView();


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
 ( function( $, window, document, app, helper ){

 	var UserView = Backbone.View.extend({

 			el: $( 'body' )

 		,	events: {

 				'click #register-profile-button': 'register',
 				'click #logout-button': 'logout'
 			}


 		,	registerForm: '#user-profile-register-form'

 		,	model: new app.models.user

 		,	initialize: function(){

	 			// Bind all events so this variable could
	 			// be the view in function scopes
	 			_.bindAll(

	 				this,
	 				'renderRegisterForm',
	 				'renderLogout',
	 				'onSaveSuccess'
	 			);
 			}


 			/**
 			* Shows the login page
 			*
 			*/
 		,	renderRegisterForm: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/form-register.ejs'}).render({});
 				content.html(html);

 			}

 			/**
 			* Shows the logout page
 			*
 			*/
 		,	renderLogout: function(){

 				var _this = this;	

 				var html = new EJS({ url: templatePath + 'user/logout.ejs'}).render({});
 				content.html(html);

 			}

 		,	logout: function(e){

 				e.preventDefault();

 				localStorage.removeItem('_id');

 				app.routers.user.navigate('user/register', {trigger: true});
 			}

 		,	register: function(e){
 				e.preventDefault();

 				var _this = this;

 				var data = helper.formToJson( this.registerForm );

 				this.model.set( data );

 				this.model.save(this.model.attributes, {
 					success: _this.onSaveSuccess,
 					error: _this.onSaveError
 				});

 			}

 		,	onSaveSuccess: function(model, response, options){

 				$(this.registerForm)[0].reset();

 				var user = this.model.toJSON();

 				// Save the user in local storage
 				localStorage.setItem('_id', user._id);

 				// Navigate to main route
 				app.routers.main.navigate("", {trigger: true});
 			}

 		,	onSaveError: function(){
 				console.log('error');
 			}

 	});


 	app.views.user = new UserView();


 })(jQuery, this, this.document, window.Aircheck.app, window.Aircheck.app.helpers.main, undefined);
/*
 |--------------------------------------------------------------------------
 | Main Router
 |--------------------------------------------------------------------------
 |
 | Allows to control de URL routes
 |
 |
 */
( function( $, window, document, app ){

    var MainRouter = Backbone.Router.extend({

            /**
            * Define the main routes
            *
            */
            routes: {
                "": "validateUser"
            }

        ,   initialize: function(){

            }

        ,   validateUser: function(){

                if( ! localStorage.getItem('_id') )
                    this.navigate("user/register", {trigger: true});
                else
                    this.navigate("map", {trigger: true});

            }

    });


    app.routers.main = new MainRouter();


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
                "user/register": "renderRegisterForm",
                "user/logout": "renderLogout"
            }

        ,   initialize: function(){

            }

        ,   before: {
                'user/register': function(route){
                    if( localStorage.getItem('_id') != null ) {
                        this.navigate('user/logout', {trigger: true});
                        return false;
                    }
                },

                'user/logout': function(route){
                    if( ! localStorage.getItem('_id') ) {
                        this.navigate('user/register', {trigger: true});
                        return false;
                    }
                }

            }

        ,   renderRegisterForm: function(){

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();
                app.views.user.renderRegisterForm();
            }

        ,   renderLogout: function(){
                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();
                app.views.user.renderLogout();
            }

    });


    app.routers.user = new UserRouter();


})( jQuery, this, this.document, window.Aircheck.app, undefined );
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
                "map": "renderMap",
                "map/pollution": "renderMapPollution",
                "map/symptoms": "renderMapSymptoms",
            }

        ,   initialize: function(){
            }

        ,   before: function(){

                if( ! localStorage.getItem('_id')){
                    app.routers.user.navigate('user/register', {trigger: true});
                    return false;
                }
            }

        ,   renderMap: function(){

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

                app.views.map.setCanvas( function(){

                    app.views.map.symptoms.once( 'sync', app.views.map.render );

                    app.views.map.pollutions.once( 'sync', function(){
                        app.views.map.symptoms.fetch({
                            error: function(){ alert( 'error!' ); }
                        });
                    });
                    

                    app.views.map.pollutions.fetch({
                        error: function(){ alert( 'error!' ); }
                    });

                });
            }


        ,   renderMapPollution: function(){

                // Pollutions collection
                app.views.map.pollutions.on( 'sync', app.views.map.renderPollutionMap);

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

                app.views.map.pollutions.fetch({
                    error: function(){ alert( 'error!' ); }
                });
            }


        ,   renderMapSymptoms: function(){

                // Symptoms collection
                app.views.map.symptoms.on( 'sync', app.views.map.renderSymptomsMap);

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

                app.views.map.symptoms.fetch({
                    error: function(){ alert( 'error!' ); }
                });
            }

    });


    app.routers.map = new MapRouter();


    Backbone.history.start({
        root: '/',
        pushState: false
    });


})( jQuery, this, this.document, window.Aircheck.app, undefined );