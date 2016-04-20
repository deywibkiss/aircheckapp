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