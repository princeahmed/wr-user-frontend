import gulp from 'gulp';
import pkg from './package';
import yargs from 'yargs';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import checktextdomain from 'gulp-checktextdomain';
import wpPot from 'gulp-wp-pot';

const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');


const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

const paths = {
    css: {
        src: ['src/css/frontend.scss'],
        dest: 'assets/css/'
    },
    js: {
        src: ['src/js/frontend.js'],
        dest: 'assets/js/'
    },
    images: {
        src: 'src/images/**/*.{jpg,jpeg,png,gif,svg}',
        dest: 'assets/images'
    },
    php: {
        src: [
            '**/*.php',
            '!apigen/**',
            '!includes/libraries/**',
            '!node_modules/**',
            '!tests/**',
            '!vendor/**',
            '!tmp/**'
        ],
        dest: './'
    },
    other: {
        src: ['src/**/*', '!src/{css,js,images}', '!src/{css,js,images}/**/*'],
        dest: 'assets'
    },
    build: {
        src: [
            '**/*',
            '!node_modules/**',
            '!block/node_modules/**',
            '!build/**',
            '!src/**',

            '!block/src/**',
            '!block/package.json',
            '!block/package-lock.json',
            '!block/webpack.config.js',

            '!**/*.md',
            '!**/*.map',
            '!**/*.sh',
            '!.idea/**',
            '!bin/**',
            '!.git/**',
            '!gulpfile.babel.js',
            '!package.json',
            '!composer.json',
            '!composer.lock',
            '!package-lock.json',
            '!debug.log',
            '!none',
            '!.babelrc',
            '!.gitignore',
            '!.gitmodules',
            '!phpcs.xml.dist',
            '!npm-debug.log',
            '!plugin-deploy.sh',
            '!export.sh',
            '!config.codekit',
            '!nbproject/*',
            '!tests/**',
            '!.csscomb.json',
            '!.editorconfig',
            '!.jshintrc',
            '!.tmp'
        ],
        dest: 'build'
    }
};

export const clean = () => del(['assets', 'build']);

export const css = () => {

    return gulp.src(paths.css.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(server.stream());
};

export const js = () => {
    return gulp.src(paths.js.src)
        .pipe(named())
        .pipe(webpack({
            mode: PRODUCTION ? 'production' : 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new ReplaceInFileWebpackPlugin([
                    {
                        files: ['wp-radio-user-frontend.php'],
                        rules: [
                            {
                                search: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
                                replace: 'Version:$1' + pkg.version,
                            },
                            {
                                search: /define\(\s*'WR_USER_FRONTEND_VERSION',\s*'(.*)'\s*\);/,
                                replace: `define( 'WR_USER_FRONTEND_VERSION', '${pkg.version}' );`,
                            },
                        ],
                    },
                    {
                        files: ['readme.txt'],
                        rules: [
                            {
                                search: /^(\*\*|)Stable tag:(\*\*|)(\s*?)[a-zA-Z0-9.-]+(\s*?)$/im,
                                replace: '$1Stable tag:$2$3' + pkg.version,
                            },
                        ],
                    },
                ]),
            ],

            devtool: !PRODUCTION ? 'inline-source-map' : false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.js.dest));
};

export const images = () => {
    return gulp.src(paths.images.src)
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(gulp.dest(paths.images.dest));
};

export const copy = () => {
    return gulp.src(paths.other.src)
        .pipe(gulp.dest(paths.other.dest));
};

export const serve = done => {
    server.init({
        proxy: `localhost/wpmilitary`
    });

    done();
};

export const reload = done => {
    server.reload();
    done();
};

export const watch = () => {
    gulp.watch('src/css/**/*.scss', css);
    gulp.watch('src/js/**/*.js', gulp.series(js, reload));
    gulp.watch('**/*.php', reload);
    gulp.watch(paths.images.src, gulp.series(images, reload));
    gulp.watch(paths.other.src, gulp.series(copy, reload));
};

export const compress = () => {
    return gulp.src(paths.build.src)
        .pipe(replace('__prefix', pkg.name.toLowerCase().replace(/-/g, '_')))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(gulp.dest(paths.build.dest));
};

export const checkdomain = () => {
    return gulp.src(paths.php.src)
        .pipe(checktextdomain({
            text_domain: pkg.name,
            keywords: [
                '__:1,2d',
                '_e:1,2d',
                '_x:1,2c,3d',
                'esc_html__:1,2d',
                'esc_html_e:1,2d',
                'esc_html_x:1,2c,3d',
                'esc_attr__:1,2d',
                'esc_attr_e:1,2d',
                'esc_attr_x:1,2c,3d',
                '_ex:1,2c,3d',
                '_n:1,2,4d',
                '_nx:1,2,4c,5d',
                '_n_noop:1,2,3d',
                '_nx_noop:1,2,3c,4d'
            ],
            report_success: true,
            correct_domain: true
        }))
};

export const makepot = () => {
    return gulp.src(paths.php.src)
        .pipe(wpPot({
            domain: pkg.name,
            package: pkg.name
        }))
        .pipe(gulp.dest(`languages/${pkg.name}.pot`))
};

export const dev = gulp.series(clean, gulp.parallel(css, js, images, copy), serve, watch);
export const build = gulp.series(clean, gulp.parallel(css, js, images, copy), checkdomain, makepot, compress);

export default dev;