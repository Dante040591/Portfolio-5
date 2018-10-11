var gulp = require ('gulp');
var scss = require ('gulp-sass');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
var cssnano = require('gulp-cssnano');


gulp.task('scss', function() {
	return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
	.pipe(scss())
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
    .pipe(sourcemaps.write())
  //  .pipe(cssnano())
   // .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('concatjs', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('babel', function() {
    return gulp.src('app/js/**/*.js')
    .pipe(babel({
            presets: ['@babel/env']
        }))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream())
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        },
        notify: false
    });
});

gulp.task('del', function() {
    del.sync('dist')
});
//Удаляет старую папку dist

gulp.task('watch', ['browserSync','scss','concatjs'], function() {
	gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
});
// следит за всеми файлами scss, html, js и выполняет перед этим таски в []

gulp.task('build', ['del', 'scss', 'concatjs'], function() {
    var buildCss = gulp.src([
        'app/css/style.css',
        'app/css/style.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

    var buildJs = gulp.src('app/js/**/*js')
    .pipe(gulp.dest('dist/js'))

    var buildHml = gulp.src('app/*html')
    .pipe(gulp.dest('dist'))

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('dist/fonts'))

    var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'))
});
//Собирает проект

gulp.task('default', ['watch']);


