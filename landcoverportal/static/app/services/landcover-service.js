(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('LandCoverService', function ($http) {

        //this.getLandCoverMap = function (primitives, year, shape, areaSelectFrom, areaName, v1, type) {
        this.getLandCoverMap = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var v1 = options.v1;
            var type = options.type;

            //if (typeof(type) === 'undefined') type = 'landcover';
            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-ipcc') {
                url = '/api/myanmar-ipcc/';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'landcovermap'
                }
            };

            if (v1) {
                req.params.version = 'v1';
            }

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else if (shape) {
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getStats = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var v1 = options.v1;
            var type = options.type;

            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-fra') {
                url = '/api/myanmar-ipcc';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'get-stats'
                }
            };

            if (v1) {
                req.params.version = 'v1';
            }

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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getPrimitiveMap = function (index, year, shape, areaSelectFrom, areaName, type) {

            var url = '/api/landcover/';
            if (type === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (type === 'myanmar-fra') {
                url = '/api/myanmar-ipcc';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    index: index
                },
                params: {
                    action: 'primitive'
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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        //this.getDownloadURL = function (type, shape, areaSelectFrom, areaName, year, primitives, index, serviceType) {
        this.getDownloadURL = function (options) {
            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var v1 = options.v1;
            var type = options.type;
            var index = options.index;
            var serviceType = options.serviceType;

            var url = '/api/landcover/';
            if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-ipcc';
            }

            var req = {
                method: 'POST',
                url: url,
                data: {
                    year: year,
                    type: type,
                    primitives: primitives.toString(),
                    index: index
                },
                params: {
                    action: 'get-download-url'
                }
            };

            if (v1) {
                req.params.version = 'v1';
            }

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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        //this.saveToDrive = function (type, shape, areaSelectFrom, areaName, year, primitives, fileName, index, serviceType) {
        this.saveToDrive = function (options) {
            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var areaSelectFrom = options.areaSelectFrom;
            var areaName = options.areaName;
            var v1 = options.v1;
            var type = options.type;
            var index = options.index;
            var serviceType = options.serviceType;
            var fileName = options.fileName;

            var url = '/api/landcover/';
            if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-ipcc';
            }

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    type: type,
                    primitives: primitives.toString(),
                    fileName: fileName,
                    index: index
                },
                params: {
                    action: 'download-to-drive'
                }
            };

            if (v1) {
                req.params.version = 'v1';
            }

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
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;

        };

    });

})();
