var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var watch = require('gulp-watch');

var headerComment = '/* Sword\n' +
                     ' * By AlloyTeam http://www.alloyteam.com/\n'+
                     ' * Github: https://github.com/AlloyTeam/Sword\n' +
                     ' * MIT Licensed.\n' +
                     ' */\n';

gulp.task('build', function () {
    gulp.src([

        'src/intro.js',

        'src/matrix2d.js',
        'src/observe.js',
        'src/sword.js',
        'src/path-transition.js',
        
        'src/outro.js'

    ])
        .pipe(concat('sword.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('sword.min.js'))
        .pipe(header(headerComment))
        .pipe(gulp.dest('dist'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['build']);
});


gulp.task('default', ['build','watch']);