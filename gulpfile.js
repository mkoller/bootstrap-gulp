var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

var runSequence = require('run-sequence');


// Gulp watch syntax
gulp.task('watch', ['browserSync' , 'sass'], function(){
  gulp.watch('scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload); 
  gulp.watch('js/**/*.js', browserSync.reload);
  console.log('To stop watching type control c');
})

// Gulp Build task
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

// Convert sass to css
gulp.task('sass', function(){
  return gulp.src('scss/**/*.scss')
    // Initializes sourcemaps
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
     }))
    // Writes sourcemaps into the CSS file
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Useref Task
gulp.task('useref', function(){
  return gulp.src('*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Imagemin Task
gulp.task('images', function(){
  return gulp.src('img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

// Gulp Fonts
gulp.task('fonts', function() {
  return gulp.src('fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Browsersync Task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

// Cleans dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// gulp clear cache
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})