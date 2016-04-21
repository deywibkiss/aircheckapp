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


window.Aircheck = {};

window.Aircheck.app = {
	helpers: {},
	collections: {},
	models: {},
	views: {},
	routers: {}
};
