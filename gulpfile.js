'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');
var del = require('del');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var jsdox = require('jsdox');


//vars
var builddir = 'build/';


//utils
var browserifyIt = function(bopts, ropts, ignore) {
    return transform(function(filename) {
        var br = browserify(filename, bopts).require(filename, ropts);
        if(ignore) {
            br.ignore(ignore);
        }
        return br.bundle();
    });
};


//tasks
gulp.task('default', ['build']);

gulp.task('build', ['build-test']);

gulp.task('build-test', ['build-only'], function () {
    return gulp.src('demo.html')
        .pipe(mochaPhantomJS());
});

//Clean to run *after* build.  Weirdly that seems to be unusual in the gulp universe.
gulp.task('build-only', ['build-rad', 'build-functionRunner'], function(cb) {
    del(['functionRunner.md'], cb); //Currently functionRunner is jsdoc-less, but can't get jsdox to skip it.
});

//This does the real build work, but we need cleanup to run -after- build step.  
gulp.task('build-rad', function() {
    var filename = 'src/radReveal.js';
    var modulename = 'rad-reveal';

    jsdox.generateForDir(filename, '.', null, function() { });

    return gulp.src(filename)
        .pipe(browserifyIt(null, { expose: modulename }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});

gulp.task('build-functionRunner', function() {
    var filename = 'src/functionRunner.js';

    jsdox.generateForDir(filename, '.', null, function() { });

    return gulp.src(filename)
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});
