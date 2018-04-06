var angular = require('angular');

require('angular-ui-router');

var enterprise = require('ag-grid-enterprise/dist/ag-grid-enterprise');
enterprise.LicenseManager.setLicenseKey('Evaluation_License_Valid_Until_6_June_2018__MTUyODIzOTYwMDAwMA==4c69615c372b7cdc6c4bda8601ac106b');
enterprise.initialiseAgGridWithAngular1(angular);

var routesConfig = require('./routes');

var main = require('./app/main');

var fakeRowDataService = require('./app/fakeRowData.service');
var CheckBoxCellRendererBuilderService = require('./app/CheckBoxCellRendererBuilder.service');
var DatePickerBuilderService = require('./app/DatePickerBuilder.service');

require('./index.less');

angular
  .module('app', ['ui.router', 'agGrid'])
  .config(routesConfig)
  .component('app', main)
  .service('fakeRowDataService', fakeRowDataService)
  .service('CheckBoxCellRendererBuilderService', CheckBoxCellRendererBuilderService)
  .service('DatePickerBuilderService', DatePickerBuilderService);
