var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var watchify = require('watchify');
var tsify = require('tsify');
var es = require('event-stream');

var config = {
    common: [ 'react', 'react-dom' ],
    commonFile: 'common.min.js',
	entries: [ './src/index.tsx' ],
    dist: './dist'
};

gulp.task('app', function() {
    return bundleEntries(false);
});

gulp.task('common', function() {
    //create bundle with no entries, only require common dependencies
    return browserify({ debug: true, cache: {}, packageCache: {} })
        .require(config.common)
        .bundle()
        .on('error', function (err) { console.error(err); this.emit('end'); })
        .pipe(source(config.commonFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('watch', [ 'common' ], function() {
    return bundleEntries(true); 
});

function bundleEntries(watch) {
    var tasks = config.entries.map(function (bundle) {  
        var bundler = browserify(bundle, { debug: true, cache: {}, packageCache: {} })
            .external(config.common)
            .plugin(tsify)
                
        if (watch)
            bundler.plugin(watchify);

        function rebundle() {
            return bundler.bundle()
                .on('error', function (err) { console.error(err); this.emit('end'); })
                .pipe(source(bundle))
                .pipe(buffer())
                .pipe(rename({ 
                    extname: '.js',
                    dirname: ''
                }))
                .pipe(sourcemaps.init({ loadMaps: true }))
                    .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(config.dist));
        }
    
        if (watch) {
            bundler.on('update', function () {
                console.log('-> bundling ' + bundle + '...');
                rebundle();
            });
        }
    
        return rebundle();
    });
	
    return es.merge.apply(null, tasks);
}