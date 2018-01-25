(function () {

	'use strict';
	angular.module('landcoverportal')
	.filter('treeCanopyHeightYearRange', function () {
		return function(input, min, max) {
			min = parseInt(min);
			max = parseInt(max);
			for (var i = min; i <= max; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.controller('forestMonitorCtrl', function ($scope, appSettings, ForestMonitorService) {

		// Setting variables
		$scope.areaIndexSelectors = appSettings.areaIndexSelectors;

		// Earth Engine
		// Global Variables
		var EE_URL = 'https://earthengine.googleapis.com',
			DEFAULT_ZOOM = 5,
			MAX_ZOOM = 25,
			DEFAULT_CENTER = { lng: 102.93, lat: 16.4 },
			AREA_LIMIT = 20000,
			// Map options
			mapOptions = {
				center: DEFAULT_CENTER,
				zoom: DEFAULT_ZOOM,
				maxZoom: MAX_ZOOM,
				streetViewControl: false,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		            position: google.maps.ControlPosition.TOP_CENTER
		        },
		        fullscreenControl: true,
		        fullscreenControlOptions: {
		        	position: google.maps.ControlPosition.TOP_LEFT
		        }
			},
			// Map variable
			map = new google.maps.Map(document.getElementById('map'), mapOptions);

		// $scope variables
		$scope.alertClass = 'custom-alert';
		$scope.overlays = {};
		$scope.shape = {};
		$scope.toolControlClass = 'glyphicon glyphicon-eye-open';
		$scope.showTabContainer = true;
		$scope.showLoader = false;

		$('.js-tooltip').tooltip();

		/*
		 * Select Options for Variables
		 **/

		$scope.showAreaVariableSelector = false;
		$scope.areaSelectFrom = null;
		$scope.areaName = null;
		$scope.shownGeoJson = null;

		$scope.populateAreaVariableOptions = function (option) {

			$scope.showAreaVariableSelector = true;
			$scope.areaSelectFrom = option.value;
			if ($scope.areaSelectFrom === 'country') {
				$scope.areaVariableOptions = appSettings.countries;
			} else if ($scope.areaSelectFrom === 'province') {
				$scope.areaVariableOptions = appSettings.provinces;
			}
		};

		$scope.loadAreaFromFile = function (name) {

			$scope.removeShownGeoJson();

			if (name) {
				$scope.areaName = name;

		        map.data.loadGeoJson(
		            '/static/data/' + $scope.areaSelectFrom + '/' + name + '.json'
		        );

		        map.data.setStyle({
		          fillColor: 'red',
		          strokeWeight: 2,
		          clickable: false
		        });

		        map.data.addListener('addfeature', function (event) {
		        	$scope.shownGeoJson = event.feature;
		        });

		        map.data.addListener('removefeature', function (event) {
		        	$scope.shownGeoJson = null;
		        });
			} else {
				$scope.areaName = null;
				$scope.shownGeoJson = null;
			}
		};

		$scope.removeShownGeoJson = function () {
			if ($scope.shownGeoJson) {
				map.data.remove($scope.shownGeoJson);
			}			
		};

		/**
		* Tab
		*/
		$('.btn-pref .btn').click (function () {
    		$('.btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
    		// $(".tab").addClass("active"); // instead of this do the below 
    		$(this).removeClass('btn-default').addClass('btn-primary');  
		});

		$('.btn-pref-inner .btn').click (function () {
    		$('.btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
    		// $(".tab").addClass("active"); // instead of this do the below 
    		$(this).removeClass('btn-default').addClass('btn-primary');  
		});

		/** Updates the image based on the current control panel config. */
		var loadMap = function (mapId, mapToken, type) {

			if (typeof(type) === 'undefined') type = 'map';

			var eeMapOptions = {
				getTileUrl: function (tile, zoom) {
					var url = EE_URL + '/map/';
						url += [mapId, zoom, tile.x, tile.y].join('/');
						url += '?token=' + mapToken;
						return url;
				},
				tileSize: new google.maps.Size(256, 256),
				opacity: 1.0,
				name: type
			};
			var mapType = new google.maps.ImageMapType(eeMapOptions);
			map.overlayMapTypes.push(mapType);
			$scope.overlays[type] = mapType;
		};

		/**
		 * Drawing Tool Manager
		 **/

		var drawingManager = new google.maps.drawing.DrawingManager();

		var getDrawingManagerOptions = function (type) {
		    var typeOptions;

			if (type === 'rectangle') {
				typeOptions = 'rectangleOptions';
			} else if (type === 'circle') {
				typeOptions = 'circleOptions';
			} else if (type === 'polygon') {
				typeOptions = 'polygonOptions';
			}

		    var drawingManagerOptions = {
		    		'drawingControl': false
		    };
		    drawingManagerOptions.drawingMode = type;
		    drawingManagerOptions[typeOptions] = {
	    		'strokeColor': '#ff0000',
				'strokeWeight': 5,
				'fillColor': 'yellow',
				'fillOpacity': 0,
				'editable': true
		    };
			
			return drawingManagerOptions;
				
		};

		$scope.drawShape = function (type) {

			drawingManager.setOptions(getDrawingManagerOptions(type));
			// Loading the drawing Tool in the Map.
			drawingManager.setMap(map);
			
		};

		$scope.stopDrawing = function () {

			drawingManager.setDrawingMode(null);
			
		};

		$scope.clearDrawing = function () {

			if ($scope.overlays.polygon) {
				$scope.overlays.polygon.setMap(null);
				$scope.showPolygonDrawing = false;				
			}
		};

		var getRectangleArray = function (bounds) {
			var start = bounds.getNorthEast();
			var end = bounds.getSouthWest();
			return [start.lng().toFixed(2), start.lat().toFixed(2), end.lng().toFixed(2), end.lat().toFixed(2)];
		};

		var getPolygonArray = function (pathArray) {
			var geom = [];
			for (var i = 0; i < pathArray.length; i++) {
				var coordinatePair = [pathArray[i].lng().toFixed(2), pathArray[i].lat().toFixed(2)];
				geom.push(coordinatePair);
			}
			return geom;
		};

		$scope.clearLayers = function (name) {

			map.overlayMapTypes.forEach (function (layer, index) {
				if (layer.name === name) {
					map.overlayMapTypes.removeAt(index);
				}
			});
		};

		// Overlay Listener
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
			// Clear Layer First
			$scope.clearDrawing();
			var overlay = event.overlay;
			$scope.overlays.polygon = overlay;
			$scope.$apply();
			$scope.shape = {};

			var drawingType = event.type;
			$scope.shape.type = drawingType;
			if (drawingType === 'rectangle') {
				$scope.shape.geom = getRectangleArray(overlay.getBounds());
				// Change event
				google.maps.event.addListener(overlay, 'bounds_changed', function () {
					$scope.shape.geom = getRectangleArray(event.overlay.getBounds());
				});
			} else if (drawingType === 'circle') {
				$scope.shape.center = [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
				$scope.shape.radius = overlay.getRadius().toFixed(2); // unit: meter
				// Change event
				google.maps.event.addListener(overlay, 'radius_changed', function () {
					$scope.shape.radius = event.overlay.getRadius().toFixed(2);
				});
				google.maps.event.addListener(overlay, 'center_changed', function () {
					$scope.shape.center = [event.overlay.getCenter().lng().toFixed(2), event.overlay.getCenter().lat().toFixed(2)];
				});
			} else if (drawingType === 'polygon') {
				var path = overlay.getPath();
				$scope.shape.geom = getPolygonArray(path.getArray());
				// Change event
				google.maps.event.addListener(path, 'insert_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
				});
				google.maps.event.addListener(path, 'remove_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
				});
				google.maps.event.addListener(path, 'set_at', function () {
					$scope.shape.geom = getPolygonArray(event.overlay.getPath().getArray());
				});
			}

			$scope.stopDrawing();
		});

		/**
		 * Custom Control
		 */

		$scope.toggleToolControl = function () {

			if ($('.tool-control span').hasClass('glyphicon-eye-open')) {
				$('.tool-control span').removeClass('glyphicon glyphicon-eye-open icon-eye').addClass('glyphicon glyphicon-eye-close icon-eye');
				$scope.showTabContainer = false;
			} else {
				$('.tool-control span').removeClass('glyphicon glyphicon-eye-close icon-eye').addClass('glyphicon glyphicon-eye-open icon-eye');
				$scope.showTabContainer = true;
			}
			$scope.$apply();
		};

		function AnalysisToolControl(controlDiv, map) {

			// Set CSS for the control border.
			var controlUI = document.createElement('div');
			controlUI.setAttribute('class', 'tool-control text-center');
			controlUI.title = 'Toogle Tools Visibility';
			controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open icon-eye' aria-hidden='true'></span>";
			controlDiv.appendChild(controlUI);

			// Setup the click event listeners
			controlUI.addEventListener('click', function() {
			  	$scope.toggleToolControl();
			});

		}

		//var analysisToolControlDiv = document.createElement('div');
		var analysisToolControlDiv = document.getElementById('tool-control-container');
		var analysisToolControl = new AnalysisToolControl(analysisToolControlDiv, map);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(analysisToolControlDiv);


		var datepickerOptions = {
			autoclose: true,
			clearBtn: true,
			container: '.datepicker'
		};

		$('#time-period-tab>#datepicker').datepicker(datepickerOptions);

		/* Tree Canopy */
		$scope.showTreeCanopyOpacitySlider = false;
		$scope.treeCanopyOpacitySliderValue = null;

		/* slider init */
		$('#tree-canopy-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.treeCanopyOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.treeCanopyOpacitySliderValue) {
		    	$scope.overlays.treeCanopy.setOpacity(value);
		    }
		});

		$scope.treeCanopyYearChange = function(year) {

			var name = 'treeCanopy';
			$scope.clearLayers(name);

			ForestMonitorService.treeCanopyChange(year, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, name);
		    	$scope.showTreeCanopyOpacitySlider = true;
		    	$scope.removeShownGeoJson();
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Tree height */
		$scope.showTreeHeightOpacitySlider = false;
		$scope.treeHeightOpacitySliderValue = null;

		/* slider init */
		$('#tree-height-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.treeHeightOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.treeHeightOpacitySliderValue) {
		    	$scope.overlays.treeHeight.setOpacity(value);
		    }
		});

		$scope.treeHeightYearChange = function(year) {

			var name = 'treeHeight';
			$scope.clearLayers(name);

			ForestMonitorService.treeHeightChange(year, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, name);
		    	$scope.showTreeHeightOpacitySlider = true;
		    	$scope.removeShownGeoJson();
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Gain */
		$scope.showForestGainOpacitySlider = false;
		$scope.forestGainOpacitySliderValue = null;

		/* slider init */
		$('#forest-gain-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestGainOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestGainOpacitySliderValue) {
		    	$scope.overlays.forestGain.setOpacity(value);
		    }
		});

		$scope.calculateForestGain = function (startYear, endYear) {

			var name = 'forestGain';
			$scope.clearLayers(name);

			ForestMonitorService.forestGain(startYear, endYear, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, name);
		    	$scope.showForestGainOpacitySlider = true;
		    	$scope.removeShownGeoJson();
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Loss */
		$scope.showForestLossOpacitySlider = false;
		$scope.forestLossOpacitySliderValue = null;

		/* slider init */
		$('#forest-loss-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestLossOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestLossOpacitySliderValue) {
		    	$scope.overlays.forestLoss.setOpacity(value);
		    }
		});

		$scope.calculateForestLoss = function (startYear, endYear) {

			var name = 'forestLoss';
			$scope.clearLayers(name);

			ForestMonitorService.forestLoss(startYear, endYear, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, name);
		    	$scope.showForestLossOpacitySlider = true;
		    	$scope.removeShownGeoJson();
		    }, function (error) {
		        console.log(error);
		    });
		};

		/* Forest Change */
		$scope.showForestChangeOpacitySlider = false;
		$scope.forestChangeOpacitySliderValue = null;

		/* slider init */
		$('#forest-change-opacity-slider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			}
		})
		.on('slideStart', function (event) {
			$scope.forestChangeOpacitySliderValue = $(this).data('slider').getValue();
		})
		.on('slideStop', function (event) {
		    var value = $(this).data('slider').getValue();
		    if (value !== $scope.forestChangeOpacitySliderValue) {
		    	$scope.overlays.forestChange.setOpacity(value);
		    }
		});

		$scope.calculateForestChange = function (startYear, endYear) {

			ForestMonitorService.forestChange(startYear, endYear, $scope.shape, $scope.areaSelectFrom, $scope.areaName)
		    .then(function (data) {
		    	loadMap(data.eeMapId, data.eeMapToken, 'forestChange');
		    	$scope.showForestChangeOpacitySlider = true;
		    	$scope.removeShownGeoJson();
		    }, function (error) {
		        console.log(error);
		    });
		};
	
	});

})();