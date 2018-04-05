module.exports = {
  template: require('./main.html'),
  controller: mainCtrl
};

function mainCtrl($scope, $log, $document) {
  $scope.showRowData = false;
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
      cellRenderer: CheckBoxCellRenderer
    },
    {headerName: 'Date Test', field: 'date', editable: true, cellEditor: 'datePicker', cellClass: 'cell-editable'}
  ];

  // cell renderer class
  function CheckBoxCellRenderer() {}

  // init method gets the details of the cell to be rendere
  CheckBoxCellRenderer.prototype.init = function (params) {
    this.checkbox = $document[0].createElement('span');
    this.checkbox.classList.add('ag-selection-checkbox');
    if (params.value) {
      this.checkbox.innerHTML += '<span class="ag-icon ag-icon-checkbox-checked"></span>';
    } else {
      this.checkbox.innerHTML += '<span class="ag-icon ag-icon-checkbox-unchecked"></span>';
    }
    this.checkbox.innerHTML += '</span>';
    this.eventListener = clickEventHandler;

    this.checkbox.addEventListener('click', this.eventListener);

    function clickEventHandler(event) {
      $scope.$apply(function () {
        $scope.gridOptions.rowData[params.rowIndex].blockAutoPay = !$scope.gridOptions.rowData[params.rowIndex].blockAutoPay;
      });
      event.target.classList.toggle('ag-icon-checkbox-checked');
      event.target.classList.toggle('ag-icon-checkbox-unchecked');
    }
  };

  CheckBoxCellRenderer.prototype.getGui = function () {
    return this.checkbox;
  };

  // gets called whenever the user gets the cell to refresh
  CheckBoxCellRenderer.prototype.refresh = function () {
    return true;
  };

  // gets called when the cell is removed from the grid
  CheckBoxCellRenderer.prototype.destroy = function () {
    // do cleanup, remove event listener from button
    this.checkbox.removeEventListener('click', this.eventListener);
  };

  $scope.gridOptions = {
    components: {
      datePicker: getDatePicker()
    },
    columnDefs: columnDefs,
    rowData: generateRowData(),
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

  function generateRowData() {
    var firstNames = ['Sophie', 'Isabelle', 'Emily', 'Olivia', 'Lily', 'Chloe', 'Isabella', 'Amelia', 'Jessica', 'Sophia', 'Ava', 'Charlotte', 'Mia', 'Lucy', 'Grace', 'Ruby', 'Ella', 'Evie', 'Freya', 'Isla', 'Poppy', 'Daisy', 'Layla'];
    var lastNames = ['Beckham', 'Black', 'Braxton', 'Brennan', 'Brock', 'Bryson', 'Cadwell', 'Cage', 'Carson', 'Chandler', 'Cohen', 'Cole', 'Corbin', 'Dallas', 'Dalton', 'Dane', 'Donovan', 'Easton', 'Fisher', 'Fletcher', 'Grady', 'Greyson', 'Griffin', 'Gunner', 'Hayden', 'Hudson', 'Hunter', 'Jacoby', 'Jagger', 'Jaxon', 'Jett', 'Kade', 'Kane', 'Keating', 'Keegan', 'Kingston', 'Kobe'];
    var payTypes = ['Hourly', 'Salary'];

    var fakeData = [];
    for (var i = 0; i <= 10; i += 1) {
      var payType = payTypes[Math.floor(Math.random() * 2)];
      var salary = getRandomSalary(payType, i);

      fakeData.push({
        eeNum: 'B' + (10 + i),
        payNum: Math.floor(Math.random() * 6),
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        payType: payType,
        salary: salary,
        blockAutoPay: (Math.floor(Math.random() * 2) === 1),
        date: ''
      });
    }
    return fakeData;

    function getRandomSalary(payType, i) {
      if (payType === 'Hourly') {
        return (Math.random() * ((i % 10) + 1) * 10).toFixed(2);
      }
      return ((Math.random() * (i % 10) * 2000) + 50000).toFixed(2);
    }
  }

  // Context Menu
  function getContextMenuItems(params) {
    $log.log('params', params);
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

  // Date Picker
  function getDatePicker() {
    // function to act as a class
    function Datepicker() {}

    // gets called once before the renderer is used
    Datepicker.prototype.init = function (params) {
      // create the cell
      this.eInput = $document[0].createElement('input');
      this.eInput.value = params.value;

      // https://jqueryui.com/datepicker/
      angular.element(this.eInput).datepicker({
        dateFormat: 'dd/mm/yy'
      });
    };

    // gets called once when grid ready to insert the element
    Datepicker.prototype.getGui = function () {
      return this.eInput;
    };

    // focus and select can be done after the gui is attached
    Datepicker.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };

    // returns the new value after editing
    Datepicker.prototype.getValue = function () {
      return this.eInput.value;
    };

    // any cleanup we need to be done here
    Datepicker.prototype.destroy = function () {
      // but this example is simple, no cleanup, we could
      // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    Datepicker.prototype.isPopup = function () {
      // and we could leave this method out also, false is the default
      return false;
    };

    return Datepicker;
  }
}
