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

var browserifyIt = function(bopts, ropts) {
    return transform(function(filename) {
        return browserify(filename, bopts)
            .require(filename, ropts)
            .bundle();
    });
};

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
    var builddir = 'build/';
    return gulp.src('src/radReveal.js')
        .pipe(browserifyIt(null, { expose: 'rad-reveal' }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir))
        .pipe(shell(['jsdox --output . src']));
});

gulp.task('build-functionRunner', function() {
    var builddir = 'build/';
    return gulp.src('src/functionRunner.js')
        .pipe(browserifyIt({ ignoreMissing: true }, null))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});
