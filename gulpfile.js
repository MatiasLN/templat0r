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
var bs = require('browser-sync').create();
var bower = require('gulp-bower');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

// Browser Sync
// ==========================================================================
gulp.task('browser-sync', function () {
    bs.init({
        server: {
            baseDir: "./"
        }
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
        'assets/js/jquery.js',
        'assets/js/main.js'
    ])
        .pipe(maps.init())
        .pipe(concat('app.js'))
        .pipe(maps.write('./'))
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
        .pipe(bs.reload(
            {stream: true}
        ));
});


// Watch for and compile on changes
// ==========================================================================
gulp.task('watchFiles', function () {
    gulp.watch('assets/styles/**/*.scss', ['compileSass']);
    gulp.watch('assets/js/main.js', ['concatScripts']);
    gulp.watch('assets/images/*', ['images']);
    gulp.watch('assets/video/*', ['video']);
    gulp.watch('assets/fonts/*', ['fonts']);
    gulp.watch('./*.html').on('change', bs.reload);
});

// Deletes the build folder completely
// ==========================================================================
gulp.task('clean', function () {
    del(['dist', 'dist/css/application.css*', 'dist/js/app*.js*']);
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
    return bower();
});

// Setup the project
// ==========================================================================
gulp.task('setup', ['clean', 'bower-install'], function () {
    gulp.start('build');
});


// Connect Browser Sync to watch command
// ==========================================================================
gulp.task('watch', ['browser-sync', 'watchFiles']);

// Run clean task if just gulp (without any other parameter) is used
// ==========================================================================
gulp.task("default", ["clean"], function () {
    gulp.start('build');
});

