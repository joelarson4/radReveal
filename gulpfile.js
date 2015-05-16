'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var bump = require('gulp-bump');
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

function test() {
    return gulp.src('demo.html')
        .pipe(mochaPhantomJS());
}

//tasks
gulp.task('default', function() {
  gulp.watch('src/*.js', ['build']);
  gulp.watch('demo.html', ['build']);
});

gulp.task('release', ['build'], test);

gulp.task('build', ['build-rad', 'build-functionRunner']);

gulp.task('build-rad', function() {
    var filename = 'src/radReveal.js';
    var modulename = 'rad-reveal';

    jsdox.generateForDir(filename, '.', null, function() { });

    return gulp.src(filename)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserifyIt(null, { expose: modulename }))
        .pipe(gulp.dest(builddir))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});

gulp.task('build-functionRunner', function() {
    var filename = 'src/functionRunner.js';

    jsdox.generateForDir(filename, '.', null, function() { });

    return gulp.src(filename)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(builddir))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(builddir));
});

gulp.task('test', test);

gulp.task('bump', function(){
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('version', ['bump'], function() {
    var version = require('./package.json').version;
    
    var exec = require('child_process').exec;
    exec('git tag v' + version, function (error, stdout, stderr) {
        if(error) { console.log(error); return; }  
        exec('git add package.json; git commit --m \'Bumping to ' + version + '\'', function (error, stdout, stderr) {
            if(error) { console.log(error); return; } 
            console.log('Version now at ' + version);
        });
    });
});
