'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');

gulp.task('default', ['build']);

gulp.task('build', function() {
    var builddir = 'build/';
    var demodir = 'demo/plugin/radReveal/';
    return gulp.src('src/rad.js')
        // This will output the non-minified version
        .pipe(gulp.dest(builddir))
        .pipe(gulp.dest(demodir))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir))
        .pipe(gulp.dest(demodir))
        .pipe(shell([ 'jsdox --output . src' ]));
});

gulp.task('functionRunner', function() {
    var builddir = 'build/';
    var demodir = 'demo/plugin/rad-functionRunner/';
    return gulp.src('functionRunner/functionRunner.js')
        // This will output the non-minified version
        .pipe(gulp.dest(builddir))
        .pipe(gulp.dest(demodir))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir))
        .pipe(gulp.dest(demodir));
});

var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('test', ['build', 'functionRunner'], function () {
    return gulp.src('demo/index.html')
        .pipe(mochaPhantomJS());
});
