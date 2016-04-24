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
                "map/heatmap": "renderHeatmapPollution",
                "map/aerosol": "renderMapAerosol",
                "map/co2": "renderCOMap"
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
                            // error: function(){ //alert( 'error!' );
                            // }
                        });
                    });
                    

                    app.views.map.pollutions.fetch({
                        // error: function(){
                        //     //alert( 'error!' );
                        // }
                    });

                });

                // Call notifications
                app.views.notification.get();
            }


        ,   renderMapPollution: function(){

                console.log('here');

                // Pollutions collection
                //app.views.map.pollutions.once( 'sync', app.views.map.renderPollutionMap);

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

                app.views.map.pollutions.fetch({
                    //error: function(){ alert( 'error!' );}
                });
            }


        ,   renderMapSymptoms: function(){

                // Symptoms collection
                //app.views.map.symptoms.once( 'sync', app.views.map.renderSymptomsMap);

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();
                sublayers.removeClass('active');

                app.views.map.symptoms.fetch({
                    //error: function(){ alert( 'error!' ); }
                });
            }

        ,   renderHeatmapPollution: function(){

                // Pollutions collection
                app.views.heatmap.pollutions.once( 'sync', app.views.heatmap.renderPollutionHeatmap);

                app.views.layout.hideMenu();
                app.views.layout.hideReportMenu();

                app.views.heatmap.pollutions.fetch({
                    //error: function(){ alert( 'error!' ); }
                });
            }

        ,   renderMapAerosol: function(){

                app.views.map.setCanvas( function(){

                    app.views.map.canvas = $('#map-canvas')[0];

                    // Init map canvas
                    app.views.map.map = new google.maps.Map( app.views.map.canvas, {
                        zoom: 3,
                        center: { lat: 28.895074, lng: 91.459554}
                    });

                    // Pollutions collection
                    app.views.map.setLayer('MODIS_Terra_Aerosol');
                });

            }

        ,   renderCOMap: function(){

                app.views.map.setCanvas( function(){

                    app.views.map.canvas = $('#map-canvas')[0];

                    // Init map canvas
                    app.views.map.map = new google.maps.Map( app.views.map.canvas, {
                        zoom: 3,
                        center: { lat: 28.895074, lng: 91.459554}
                    });

                    // Pollutions collection
                    app.views.map.setLayer('MLS_CO_215hPa_Day');
                });

            }

    });


    app.routers.map = new MapRouter();


    Backbone.history.start({
        root: '/',
        pushState: false,
        silent: false
    });


})( jQuery, this, this.document, window.Aircheck.app, undefined );