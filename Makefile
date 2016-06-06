export PATH := node_modules/.bin:$(PATH)

all: build

build: public/build.js public/build.css copy_images copy_fonts .env expect-user-authentication-service-public.pem

.env:
	cp default.env $@

expect-user-authentication-service.pem:
	openssl genrsa -out $@ 1024

expect-user-authentication-service-public.pem: expect-user-authentication-service.pem
	openssl rsa -in $< -pubout -out $@

copy_images:
	mkdir -p public/images
	cp -f src/images/* public/images 2>/dev/null || :

copy_fonts:
	mkdir -p public/fonts
	cp -f src/fonts/* public/fonts 2>/dev/null || :

build_css: clean_css public/build.css

build_debug_css: clean_css
	"node-sass" src/scss/index.scss public/build.css --source-map public/build.css.map

build_debug_js: clean_js
	browserify src/js/browser/index.js -d -t babelify > public/build.js

clean: clean_css clean_js

clean_css:
	rm -f public/build.css
	rm -f public/build.css.map

clean_js:
	rm -f public/build.js
	rm -f public/build.browserify.js

public/build.css:
	mkdir -p public
	"node-sass" src/scss/index.scss $@ --output-style compressed

public/build.browserify.js:
	mkdir -p public
	browserify src/js/browser/index.js -t babelify > $@

public/build.js: public/build.browserify.js
	mkdir -p public
	uglifyjs $< -m -c > $@
