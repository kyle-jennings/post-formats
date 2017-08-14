var autoprefixer = require('autoprefixer');
var browserify = require('browserify');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var util = require('gulp-util');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var minify = require('gulp-minify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var pngquant = require('imagemin-pngquant');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var transform = require('vinyl-transform');
var watch = require('gulp-watch');
var wpPot = require('gulp-wp-pot');


function swallowError(error){
  this.emit('end');
}

var config = {
  production: true
};

// dir paths
var paths = {
  srcPath: './src',
  assetsPath: '../assets',
  npmPath : './node_modules',
  bowerPath: './bower_components',
  vendorPath: './js/vendor'
};
paths.scssGlob = paths.srcPath + '/scss/**/*.scss';
paths.jsGlob = paths.srcPath + '/js/**/*.js';




// ---------------------------------------------------------------------------
//  The frontend assets
// ---------------------------------------------------------------------------
gulp.task('css', ['sass'], function() {

  return gulp.src( paths.assetsPath + '/css/post-format.css')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(cssnano({ safe: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest( paths.assetsPath + '/css'))
    .pipe(notify({message: 'CSS complete'}));
});


/**
 * Compile Sass and run stylesheet through PostCSS.
 */
gulp.task('sass', ['clean:css'], function() {

  return gulp.src(paths.srcPath+'/scss/post-formats.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [ paths.scssGlob],
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 version'] })
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( paths.assetsPath + '/css' ));
});


gulp.task('clean:css', function() {
  return del(
    [ paths.assetsPath + '/css' ],
    {read:false, force: true});
});




gulp.task('js',['clean:js'], function(){

  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src([
    paths.srcPath + '/js/post-formats.js',
  ] )
  .pipe(plumber({ errorHandler: handleErrors }))
  .pipe(browserified)
  .pipe(minify())
  .pipe(gulp.dest( paths.assetsPath + '/js' ))
  .pipe(notify({message: 'JS complete'}));

});


gulp.task('clean:js', function() {
  return del(
    [ paths.assetsPath + '/js' ],
    {read:false, force: true});
});


// ---------------------------------------------------------------------------
//  Utilities
// ---------------------------------------------------------------------------

gulp.task('pot', function () {

    return gulp.src('../**/*.php')
        .pipe(wpPot( {
            domain: 'bootswatch',
            package: 'Example project'
        } ))
        .pipe(gulp.dest('../languages/bootswatch.pot'));
});

/**
 * Handle errors.
 * plays a noise and display notification
 */
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Task Failed [<%= error.message %>',
    message: 'See console.',
    sound: 'Sosumi'
  }).apply(this, args);
  util.beep();
  this.emit('end');
}



/**
 * Builds the JS and SASS
 * @return {[type]} [description]
 */
gulp.task('build', function(){

  gulp.start('js');
  gulp.start('css');


});

/**
 * Default Task, runs build and then watch
 * @return {[type]} [description]
 */
gulp.task('default', function(){
  gulp.start('build');
});


/**
 * Process tasks and reload browsers.
 */
gulp.task('watch', function() {
  gulp.start('build');
  gulp.watch(paths.jsGlob, ['js']);
});


gulp.task('watch-js', function() {
  gulp.start('js');
  gulp.watch(paths.jsGlob, ['js']);
  gulp.watch(paths.scssGlob, ['css']);
});
