/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	
	// Application Constructor
	
	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
	
	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	
	onDeviceReady: function() {
		
		this.receivedEvent('deviceready');
	},
	
	// Update DOM on a Received Event
	
	receivedEvent: function(id) {

		console.log('Received Event: ' + id);
		
		if (id == 'deviceready'){
			this.on_deviceready(id);
		}
	},
	
	'on_deviceready': function(id){

		var _self = this;
		
		// var db = window.sqlitePlugin.openDatabase({name: 'demo.db', location: 'default'});
		
		this.ensure_apikey(function(api_key){
			
			var map = _self.draw_map(api_key);

			var fetch_nearby = function(lat, lon){

				// please use whosonfirst.mapzen.api.js, okay yeah?
				
				console.log("FETCH NEARBY" , lat, lon);

				var onload = function(rsp){

					var target = rsp.target;

					if (target.readyState != 4){
						return;
					}
					
					var status_code = target['status'];
					var status_text = target['statusText'];
					
					var raw = target['responseText'];
					var data = undefined;
					
					try {
						data = JSON.parse(raw);

						var featurecollection = _self.spr_to_featurecollection(data["places"]);
						_self.add_geojson_to_map(map, featurecollection);
					}
					
					catch (e){
						console.log("API", "ERR", e);
						return false;
					}
				};
			
				var req = new XMLHttpRequest();
				req.addEventListener("load", onload);

				var args = {
					"method": "whosonfirst.places.getNearby",
					"latitude": lat,
					"longitude": lon,
					"api_key": api_key,
					"extras": "geom:",
				};

				var params = [];

				for (var k in args){

					var v = args[k];
					
					k = encodeURIComponent(k);
					v = encodeURIComponent(v);

					params.push(k + "=" + v);
				}

				var endpoint = "https://whosonfirst-api.mapzen.com";
				var url = endpoint + "?" + params.join("&");

				req.open("GET", url, true);
				req.send();
			};

			map.on("dragend", function(){

				var center = map.getCenter();
				var lat = center.lat;
				var lon = center.lng;

				fetch_nearby(lat, lon);
			});
			
			var on_success = function(pos){
				
				var coords = pos.coords;
				var lat = coords.latitude;
				var lon = coords.longitude;
				var alt = coords.altitude;

				map.setView([lat, lon], 15);
				fetch_nearby(lat, lon);				
			};

			var on_error = function(e){
				console.log("ERROR", e);
				navigator.notification.alert("What what what...", function(){});
			};

			var opts = {};
			
			navigator.geolocation.getCurrentPosition(on_success, on_error, opts);
		});	
		
	},

	'get_apikey': function(){

		var storage = window.localStorage;
		
		var cache_key = "mapzen:api_key";		
		var api_key = storage.getItem(cache_key);

		return api_key;
	},

	'set_apikey': function(k){

		var cache_key = "mapzen:api_key";
		
		var storage = window.localStorage;
		return storage.setItem(cache_key, k);		
	},
	
	'ensure_apikey': function(cb){

		var _self = this;
		
		var api_key = this.get_apikey();

		if (api_key){
			cb(api_key);
			return true;
		}

		navigator.notification.prompt("Please enter your Mapzen API key", function(e){

			if ((e.buttonIndex != 1) || (e.input1 == "")){

				navigator.notification.alert("Invalid API key", function(e){
					return _self.setup_mapzen(cb);
				});

				return false;
			}

			api_key = e.input1;

			// test api_key here please...
			
			_self.set_apikey(api_key);
			cb(api_key);
		});		
	},

	'draw_map': function(api_key){
		
		if (! api_key){
			api_key = this.get_apikey();
		}
		
		L.Mapzen.apiKey = api_key;

		var scene = "tangram/refill-style.zip";

		if (device.platform == "iOS"){

			// Y U NO WORK???? (20170910/thisisaaronland)
			// var root = cordova.file.applicationDirectory + "www/";
			// scene = root + scene;

			scene = L.Mapzen.BasemapStyles.Refill;
		}

		var map = L.Mapzen.map('map', {
						
                        tangramOptions: {
				scene: scene,
                                tangramURL: "js/tangram.js",
                        }
		});
		
		return map;
	},

	'spr_to_featurecollection': function(places){

		var features = [];
		
		var count_places = places.length;

		for (var i=0; i < count_places; i++){

			var spr = places[i];

			var lat = spr["geom:latitude"];
			var lon = spr["geom:longitude"];			
			var coords = [ lon, lat ];
			
			var geom = {
				"type": "Point",
				"coordinates": coords,
			};

			var props = spr;

			var feature = {
				"type": "Feature",
				"geometry": geom,
				"properties": props,
			};

			features.push(feature);
		}

		var featurecollection = {
			"type": "FeatureCollection",
			"features": features,
		};

		return featurecollection;
	},
	
	'add_geojson_to_map': function(map, geojson){

		var point_handler = function(feature, latlon){

			var style = {
				"color": "#000",
				"weight": 2,
				"opacity": 1,
				"radius": 6,
				"fillColor": "#0BBDFF",
				"fillOpacity": 1
			};
			
			var m = L.circleMarker(latlon);
			return m;
		}
		
		var args = {
			// "style": style,
			"pointToLayer": point_handler,
		}
		
		var layer = L.geoJSON(geojson, args);
		layer.addTo(map);

		return layer;
	},
};

app.initialize();
