/**
* Global app
*
*/

// Static
var apiURL = 'http://localhost:1337/';
var templatePath = 'js/templates/';
var content = $('#aircheck-main-content');
var submenu = $('#aircheck-report-submenu');


window.Aircheck = {};

window.Aircheck.app = {
	helpers: {},
	collections: {},
	models: {},
	views: {},
	routers: {}
};
