module.exports = {
  template: require('./main.html'),
  controller: mainCtrl
};

mainCtrl.$inject = ['$scope', '$log', '$document', 'fakeRowDataService', 'CheckBoxCellRendererBuilderService', 'DatePickerBuilderService'];

function mainCtrl($scope, $log, $document, fakeRowDataService, CheckBoxCellRendererBuilderService, DatePickerBuilderService) { // eslint-disable-line max-params
  var columnDefs = [
    {headerName: '', width: 65, field: 'isSelected', headerCheckboxSelection: true, checkboxSelection: true, suppressSorting: false, suppressMenu: true, pinned: true},
    {headerName: 'EE #', field: 'eeNum'},
    {headerName: 'Pay #', field: 'payNum'},
    {headerName: 'First Name', field: 'firstName'},
    {headerName: 'Last Name', field: 'lastName'},
    {
      headerName: 'Pay Type',
      field: 'payType',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Hourly', 'Salary']
      },
      editable: true,
      cellClass: 'cell-editable'
    },
    {headerName: 'Base Rate / Salary', field: 'salary', editable: true, cellClass: 'cell-editable'},
    {
      headerName: 'Block AutoPay',
      field: 'blockAutoPay',
      cellRenderer: CheckBoxCellRendererBuilderService.build(blockAutoPayClickHandler)
    },
    {headerName: 'Date Test', field: 'date', editable: true, cellEditor: 'datePicker', cellClass: 'cell-editable'}
  ];

  function blockAutoPayClickHandler(event) {
    var rowIndex = getRowIndex(event);
    $scope.$apply(function () {
      $scope.gridOptions.rowData[rowIndex].blockAutoPay = !$scope.gridOptions.rowData[rowIndex].blockAutoPay;
    });
    event.target.classList.toggle('ag-icon-checkbox-checked');
    event.target.classList.toggle('ag-icon-checkbox-unchecked');

    function getRowIndex(event) {
      return parseInt(angular.element(event.target).parents('.ag-row').get(0).getAttribute('row-index'), 10);
    }
  }

  $scope.gridOptions = {
    components: {
      datePicker: DatePickerBuilderService.build()
    },
    columnDefs: columnDefs,
    //rowData: fakeRowDataService.generateRows(), // For "In Memory" ag-grid data model
    // Begin infinite model config
    datasource: fakeRowDataService.getInfiniteScrollDataSource(),
    rowBuffer: 0,
    // tell grid we want virtual row model type
    rowModelType: 'infinite',
    // how big each page in our page cache will be, default is 100
    paginationPageSize: 100,
    // how many extra blank rows to display to the user at the end of the dataset,
    // which sets the vertical scroll and then allows the grid to request viewing more rows of data.
    // default is 1, ie show 1 row.
    cacheOverflowSize: 2,
    // how many server side requests to send at a time. if user is scrolling lots, then the requests
    // are throttled down
    maxConcurrentDatasourceRequests: 2,
    // how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
    // the grid is loading from the users perspective (as we have a spinner in the first col)
    infiniteInitialRowCount: 1,
    // how many pages to store in cache. default is undefined, which allows an infinite sized cache,
    // pages are never purged. this should be set for large data to stop your browser from getting
    // full of data
    maxBlocksInCache: 2,
    // End infinite model config
    rowSelection: 'multiple',
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    suppressRowClickSelection: true,
    suppressMenuHide: true,
    singleClickEdit: true,
    enableRangeSelection: true,
    getContextMenuItems: getContextMenuItems,
    allowContextMenuWithControlKey: true,
    showToolPanel: true,
    onModelUpdated: function () {
      $log.log('Model Update', $scope.gridOptions.api.getModel());
    },
    onCellEditingStarted: function (event) {
      $log.log('cellEditingStarted', event);
    },
    onCellEditingStopped: function (event) {
      $log.log('cellEditingStopped', event);
    },
    postProcessPopup: function (params) {
      $log.log('Popup triggered', params);
      // called for column and context menus
      // When Context menu, params.eventSource === null

      // Positioning has to be done in js
      // var newLeft = parseInt(params.ePopup.style.left, 10) - 150;
      // params.ePopup.style.left = newLeft + 'px';
      // var newTop = parseInt(params.ePopup.style.top, 10) - 1;
      // params.ePopup.style.top = newTop + 'px';
      // Set width to current column width
      // params.ePopup.style.width = params.column.actualWidth + 'px';
    }
  };

  $scope.addNewRow = function () {
    $scope.gridOptions.api.updateRowData({add: [fakeRowDataService.createRow()]});
  };

  $scope.removeSelectedRows = function () {
    var selectedData = $scope.gridOptions.api.getSelectedRows();
    $scope.gridOptions.api.updateRowData({remove: selectedData});
  };

  $scope.toggleFirstNameColumn = function () {
    var columns = $scope.gridOptions.columnApi.getAllColumns();
    var firstNameColumn = columns.filter(function (column) {
      return column.colId === 'firstName';
    })[0];
    $scope.gridOptions.columnApi.setColumnVisible(firstNameColumn, !firstNameColumn.visible);
  };

  // Context Menu
  function getContextMenuItems(params) {
    $log.log(params);
    var result = [
      {
        name: 'Add Line',
        action: logActionName
      },
      {
        name: 'Add Check',
        action: logActionName
      },
      'separator',
      {
        name: 'Delete Check',
        action: logActionName
      },
      'separator',
      {
        name: 'Preview Check',
        action: logActionName
      },
      {
        name: 'Employee Profile',
        action: logActionName
      },
      {
        name: 'Detail View',
        action: logActionName
      }
    ];

    return result;

    function logActionName() {
      $log.log(this.name + ' was pressed');
    }
  }
}
