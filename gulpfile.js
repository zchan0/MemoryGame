var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var del = require('del');

gulp.task('img', function() {
    return gulp.src('./img/*.+(png|jpg|gif)')
    .pipe(gulp.dest('docs/img'));
});

gulp.task('css', function() {
    return gulp.src('./css/*.css')
    .pipe(gulp.dest('docs/css'));
});

gulp.task('html', function() {
    return gulp.src('./*.html')
    .pipe(gulp.dest('docs'));
});

gulp.task('webpack', function() {
    return new Promise(resolve => webpack(webpackConfig, (err, stats) => {
        if (err) console.log('Webpack', err)
        console.log(stats.toString({ colors: true }))
        resolve()
    }));
});

gulp.task('copy', gulp.parallel('img','css','html'));

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./docs",

            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: webpackConfig.output.publicPath,
                    stats: { colors: true }
                }),
                webpackHotMiddleware(bundler)
            ]
        }
    });
});

gulp.task('clean', function() {
    return del('docs');
});

gulp.task('serve',gulp.series('copy', 'browserSync'));
gulp.task('build', gulp.series('copy', 'webpack'));

