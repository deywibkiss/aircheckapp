'use-strict';


var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');
    sourcemaps = require('gulp-sourcemaps'),
    path = require('path'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload')
    filter = require('gulp-filter');

// Using a less plugin to minify css 
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({ advanced: true });

// Using Autoprefixer
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix();

// Paths
var pJSOrigin = './resources/js/';
var pJSDestination = './www/js/';

var pStylesOrigin = './resources/less/';
var pStylesDestination = './www/css/';

var pAppOrigin = pJSOrigin + 'app/';
var pLibsOrigin = pJSOrigin + 'libs/';

// Libs
gulp.task('js-libs', function(){
    return gulp.src([

        pLibsOrigin + 'jquery.js',
        pLibsOrigin + 'hammer.min.js',
        pLibsOrigin + 'jquery.hammer.js',
        pLibsOrigin + 'underscore-min.js',
        pLibsOrigin + 'backbone-min.js',
        pLibsOrigin + 'ejs.js',
        pLibsOrigin + 'view.js'
    ])
    .pipe(gp_concat('aircheck-libs.js'))
    .pipe(gulp.dest(pJSDestination))
    .pipe(gp_rename('aircheck-libs.js'));
});

// Backbone app
gulp.task('js-backbone-app', function(){
    return gulp.src([

        // Main app
        pAppOrigin + 'app.js',

        // Collections
        pAppOrigin + 'collections/*.js',

        // Models
        pAppOrigin + 'models/symptom.js',
        pAppOrigin + 'models/location.js',
        pAppOrigin + 'models/user.js',
        pAppOrigin + 'models/report-type.js',
        pAppOrigin + 'models/report.js',

        // Views
        pAppOrigin + 'views/*.js',

        // Routers
        pAppOrigin + 'routers/*.js'

    ])
    .pipe(gp_concat('aircheck-app.js'))
    .pipe(gulp.dest(pJSDestination))
    .pipe(gp_rename('aircheck-app.js'));
});


// Compile custom LESS
gulp.task('css-less-app', function() {
   return gulp.src('./resources/less/aircheck.less')
        .pipe(plumber())
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(sourcemaps.init())
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ],
          plugins: [cleancss, autoprefix]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(pStylesDestination)).on('error', gutil.log)
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch([pStylesOrigin + '/**/*.less'], ['css-less-app']);
    gulp.watch([pAppOrigin + '/**/*.js'], ['js-backbone-app']);
});

gulp.task('default', [ 'js-libs','js-backbone-app', 'css-less-app'], function(){});