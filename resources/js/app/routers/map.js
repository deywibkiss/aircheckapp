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