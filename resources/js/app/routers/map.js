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
                    app.views.map.model.get('callbacks').setPosition = app.views.map.model.setPosition;
                    app.views.map.model.getGeoposition();
                });
            }

    });


    app.routers.map = new MapRouter();


    Backbone.history.start({
        root: '/',
        pushState: false
    });


})( jQuery, this, this.document, window.Aircheck.app, undefined );