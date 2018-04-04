module.exports = {
  template: require('./main.html'),
  controller: mainCtrl
};

function mainCtrl($scope, $log, $document) {
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
      editable: true
    },
    {headerName: 'Base Rate / Salary', field: 'salary', editable: true},
    {
      headerName: 'Block AutoPay',
      field: 'blockAutoPay',
      cellRenderer: CheckBoxCellRenderer
    }
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
    this.eventListener = function (event) {
      event.target.classList.toggle('ag-icon-checkbox-checked');
      event.target.classList.toggle('ag-icon-checkbox-unchecked');
    };

    this.checkbox.addEventListener('click', this.eventListener);
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
    columnDefs: columnDefs,
    rowData: generateRowData(),
    rowSelection: 'multiple',
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    suppressRowClickSelection: true,
    suppressMenuHide: true,
    singleClickEdit: true,
    onCellEditingStarted: function (event) {
      $log.log('cellEditingStarted', event);
    },
    onCellEditingStopped: function (event) {
      $log.log('cellEditingStopped', event);
    },
    postProcessPopup: function (params) {
      $log.log('popup', params.ePopup);
      // Need to adjust left and top here by parsing value, etc.
    }
  };

  function generateRowData() {
    var firstNames = ['Sophie', 'Isabelle', 'Emily', 'Olivia', 'Lily', 'Chloe', 'Isabella', 'Amelia', 'Jessica', 'Sophia', 'Ava', 'Charlotte', 'Mia', 'Lucy', 'Grace', 'Ruby', 'Ella', 'Evie', 'Freya', 'Isla', 'Poppy', 'Daisy', 'Layla'];
    var lastNames = ['Beckham', 'Black', 'Braxton', 'Brennan', 'Brock', 'Bryson', 'Cadwell', 'Cage', 'Carson', 'Chandler', 'Cohen', 'Cole', 'Corbin', 'Dallas', 'Dalton', 'Dane', 'Donovan', 'Easton', 'Fisher', 'Fletcher', 'Grady', 'Greyson', 'Griffin', 'Gunner', 'Hayden', 'Hudson', 'Hunter', 'Jacoby', 'Jagger', 'Jaxon', 'Jett', 'Kade', 'Kane', 'Keating', 'Keegan', 'Kingston', 'Kobe'];
    var payTypes = ['Hourly', 'Salary'];

    var fakeData = [];
    for (var i = 0; i <= 10000; i += 1) {
      var payType = payTypes[Math.floor(Math.random() * 2)];
      var salary = getRandomSalary(payType, i);

      fakeData.push({
        eeNum: 'B' + (10 + i),
        payNum: Math.floor(Math.random() * 6),
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        payType: payType,
        salary: salary,
        blockAutoPay: (Math.floor(Math.random() * 2) === 1)
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
}
