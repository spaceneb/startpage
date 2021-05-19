#!/bin/sh
eslint ./**/*.js --fix
npx stylelint "**/*.css" --fix
npx prettier --write .
uglifyjs src/script.js -c -o dist/script.min.js
uglifycss src/style.css > dist/style.min.css
