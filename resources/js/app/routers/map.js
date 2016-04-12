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