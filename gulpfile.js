const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const header = require('gulp-header');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const modifyFile = require('gulp-modify-file');

const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-clean-css');

const pkg = require('./package.json');
const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @url <%= pkg.repository.url %>',
  ' * @package private',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

const errorHandler = () => 
  plumber({errorHandler: notify.onError('Error: <%= error.message %>')})

gulp.task('js', () => 
  gulp.src('src/source/index.js')
  .pipe(errorHandler())
  .pipe(gulpWebpack(require('./webpack.config'), webpack))
  .pipe(modifyFile((content) => {
    const start = `define(function(require, exports, module) {\n`
    const end = `\n})`
    return `${start}${content}${end}`;
  }))
  .pipe(header(banner, {pkg : pkg}))
  .pipe(gulp.dest('framework/js'))
)

gulp.task('less', () => 
  gulp.src('src/less/ui.less')
    .pipe(errorHandler())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true
    }))
    .pipe(cssmin())
    .pipe(header(banner, {pkg : pkg}))
    .pipe(gulp.dest('framework/css'))
);

gulp.task('default', ['js', 'less']);