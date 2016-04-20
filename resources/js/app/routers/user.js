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