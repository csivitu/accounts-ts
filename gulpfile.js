const { src, dest, parallel, series } = require('gulp');
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const fs = require('fs');
const rename = require('gulp-rename');

const gulpTS = require('gulp-typescript');
const tsProject = gulpTS.createProject('tsconfig.json');
require('dotenv').config();


const dotenvConfig = {
    SESSION_SECRET: process.env.SESSION_SECRET,
    PORT: process.env.PORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    RESET_LINK: process.env.RESET_LINK,
    VERIFY_LINK: process.env.VERIFY_LINK,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    ACCOUNTS_DB: process.env.ACCOUNTS_DB,
    RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
};

function templates() {
    return src('src/templates/**/*')
        .pipe(dest('dist/templates'));
}

function css() {
    return src('src/static/css/*.css')
        .pipe(minifyCSS())
        .pipe(dest('dist/static/css/'));
}

function images() {
    return src('src/static/images/*')
        .pipe(dest('dist/static/images/'));
}

function js() {
    return src('src/static/js/*.js', { sourcemaps: true })
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))
        .pipe(uglify())
        .pipe(dest('dist/static/js', { sourcemaps: true }));
}

function ts() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest('dist'));
}

function setupDotEnv(cb) {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV == 'production') {
        let data = '';
        for (const key in dotenvConfig) {
            data += `${key}=${dotenvConfig[key]}\n`;
        }
        fs.writeFile('./.env', data, cb);
    } else {
        return src('sample.env')
            .pipe(rename('.env'))
            .pipe(dest('.'));
    }
}

exports.default = series(parallel(templates, css, images, js, ts), setupDotEnv);