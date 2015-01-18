'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');
var del = require('del');

gulp.task('default', ['build']);


//clean to run *after* build.  weirdly that seems to be unusual in the gulp universe.
gulp.task('build', ['actually-build'], function(cb) {
    del(['functionRunner.md'], cb)
});

//This does the real build work, but we need cleanup to run -after- build step.  
gulp.task('actually-build', function() {
    var builddir = 'build/';
    return gulp.src('src/radReveal.js')
        // This will output the non-minified version
        .pipe(gulp.dest(builddir))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir))
        .pipe(shell(['jsdox --output . src']));
});

gulp.task('functionRunner', function() {
    var builddir = 'build/';
    return gulp.src('src/functionRunner.js')
        // This will output the non-minified version
        .pipe(gulp.dest(builddir))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});

var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('test', ['build', 'functionRunner'], function () {
    return gulp.src('demo.html')
        .pipe(mochaPhantomJS());
});
