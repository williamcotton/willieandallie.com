all: build

build: public/build.js public/build.css

build_css: clean_css server/public/build.css

build_debug_css: clean_css
	./node_modules/.bin/node-sass src/scss/index.scss public/build.css --source-map public/build.css.map

build_debug_js: clean_js
	./node_modules/.bin/browserify src/js/browser-app.js -d -t reactify > public/build.js 

clean: clean_css clean_js

clean_css:
	rm -f public/build.css
	rm -f public/build.css.map

clean_js:
	rm -f public/build.js
	rm -f public/build.browserify.js

public/build.css:
	mkdir -p public
	./node_modules/.bin/node-sass src/scss/index.scss $@ --output-style compressed

public/build.browserify.js:
	mkdir -p public
	./node_modules/.bin/browserify src/js/browser-app.js -t reactify > $@

public/build.js: public/build.browserify.js
	mkdir -p public
	./node_modules/.bin/uglifyjs $< -m -c > $@