/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *      9. Generates .pot file for i18n and l10n.
 *
 *
 *
 */

/**
 * Load WPGulp Configuration.
 *
 * TODO: Customize your project in the wpgulp.js file.
 */
const config = require( './wpgulp.config.js' );

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
const gulp = require( 'gulp' ); // Gulp of-course.
const gutil = require( 'gulp-util' );
// CSS related plugins.
const sass = require( 'gulp-sass' )(require('node-sass')); // Gulp plugin for Sass compilation.
const minifycss = require( 'gulp-uglifycss' ); // Minifies CSS files.
const autoprefixer = require( 'gulp-autoprefixer' ); // Autoprefixing magic.
const mmq = require( 'gulp-merge-media-queries' ); // Combine matching media queries into one.
const gcmq = require('gulp-group-css-media-queries');
// JS related plugins.
const concat = require( 'gulp-concat' ); // Concatenates JS files.
const uglify = require( 'gulp-uglify-es' ).default; // Minifies JS files.
//const babel = require('gulp-babel'); // Compiles ESNext to browser compatible JS.
const rollup = require( 'gulp-better-rollup' );
const bable = require( 'rollup-plugin-babel' );
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const global = require( 'rollup-plugin-node-globals' );
// Image related plugins.
const imagemin = require( 'gulp-imagemin' ); // Minify PNG, JPEG, GIF and SVG images with imagemin.
const webp = require( 'gulp-webp' );

// Utility related plugins.
const rename = require( 'gulp-rename' ); // Renames files E.g. style.css -> style.min.css.
const lineec = require( 'gulp-line-ending-corrector' ); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
const filter = require( 'gulp-filter' ); // Enables you to work on a subset of the original files by filtering them using a glob.
const notify = require( 'gulp-notify' ); // Sends message notification to you.
const browserSync = require( 'browser-sync' ).create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.
const cache = require( 'gulp-cache' ); // Cache files in stream for later use.
const remember = require( 'gulp-remember' ); //  Adds all the files it has ever seen back into the stream.
const plumber = require( 'gulp-plumber' ); // Prevent pipe breaking caused by errors from gulp plugins.
const beep = require( 'beepbeep' );
//const  Purgecss = require('purgecss');
const purgecss = require( 'gulp-purgecss' );
const purgecssWordpress = require( 'purgecss-with-wordpress' );

// converting SVG to Font plugins.
const iconfont = require( 'gulp-iconfont' );
const iconfontCss = require( 'gulp-iconfont-css' );
const fontName = 'Icons';
const runTimestamp = Math.round( Date.now() / 1000 );

const copyright = '/* Website By Webcreed (https://webcreed.org) */';
const header = require( 'gulp-header' );

/**
 * Custom Error Handler.
 *
 * @param Mixed err
 */
const errorHandler = ( r ) =>
{
	notify.onError( "\n\n❌  ===> ERROR: <%= error.message %>\n" )( r );
	beep();

	// this.emit('end');
};

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 * @link http://www.browsersync.io/docs/options/
 *
 * @param {Mixed} done Done.
 */
const browsersync = ( done ) =>
{
	browserSync.init( {
		proxy : config.projectURL,
		open : config.browserAutoOpen,
		injectChanges : config.injectChanges,
		watchEvents : [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ],
	} );
	done();
};

// Helper function to allow browser reload with Gulp 4.
const reload = ( done ) =>
{
	browserSync.reload();
	done();
};

/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Autoprefixes it and generates style.css
 *    4. Renames the CSS file with suffix .min.css
 *    5. Minifies the CSS file and generates style.min.css
 *    6. Injects CSS or reloads the browser via browserSync
 */
gulp.task( 'styles', () =>
{
	return gulp.src( config.styleSRC, { allowEmpty : true } ).pipe( plumber( errorHandler ) ).pipe(
		sass( {
			errLogToConsole : config.errLogToConsole,
			outputStyle : config.outputStyle,
			precision : config.precision,
		} )
	).on( 'error', sass.logError ).pipe( autoprefixer( config.BROWSERS_LIST ) ).pipe( lineec() ).pipe(gcmq()) // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( config.styleDestination ) ).pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( rename( { suffix : '.min' } ) ).pipe( minifycss( { maxLineLen : 10 } ) ).pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( config.styleDestination ) ).pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( browserSync.stream() ) // Reloads style.min.css if that is enqueued.
		.pipe(
			notify( { message : "\n\n✅  ===> STYLES — completed!\n", onLast : true } )
		);
} )

gulp.task( 'styles-deploy', () =>
{
	return gulp.src( config.styleSRC, { allowEmpty : true } ).pipe( plumber( errorHandler ) ).pipe(
		sass( {
			errLogToConsole : config.errLogToConsole,
			outputStyle : config.outputStyle,
			precision : config.precision,
		} )
	).on( 'error', sass.logError ).pipe( autoprefixer( config.BROWSERS_LIST ) ).pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( config.styleDestination ) ).pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( mmq( { log : true } ) ) // Merge Media Queries only for .min.css version.
		.pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
		.pipe( rename( { suffix : '.min' } ) ).pipe( minifycss( { maxLineLen : 10 } ) ).pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe(header(copyright))
		.pipe( gulp.dest( config.styleDestination ) ).pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( browserSync.stream() ) // Reloads style.min.css if that is enqueued.
		.pipe(
			notify( {
				message : "\n\n✅  ===> STYLES DEPLOY — completed!\n",
				onLast : true,
			} )
		);
} );

gulp.task( 'clear-styles', () =>
{
	return gulp.src( config.styleTailwindDestination + '/tailwind.min.css' ).pipe(
		purgecss( {
			css : [ '**/*.css' ],
			content : [ '**/*.php' ],
			defaultExtractor : ( content ) => content.match( /[\w-/:]+(?<!:)/g ) || [],
			safelist : purgecssWordpress.safelist,
			whitelistPatterns : purgecssWordpress.safelistPatterns,
		} )
	).pipe( gulp.dest( config.styleDestination ) ).pipe(
		notify( {
			message : "\n\n✅  ===> CLEAR STYLES — completed!\n",
			onLast : true,
		} )
	);
} );

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task( 'customJS', () =>
{
	return gulp.src( config.jsCustomSRC, { since : gulp.lastRun( 'customJS' ) } ) // Only run on changed files.
		.pipe( plumber( errorHandler ) ).pipe(
			rollup(
				{
					plugins : [
						bable( { presets : [ '@babel/preset-env' ] } ),
						global(),
						resolve(),
						commonjs(),
					],
				},
				'umd'
			)
		).pipe( remember( config.jsCustomSRC ) ) // Bring all files back to stream.
		.pipe( concat( config.jsCustomFile + '.js' ) ).pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( config.jsCustomDestination ) ).pipe(
			rename( {
				basename : config.jsCustomFile,
				suffix : '.min',
			} )
		).pipe( uglify() ).on( 'error', function ( err )
		{
			gutil.log( gutil.colors.red( '[Error]' ), err.toString() );
		} ).pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( header( copyright ) )
		.pipe( gulp.dest( config.jsCustomDestination ) ).pipe(
			notify( {
				message : "\n\n✅  ===> CUSTOM JS — completed!\n",
				onLast : true,
			} )
		);
} );

/**
 * Task: `images`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp images`.
 *
 * Read the following to change these options.
 * @link https://github.com/sindresorhus/gulp-imagemin
 */
gulp.task( 'images', () =>
{
	return gulp.src( config.imgSRC ).pipe(
		cache(
			imagemin( [
				imagemin.gifsicle( { interlaced : true } ),
				imagemin.mozjpeg( { progressive : true } ),
				imagemin.optipng( { optimizationLevel : 3 } ), // 0-7 low-high.
				imagemin.svgo( {
					plugins : [ { removeViewBox : true }, { cleanupIDs : false } ],
				} ),
			] )
		)
	).pipe( webp() ).pipe( gulp.dest( config.imgDST ) ).pipe(
		notify( { message : "\n\n✅  ===> IMAGES — completed!\n", onLast : true } )
	);
} );

/**
 * Task: `clear-images-cache`.
 *
 * Deletes the images cache. By running the next 'images' task,
 * each image will be regenerated.
 */
gulp.task( 'clearCache', function ( done )
{
	return cache.clearAll( done );
} );

/**
 * Font Icon Generator.
 *
 * This task does the following:
 * 1. Gets the source of all the svg images
 * 2. Generate font files (including svg, ttf, eot, woff & woff2)
 */
gulp.task( 'iconfont', function ()
{
	return gulp.src( [ 'assets/img/font/*.svg' ] ).pipe( iconfontCss( {
		fontName : fontName,
		path : 'assets/sass/templates/_icons.scss',
		targetPath : '../../sass/components/_icons.scss',
		fontPath : '../fonts/icons/',
		centerHorizontally : true
	} ) ).pipe( iconfont( {
		fontName : fontName,
		prependUnicode : true,
		formats : [ 'svg', 'ttf', 'eot', 'woff', 'woff2' ],
		timestamp : runTimestamp,
		normalize : true,
		fontHeight : 1001
	} ) ).on( 'glyphs', function ( glyphs, options ) {
		// CSS templating, e.g.
		console.log( glyphs, options );
	} ).pipe( gulp.dest( 'assets/fonts/icons/' ) );
} );

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
	'dev',
	gulp.parallel(
		'styles',
		'customJS',
		'images',
		browsersync,
		() =>
		{
			gulp.watch( config.watchPhp, reload ); // Reload on PHP file changes.
			gulp.watch( config.watchStyles, gulp.parallel( 'styles' ) ); // Reload on SCSS file changes.
			gulp.watch( config.watchJsCustom, gulp.series( 'customJS', reload ) ); // Reload on customJS file changes.
			gulp.watch( config.imgSRC, gulp.series( 'images', reload ) ); // Reload on customJS file changes.
		}
	)
);

gulp.task(
	'prod',
	gulp.series(
		'styles-deploy',
		'customJS',
		'images',
		// 'clear-styles'
	)
);