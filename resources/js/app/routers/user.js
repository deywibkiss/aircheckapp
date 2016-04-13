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