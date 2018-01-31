(function () {
	
	'use strict';
	
	angular.module('landcoverportal')
	.service('ForestMonitorService', function ($http, $q) {

		this.treeCanopyChange = function (year, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/forest-monitor/api/',
				data: {
					year: year
				},
				params: {
					action: 'tree-canopy'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.treeHeightChange = function (year, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/forest-monitor/api/',
				data: {
					year: year
				},
				params: {
					action: 'tree-height'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestGain = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/forest-monitor/api/',
				data: {
					startYear: startYear,
					endYear: endYear
				},
				params: {
					action: 'forest-gain'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestLoss = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/forest-monitor/api/',
				data: {
					startYear: startYear,
					endYear: endYear
				},
				params: {
					action: 'forest-loss'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		this.forestChange = function (startYear, endYear, shape, areaSelectFrom, areaName) {

			var req = {
				method: 'POST',
				url: '/forest-monitor/api/',
				data: {
					startYear: startYear,
					endYear: endYear
				},
				params: {
					action: 'forest-change'
				}
			};

			if (areaSelectFrom && areaName) {
				req.data.areaSelectFrom = areaSelectFrom;
				req.data.areaName = areaName;
			} else {
				var shapeType = shape.type;
				if (shapeType === 'rectangle' || shapeType === 'polygon') {
					req.data.shape = shapeType;
					req.data.geom = shape.geom.toString();
				} else if (shapeType === 'circle') {
					req.data.shape = shapeType;
					req.data.radius = shape.radius;
					req.data.center = shape.center.toString();
				}
			}

			var promise = $http(req)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};
		
	});
	
})();