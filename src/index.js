var angular = require('angular');

require('angular-ui-router');

var agGrid = require('ag-grid/main-with-styles');
agGrid.initialiseAgGridWithAngular1(angular);

var routesConfig = require('./routes');

var main = require('./app/main');

require('./index.less');

angular
  .module('app', ['ui.router', 'agGrid'])
  .config(routesConfig)
  .component('app', main);
