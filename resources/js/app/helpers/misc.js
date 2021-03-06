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

	 			this.ajaxSetup();
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


			/**
			* Ajax before send
			*
			*/
		,	ajaxSetup: function(){

				$.ajaxSetup({
				    beforeSend: function() {
				        app.views.layout.showLoading();
				    },

				    complete: function(){
				    	app.views.layout.hideLoading();
				    }
				});
			}



 	};

 	app.helpers.main = new Misc();
 	app.helpers.main.initialize();
 	
 })( jQuery, this, this.document, window.Aircheck.app, EJS, undefined );