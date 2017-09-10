styleguide:
	curl -s -o www/css/mapzen.styleguide.css https://mapzen.com/common/styleguide/styles/styleguide.css
	curl -s -o www/js/mapzen.styleguide.min.js https://mapzen.com/common/styleguide/scripts/mapzen-styleguide.min.js

maps: mapzenjs tangram refill styleguide

tangram:
	curl -s -o www/js/tangram.js https://mapzen.com/tangram/tangram.debug.js
	curl -s -o www/js/tangram.min.js https://mapzen.com/tangram/tangram.min.js

refill:
	curl -s -o www/tangram/refill-style.zip https://mapzen.com/carto/refill-style/refill-style.zip

mapzenjs:
	curl -s -o www/css/mapzen.js.css https://mapzen.com/js/mapzen.css
	curl -s -o www/js/mapzen.js https://mapzen.com/js/mapzen.js
	curl -s -o www/js/mapzen.min.js https://mapzen.com/js/mapzen.min.js

localforage:
	curl -s -o www/js/localforage.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.js
	curl -s -o www/js/localforage.min.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.min.js

leaflet:
	curl -s -o www/js/leaflet.zip http://cdn.leafletjs.com/leaflet/v1.1.0/leaflet.zip

jquery:
	curl -s -o www/js/jquery-3.2.1.min.js https://code.jquery.com/jquery-3.2.1.min.js

bootstrap:
	curl -s -L -o www/js/bootstrap-3.3.7-dist.zip https://github.com/twbs/bootstrap/releases/download/v3.3.7/bootstrap-3.3.7-dist.zip
	cp -r www/js/bootstrap-3.3.7-dist/js/* www/js/
	cp -r www/js/bootstrap-3.3.7-dist/css/* www/css/
	rm -rf www/js/bootstrap-3.3.7-dist
	rm -rf www/js/bootstrap-3.3.7-dist.zip
