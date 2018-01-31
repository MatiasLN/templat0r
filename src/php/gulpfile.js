"use strict";

// ==========================================================================
// Require plugins
// ==========================================================================

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var del = require('del');
var browserSync = require('browser-sync');
var bower = require('gulp-bower');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var php  = require('gulp-connect-php');

// Browser Sync
// ==========================================================================
gulp.task('browser-sync', function() {
    php.server({ stdio: 'ignore' /* Suppress all terminal messages */ }, function (){
        browserSync({
            proxy: '127.0.0.1:8000'
        });
    });
});

// Custom plumber function to prevent errors
// Also prevents stopping of running tasks on error
// ==========================================================================
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error <%= error.message %>",
            sound: "Pop"
        })
    });
}

// Compress images
// ==========================================================================
gulp.task('images', function () {
    return gulp.src('assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(newer('dist/images/')) // Only optimize new files
        .pipe(imagemin({
            progressive: true,
            optimazationlevels: 5, // default = 3
            multipass: true,
            SVGOPlugins: [
                {'removeTitle': true},
                {'removeUselessStrokeAndFill': false}
            ]
        }))
        .pipe(gulp.dest('dist/images/'))
});

// Video
// ==========================================================================
gulp.task('video', function () {
    return gulp.src('assets/video/**/*.+(mp4|webm)')
        .pipe(newer('dist/video/'))
        .pipe(gulp.dest('dist/assets/video/'))
});

// Copy fonts
// ==========================================================================
gulp.task('fonts', function () {
    return gulp.src('assets/fonts/**/*')
        .pipe(newer('dist/assets/fonts/'))
        .pipe(gulp.dest('dist/assets/fonts/'))
});

// Merge .js files into app.js
// ==========================================================================
gulp.task("concatScripts", function () {
    return gulp.src([
        'assets/js/dependencies/*.js',
        'assets/js/*.js',
        '!assets/js/app.js'
    ])
        .pipe(concat('app.js'))
        .pipe(newer('assets/js/app.js'))
        .pipe(gulp.dest('assets/js'));
});

// Minify app.js
// ==========================================================================
gulp.task("minifyScripts", ["concatScripts"], function () {
    return gulp.src("assets/js/app.js")
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
});

// Compile SCSS files into CSS
// ==========================================================================
gulp.task('compileSass', function () {
    return gulp.src("assets/styles/application.scss")
        .pipe(customPlumber('Error compiling SCSS files :('))
        .pipe(maps.init())
        .pipe(sass({
            // includes bower_components as a @import location
            includePaths: ['./bower_components']
        }))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload(
            {stream: true}
        ));
});


// Watch for and compile on changes
// ==========================================================================
gulp.task('watchFiles', ["compileSass"], function () {
    gulp.watch('assets/js/main.js', ['concatScripts']);
    gulp.watch('assets/images/*', ['images']);
    gulp.watch('assets/video/*', ['video']);
    gulp.watch('assets/fonts/*', ['fonts']);
    gulp.watch('assets/styles/**/*.scss', ['compileSass']);
    gulp.watch('**/*.php', function () {
        browserSync.reload();
    });
});

// Compile and minify build files
// ==========================================================================
gulp.task("build", ['minifyScripts', 'compileSass', 'images', 'video', 'fonts'], function () {
    return gulp.src(["assets/css/application.css", "assets/js/app.min.js",
        "img/**", "fonts/**"], {base: './'})
        .pipe(gulp.dest('dist'));
});

// Install bower dependencies
// ==========================================================================
gulp.task('bower-install', function () {
    return bower()
        .pipe(notify({
            title: 'Install complete',
            message: 'Please run "gulp atomic", "gulp regular" or "gulp cssgrid" to finish setup.',
            onLast: true
        }));
});

// Setup the project
// ==========================================================================
gulp.task('setup', ['clean', 'bower-install'], function () {
});

// Select style type
// ==========================================================================
gulp.task('atomic', ['build'], function () {
    return gulp.src("src/atomic/**/*")
        .pipe(gulp.dest('assets/styles'))
        .pipe(notify({
            title: 'Install complete',
            message: 'Atomic design system has been installed. You can now start the project with "gulp watch". Enjoy!',
            onLast: true
        }));
});

gulp.task('regular', ['build'], function () {
    return gulp.src("src/regular/**/*")
        .pipe(gulp.dest('assets/styles'))
        .pipe(notify({
            title: 'Install complete',
            message: 'Default styles has been installed. You can now start the project with "gulp watch". Enjoy!',
            onLast: true
        }));
});

gulp.task('grid-styles', ['build'], function () {
    return gulp.src(['src/cssgrid/**/*', '!src/cssgrid/index.html'])
        .pipe(gulp.dest('assets/styles'))
        .pipe(notify({
            title: 'Install complete',
            message: 'CSS GRID styles has been installed. You can now start the project with "gulp watch". Enjoy!',
            onLast: true
        }));
});

gulp.task('grid-html', function () {
    return gulp.src("src/cssgrid/index.html")
        .pipe(gulp.dest('./'))
});

gulp.task('php', function () {
    del(['index.html']);
    return gulp.src("src/php/**/*")
        .pipe(gulp.dest('./'))
        .pipe(notify({
            title: 'Switched to PHP mode',
            message: 'PHP dependencies has been installed. You can now start the project with "gulp watch". Enjoy!',
            onLast: true
        }));
});

gulp.task('grid', ['grid-styles', 'grid-html']);

// Connect Browser Sync to watch command
// ==========================================================================
gulp.task('watch', ['browser-sync', 'watchFiles']);

// Run clean task if just gulp (without any other parameter) is used
// ==========================================================================
gulp.task("default", ["clean"], function () {
    gulp.start('build');
});

// ==========================================================================
// Clean stuff
// ==========================================================================

// Deletes the build folder completely
// ==========================================================================
gulp.task('clean', function () {
    del(['dist', 'dist/css/application.css*', 'dist/js/app*.js*']);
});

// Deletes the styles folder within assets completely
// ==========================================================================
gulp.task('clean-styles', function () {
    del(['assets/styles']);
});

// Deletes the src folder
// ==========================================================================
gulp.task('clean-src', function () {
    del(['assets/styles']);
});